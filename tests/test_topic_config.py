import json
import tempfile
import unittest
from pathlib import Path

from basis_point.config import load_topic_library


class TopicConfigTest(unittest.TestCase):
    def test_load_topic_library(self) -> None:
        payload = {
            "topics": [
                {
                    "slug": "ai",
                    "label": "AI",
                    "description": "AI coverage",
                    "editorial_topics": ["ai", "models"],
                    "sources": [
                        {
                            "name": "Example",
                            "url": "https://example.com",
                            "type": "web",
                            "weight": 1.2,
                            "max_items": 3,
                        }
                    ],
                }
            ]
        }
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "topics.json"
            path.write_text(json.dumps(payload))
            topics = load_topic_library(path)

        self.assertEqual(len(topics), 1)
        self.assertEqual(topics[0].slug, "ai")
        self.assertEqual(topics[0].topics, ["ai", "models"])
        self.assertEqual(topics[0].sources[0].name, "Example")
