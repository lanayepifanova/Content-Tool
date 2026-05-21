from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class SourceConfig:
    name: str
    url: str
    type: str = "feed"
    weight: float = 1.0
    max_items: int = 5


@dataclass(slots=True)
class AppConfig:
    topics: list[str] = field(default_factory=list)
    max_articles: int = 8
    min_article_chars: int = 600
    openai_model: str = "gpt-5.4-mini"
    sources: list[SourceConfig] = field(default_factory=list)


@dataclass(slots=True)
class TopicConfig:
    slug: str
    label: str
    description: str
    topics: list[str] = field(default_factory=list)
    max_articles: int = 8
    min_article_chars: int = 600
    openai_model: str = "gpt-5.4-mini"
    sources: list[SourceConfig] = field(default_factory=list)


@dataclass(slots=True)
class Article:
    source_name: str
    source_url: str
    title: str
    url: str
    published_at: datetime | None
    summary: str
    text: str
    score: float = 0.0
    score_reasons: list[str] = field(default_factory=list)


@dataclass(slots=True)
class GeneratedBundle:
    recommended_readings_markdown: str
    youtube_script: str
    short_video_script: str
    newsletter: str
