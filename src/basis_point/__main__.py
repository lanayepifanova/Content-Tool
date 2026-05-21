from __future__ import annotations

import argparse
import json
import sys

from basis_point.pipeline import run_pipeline
from basis_point.server import serve


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="basis-point",
        description="Scrape configured news sources, rank stories, and generate content outputs.",
    )
    parser.add_argument(
        "command",
        choices=["run", "serve"],
        help="Pipeline command to execute.",
    )
    parser.add_argument(
        "--config",
        default="config/sources.example.json",
        help="Path to the source configuration JSON file.",
    )
    parser.add_argument(
        "--output-dir",
        default="output",
        help="Directory for generated files.",
    )
    parser.add_argument(
        "--topics-config",
        default="config/topics.json",
        help="Path to the topic bubble configuration JSON file.",
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Host interface for the local web app.",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port for the local web app.",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "run":
        result = run_pipeline(args.config, args.output_dir)
        sys.stdout.write(json.dumps(result, indent=2) + "\n")
    if args.command == "serve":
        serve(
            topics_config_path=args.topics_config,
            host=args.host,
            port=args.port,
            output_dir=args.output_dir,
        )


if __name__ == "__main__":
    main()
