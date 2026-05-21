from __future__ import annotations

import html
import json
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import UTC, datetime
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser

from basis_point.models import Article, AppConfig, SourceConfig

USER_AGENT = "basis-point/0.1 (+https://example.invalid)"


def fetch_url(url: str, timeout: int = 20) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="replace")


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    cleaned = value.strip()
    try:
        if cleaned.endswith("Z"):
            return datetime.fromisoformat(cleaned.replace("Z", "+00:00"))
        return datetime.fromisoformat(cleaned)
    except ValueError:
        pass
    try:
        return parsedate_to_datetime(cleaned)
    except (TypeError, ValueError, IndexError):
        return None


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []
        self._current_href: str | None = None
        self._buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "a":
            self._current_href = dict(attrs).get("href")
            self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._current_href is not None:
            self._buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self._current_href:
            self.links.append((self._current_href, " ".join(self._buffer).strip()))
            self._current_href = None
            self._buffer = []


class ArticleExtractor(HTMLParser):
    BLOCK_TAGS = {"p", "article", "div", "section", "main", "li", "h1", "h2", "h3"}
    DROP_TAGS = {"script", "style", "noscript", "svg"}

    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.description = ""
        self._in_title = False
        self._drop_depth = 0
        self._text_chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        if tag in self.DROP_TAGS:
            self._drop_depth += 1
        if tag == "title":
            self._in_title = True
        if tag == "meta":
            name = (attr_map.get("name") or attr_map.get("property") or "").lower()
            if name in {"description", "og:description", "twitter:description"} and not self.description:
                self.description = html.unescape(attr_map.get("content") or "").strip()
        if tag in self.BLOCK_TAGS:
            self._text_chunks.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag in self.DROP_TAGS and self._drop_depth:
            self._drop_depth -= 1
        if tag in self.BLOCK_TAGS:
            self._text_chunks.append("\n")

    def handle_data(self, data: str) -> None:
        if self._drop_depth:
            return
        text = html.unescape(data).strip()
        if not text:
            return
        if self._in_title and not self.title:
            self.title = text
        self._text_chunks.append(text)

    def article_text(self) -> str:
        text = " ".join(self._text_chunks)
        text = re.sub(r"\s+", " ", text)
        return text.strip()


def looks_like_article(url: str, base_netloc: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    if not parsed.scheme.startswith("http"):
        return False
    if parsed.netloc and parsed.netloc != base_netloc:
        return False
    path = parsed.path.lower()
    if any(token in path for token in ["/live/", "/video/", "/tag/", "/topics/", "/authors/"]):
        return False
    return bool(re.search(r"/\d{4}/\d{2}/|/20\d{2}/|-[a-z0-9]+/?$", path))


def extract_article(url: str, source: SourceConfig) -> Article | None:
    try:
        raw_html = fetch_url(url)
    except urllib.error.URLError:
        return None

    parser = ArticleExtractor()
    parser.feed(raw_html)
    text = parser.article_text()
    if not parser.title and not parser.description and len(text) < 200:
        return None

    published_at = None
    date_match = re.search(
        r'"(datePublished|dateCreated)"\s*:\s*"([^"]+)"',
        raw_html,
        flags=re.IGNORECASE,
    )
    if date_match:
        published_at = parse_datetime(date_match.group(2))

    return Article(
        source_name=source.name,
        source_url=source.url,
        title=parser.title or url,
        url=url,
        published_at=published_at,
        summary=parser.description,
        text=text,
    )


def parse_feed(xml_text: str, source: SourceConfig) -> list[Article]:
    root = ET.fromstring(xml_text)
    items: list[Article] = []

    if root.tag.lower().endswith("rss"):
        nodes = root.findall("./channel/item")
        for node in nodes[: source.max_items]:
            items.append(
                Article(
                    source_name=source.name,
                    source_url=source.url,
                    title=(node.findtext("title") or "").strip(),
                    url=(node.findtext("link") or "").strip(),
                    published_at=parse_datetime(node.findtext("pubDate")),
                    summary=(node.findtext("description") or "").strip(),
                    text=(node.findtext("description") or "").strip(),
                )
            )
    else:
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        nodes = root.findall("./atom:entry", ns)
        for node in nodes[: source.max_items]:
            link = node.find("atom:link", ns)
            href = ""
            if link is not None:
                href = link.attrib.get("href", "")
            items.append(
                Article(
                    source_name=source.name,
                    source_url=source.url,
                    title=(node.findtext("atom:title", "", ns) or "").strip(),
                    url=href.strip(),
                    published_at=parse_datetime(node.findtext("atom:updated", "", ns)),
                    summary=(node.findtext("atom:summary", "", ns) or "").strip(),
                    text=(node.findtext("atom:summary", "", ns) or "").strip(),
                )
            )

    return [article for article in items if article.title and article.url]


def scrape_web_source(source: SourceConfig) -> list[Article]:
    try:
        raw_html = fetch_url(source.url)
    except urllib.error.URLError:
        return []

    parser = LinkCollector()
    parser.feed(raw_html)

    base = urllib.parse.urlparse(source.url)
    candidates: list[str] = []
    seen: set[str] = set()
    for href, _ in parser.links:
        absolute = urllib.parse.urljoin(source.url, href)
        absolute = absolute.split("#", 1)[0]
        if absolute in seen:
            continue
        if not looks_like_article(absolute, base.netloc):
            continue
        seen.add(absolute)
        candidates.append(absolute)
        if len(candidates) >= source.max_items * 3:
            break

    articles: list[Article] = []
    for candidate in candidates:
        article = extract_article(candidate, source)
        if article is not None:
            articles.append(article)
        if len(articles) >= source.max_items:
            break
    return articles


def hydrate_articles(articles: list[Article], config: AppConfig, source: SourceConfig) -> list[Article]:
    hydrated: list[Article] = []
    for article in articles:
        if len(article.text) >= config.min_article_chars:
            hydrated.append(article)
            continue
        enriched = extract_article(article.url, source)
        if enriched is not None and len(enriched.text) >= config.min_article_chars:
            if not article.published_at and enriched.published_at:
                article.published_at = enriched.published_at
            article.summary = article.summary or enriched.summary
            article.text = enriched.text
            article.title = article.title or enriched.title
            hydrated.append(article)
    return hydrated


def load_source_articles(source: SourceConfig, config: AppConfig) -> list[Article]:
    if source.type == "web":
        return scrape_web_source(source)

    try:
        raw = fetch_url(source.url)
    except urllib.error.URLError:
        return []

    articles = parse_feed(raw, source)
    return hydrate_articles(articles, config, source)
