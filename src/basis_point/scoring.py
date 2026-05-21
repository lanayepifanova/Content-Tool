from __future__ import annotations

import math
import re
from datetime import UTC, datetime

from basis_point.models import Article, AppConfig, SourceConfig


def score_article(article: Article, config: AppConfig, source: SourceConfig) -> Article:
    haystack = " ".join([article.title, article.summary, article.text]).lower()
    keyword_hits = 0
    hit_topics: list[str] = []

    for topic in config.topics:
        pattern = re.compile(rf"\b{re.escape(topic.lower())}\b")
        matches = len(pattern.findall(haystack))
        if matches:
            keyword_hits += matches
            hit_topics.append(topic)

    recency_score = 0.0
    if article.published_at is not None:
        now = datetime.now(UTC)
        age_hours = max((now - article.published_at.astimezone(UTC)).total_seconds() / 3600, 0.0)
        recency_score = max(0.0, 20 - min(age_hours / 6, 20))

    length_score = min(math.log(max(len(article.text), 50), 10) * 3, 8)
    total = source.weight * 10 + (keyword_hits * 7) + recency_score + length_score

    reasons = [
        f"source weight={source.weight}",
        f"keyword hits={keyword_hits}",
        f"length score={length_score:.1f}",
    ]
    if recency_score:
        reasons.append(f"recency score={recency_score:.1f}")
    if hit_topics:
        reasons.append("topics=" + ", ".join(hit_topics[:5]))

    article.score = total
    article.score_reasons = reasons
    return article


def rank_articles(articles: list[Article], config: AppConfig) -> list[Article]:
    return sorted(articles, key=lambda item: item.score, reverse=True)[: config.max_articles]
