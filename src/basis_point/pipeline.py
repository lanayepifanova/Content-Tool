from __future__ import annotations

import json
from pathlib import Path

from basis_point.config import load_config
from basis_point.generator import generate_bundle
from basis_point.models import AppConfig, Article, GeneratedBundle
from basis_point.scoring import rank_articles, score_article
from basis_point.sources import load_source_articles


def collect_ranked_articles(config: AppConfig) -> list[Article]:
    all_articles: list[Article] = []
    for source in config.sources:
        articles = load_source_articles(source, config)
        for article in articles:
            score_article(article, config, source)
            all_articles.append(article)
    return rank_articles(all_articles, config)


def generate_for_config(config: AppConfig) -> tuple[list[Article], GeneratedBundle]:
    ranked = collect_ranked_articles(config)
    bundle = generate_bundle(ranked, config.topics, config.openai_model)
    return ranked, bundle


def run_pipeline(config_path: str, output_dir: str) -> dict[str, str]:
    config = load_config(config_path)
    ranked, bundle = generate_for_config(config)

    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    recommended_path = out_dir / "recommended_readings.md"
    youtube_path = out_dir / "youtube_script.txt"
    short_path = out_dir / "short_video_script.txt"
    newsletter_path = out_dir / "newsletter.md"
    ranked_path = out_dir / "ranked_articles.json"

    recommended_path.write_text(bundle.recommended_readings_markdown)
    youtube_path.write_text(bundle.youtube_script)
    short_path.write_text(bundle.short_video_script)
    newsletter_path.write_text(bundle.newsletter)
    ranked_path.write_text(
        json.dumps(
            [
                {
                    "title": article.title,
                    "url": article.url,
                    "source": article.source_name,
                    "score": article.score,
                    "score_reasons": article.score_reasons,
                    "published_at": article.published_at.isoformat() if article.published_at else None,
                }
                for article in ranked
            ],
            indent=2,
        )
    )

    return {
        "recommended_readings": str(recommended_path),
        "youtube_script": str(youtube_path),
        "short_video_script": str(short_path),
        "newsletter": str(newsletter_path),
        "ranked_articles": str(ranked_path),
    }
