import unittest
from datetime import UTC, datetime

from basis_point.models import AppConfig, Article, SourceConfig
from basis_point.scoring import score_article


class ScoreArticleTest(unittest.TestCase):
    def test_score_article_rewards_topic_hits(self) -> None:
        config = AppConfig(topics=["ai", "inflation"])
        source = SourceConfig(name="Test", url="https://example.com", weight=1.2)
        article = Article(
            source_name="Test",
            source_url="https://example.com",
            title="AI firms respond to inflation pressure",
            url="https://example.com/story",
            published_at=datetime.now(UTC),
            summary="A quick summary",
            text="AI and inflation both matter in this article.",
        )

        scored = score_article(article, config, source)

        self.assertGreater(scored.score, 20)
        self.assertTrue(any("topics=" in reason for reason in scored.score_reasons))
