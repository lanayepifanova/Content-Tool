from __future__ import annotations

import argparse

from basis_point.server import serve


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="run",
        description="Launch the Basis Point local topic-bubble app.",
    )
    parser.add_argument(
        "--topics-config",
        default="config/topics.json",
        help="Path to the topic bubble configuration JSON file.",
    )
    parser.add_argument(
        "--output-dir",
        default="output",
        help="Directory for generated files.",
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
    args = build_parser().parse_args()
    serve(
        topics_config_path=args.topics_config,
        host=args.host,
        port=args.port,
        output_dir=args.output_dir,
    )
