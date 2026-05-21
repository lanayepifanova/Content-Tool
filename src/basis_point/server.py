from __future__ import annotations

import json
import mimetypes
import threading
from dataclasses import asdict
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from basis_point.config import load_topic_library
from basis_point.models import AppConfig, TopicConfig
from basis_point.pipeline import collect_ranked_articles, generate_for_config

STATIC_DIR = Path(__file__).resolve().parent / "web"


def _topic_to_app_config(topic: TopicConfig) -> AppConfig:
    return AppConfig(
        topics=topic.topics,
        max_articles=topic.max_articles,
        min_article_chars=topic.min_article_chars,
        openai_model=topic.openai_model,
        sources=topic.sources,
    )


def _json_response(handler: BaseHTTPRequestHandler, payload: object, status: int = 200) -> None:
    body = json.dumps(payload, indent=2).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def _send_static(handler: BaseHTTPRequestHandler, relative_path: str) -> None:
    clean_path = relative_path.lstrip("/") or "index.html"
    file_path = (STATIC_DIR / clean_path).resolve()
    if STATIC_DIR not in file_path.parents and file_path != STATIC_DIR / "index.html":
        handler.send_error(HTTPStatus.NOT_FOUND)
        return
    if not file_path.exists() or not file_path.is_file():
        handler.send_error(HTTPStatus.NOT_FOUND)
        return
    content = file_path.read_bytes()
    content_type, _ = mimetypes.guess_type(str(file_path))
    handler.send_response(HTTPStatus.OK)
    handler.send_header("Content-Type", f"{content_type or 'application/octet-stream'}; charset=utf-8")
    handler.send_header("Content-Length", str(len(content)))
    handler.end_headers()
    handler.wfile.write(content)


def _build_handler(
    topics_config_path: str,
    output_dir: str,
) -> type[BaseHTTPRequestHandler]:
    topic_library = {item.slug: item for item in load_topic_library(topics_config_path)}
    lock = threading.Lock()

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:  # noqa: N802
            parsed = urlparse(self.path)
            if parsed.path == "/api/topics":
                payload = {
                    "topics": [
                        {
                            "slug": item.slug,
                            "label": item.label,
                            "description": item.description,
                            "editorial_topics": item.topics,
                            "sources": [asdict(source) for source in item.sources],
                        }
                        for item in topic_library.values()
                    ]
                }
                _json_response(self, payload)
                return

            if parsed.path.startswith("/api/"):
                self.send_error(HTTPStatus.NOT_FOUND)
                return

            if parsed.path == "/":
                _send_static(self, "index.html")
                return

            _send_static(self, parsed.path)

        def do_POST(self) -> None:  # noqa: N802
            parsed = urlparse(self.path)
            if parsed.path not in {"/api/generate", "/api/discover"}:
                self.send_error(HTTPStatus.NOT_FOUND)
                return

            content_length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(content_length) if content_length else b"{}"
            try:
                payload = json.loads(body.decode("utf-8"))
            except json.JSONDecodeError:
                _json_response(self, {"error": "Invalid JSON body."}, status=400)
                return
            topic_slug = payload.get("topic")
            script_type = payload.get("script_type", "short")
            if topic_slug not in topic_library:
                _json_response(self, {"error": "Unknown topic."}, status=404)
                return
            if script_type not in {"short", "youtube", "newsletter", "all"}:
                _json_response(self, {"error": "Invalid script_type."}, status=400)
                return

            with lock:
                topic = topic_library[topic_slug]
                config = _topic_to_app_config(topic)
                if parsed.path == "/api/discover":
                    ranked = collect_ranked_articles(config)
                    _json_response(
                        self,
                        {
                            "topic": {
                                "slug": topic.slug,
                                "label": topic.label,
                                "description": topic.description,
                            },
                            "ranked_articles": [
                                {
                                    "title": article.title,
                                    "url": article.url,
                                    "source": article.source_name,
                                    "score": article.score,
                                    "score_reasons": article.score_reasons,
                                }
                                for article in ranked
                            ],
                        },
                    )
                    return

                ranked, bundle = generate_for_config(config)

            file_slug = f"{topic.slug}_{script_type}"
            write_dir = Path(output_dir)
            write_dir.mkdir(parents=True, exist_ok=True)
            result_path = write_dir / f"{file_slug}.txt"
            selected_output = {
                "short": bundle.short_video_script,
                "youtube": bundle.youtube_script,
                "newsletter": bundle.newsletter,
                "all": "\n\n".join(
                    [
                        "# Recommended Readings",
                        bundle.recommended_readings_markdown,
                        "# YouTube Script",
                        bundle.youtube_script,
                        "# Short Video Script",
                        bundle.short_video_script,
                        "# Newsletter",
                        bundle.newsletter,
                    ]
                ),
            }[script_type]
            result_path.write_text(selected_output)

            _json_response(
                self,
                {
                    "topic": {
                        "slug": topic.slug,
                        "label": topic.label,
                        "description": topic.description,
                    },
                    "script_type": script_type,
                    "output": selected_output,
                    "recommended_readings": bundle.recommended_readings_markdown,
                    "ranked_articles": [
                        {
                            "title": article.title,
                            "url": article.url,
                            "source": article.source_name,
                            "score": article.score,
                        }
                        for article in ranked
                    ],
                    "saved_to": str(result_path),
                },
            )

        def log_message(self, format: str, *args: object) -> None:
            return

    return Handler


def serve(topics_config_path: str, host: str, port: int, output_dir: str) -> None:
    handler = _build_handler(topics_config_path, output_dir)
    server = ThreadingHTTPServer((host, port), handler)
    print(f"Basis Point running at http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
