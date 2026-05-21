# basis-point

`basis-point` is a Python CLI that:

- ingests a set of news sources
- scrapes article pages when needed
- ranks stories against your editorial themes
- supports saved topic bubbles in a local web app
- produces:
  - recommended readings
  - a YouTube script
  - an Instagram Reels / TikTok script
  - a newsletter draft

## Quick start

1. Use Python 3.11+.
2. Optionally export `OPENAI_API_KEY` if you want AI-generated scripts.
3. Edit [config/sources.example.json](/Users/lanayepifanova/basis-point/config/sources.example.json) with your own sources and topics.
4. Run:

```bash
PYTHONPATH=src python3 -m basis_point run --config config/sources.example.json --output-dir output
```

You can also install it as a local package and use:

```bash
python3 -m pip install -e .
basis-point run --config config/sources.example.json --output-dir output
```

If you want a one-word launcher for the local web app, install once and then use:

```bash
python3 -m pip install -e .
run
```

`run` is a console command provided by this package and defaults to:

- `--topics-config config/topics.json`
- `--output-dir output`
- `--host 127.0.0.1`
- `--port 8000`

You can still override them, for example:

```bash
run --port 8010
```

## Topic bubble app

The repo now includes a local web app backed by [config/topics.json](/Users/lanayepifanova/basis-point/config/topics.json). Each topic stores:

- a bubble label
- editorial keywords
- saved source URLs

Start it with:

```bash
PYTHONPATH=src python3 -m basis_point serve --topics-config config/topics.json --output-dir output --port 8000
```

Then open `http://127.0.0.1:8000`.

Clicking a topic bubble immediately:

- loads its saved sources in the left panel
- scrapes and ranks stories from those sources
- generates the selected output format
- saves the generated script into `output/`

## Config shape

```json
{
  "topics": ["markets", "ai", "inflation"],
  "max_articles": 8,
  "min_article_chars": 600,
  "openai_model": "gpt-5.4-mini",
  "sources": [
    {
      "name": "Reuters Markets",
      "url": "https://feeds.reuters.com/reuters/businessNews",
      "type": "feed",
      "weight": 1.5,
      "max_items": 6
    },
    {
      "name": "AP Politics",
      "url": "https://apnews.com/politics",
      "type": "web",
      "weight": 1.0,
      "max_items": 4
    }
  ]
}
```

## Output files

The run writes:

- `output/recommended_readings.md`
- `output/youtube_script.txt`
- `output/short_video_script.txt`
- `output/newsletter.md`
- `output/ranked_articles.json`

The web app also writes topic-specific outputs such as:

- `output/startups-vc-tech_short.txt`
- `output/markets-finance_youtube.txt`

## Notes

- `feed` sources are preferred because they are more stable than raw homepage scraping.
- `web` sources use basic same-domain link discovery and simple article extraction heuristics.
- If `OPENAI_API_KEY` is not set, the tool still generates deterministic template outputs so you can validate the pipeline end to end.
- Some sites in the starter topic library are paywalled or JS-heavy, so you should expect to refine source URLs over time. Replacing homepage URLs with feeds or section pages will improve reliability.
