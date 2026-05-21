from __future__ import annotations

import json
from pathlib import Path

from basis_point.models import AppConfig, SourceConfig, TopicConfig


def load_config(path: str | Path) -> AppConfig:
    data = json.loads(Path(path).read_text())
    sources = [SourceConfig(**source) for source in data.get("sources", [])]
    return AppConfig(
        topics=data.get("topics", []),
        max_articles=int(data.get("max_articles", 8)),
        min_article_chars=int(data.get("min_article_chars", 600)),
        openai_model=data.get("openai_model", "gpt-5.4-mini"),
        sources=sources,
    )


def load_topic_library(path: str | Path) -> list[TopicConfig]:
    data = json.loads(Path(path).read_text())
    topic_items = data.get("topics", [])
    library: list[TopicConfig] = []
    for item in topic_items:
        sources = [SourceConfig(**source) for source in item.get("sources", [])]
        library.append(
            TopicConfig(
                slug=item["slug"],
                label=item["label"],
                description=item.get("description", ""),
                topics=item.get("editorial_topics", item.get("topics", [])),
                max_articles=int(item.get("max_articles", 8)),
                min_article_chars=int(item.get("min_article_chars", 600)),
                openai_model=item.get("openai_model", "gpt-5.4-mini"),
                sources=sources,
            )
        )
    return library
