import unittest

from basis_point.models import SourceConfig
from basis_point.sources import parse_feed


class ParseFeedTest(unittest.TestCase):
    def test_parse_rss_feed(self) -> None:
        xml_text = """
        <rss version="2.0">
          <channel>
            <item>
              <title>Example headline</title>
              <link>https://example.com/story</link>
              <description>Example summary</description>
              <pubDate>Wed, 21 May 2026 14:00:00 GMT</pubDate>
            </item>
          </channel>
        </rss>
        """
        source = SourceConfig(name="Example", url="https://example.com/feed")
        items = parse_feed(xml_text, source)

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].title, "Example headline")
        self.assertEqual(items[0].url, "https://example.com/story")
