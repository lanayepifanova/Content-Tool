from __future__ import annotations

import json
import os
import textwrap
import urllib.request

from basis_point.models import Article, GeneratedBundle

OPENAI_API_URL = "https://api.openai.com/v1/responses"


def fallback_bundle(articles: list[Article], topics: list[str]) -> GeneratedBundle:
    reading_lines = ["# Recommended Readings", ""]
    if not articles:
        topic_text = ", ".join(topics[:4]) if topics else "your configured themes"
        message = (
            "No articles were ranked. Check network access, source URLs, or relax "
            f"`min_article_chars`. Current priority topics: {topic_text}."
        )
        return GeneratedBundle(
            recommended_readings_markdown="\n".join(reading_lines + [message]).strip(),
            youtube_script=message,
            short_video_script=message,
            newsletter=message,
        )

    for index, article in enumerate(articles, start=1):
        topic_text = ", ".join(topics[:4]) if topics else "top stories"
        reading_lines.extend(
            [
                f"## {index}. {article.title}",
                f"- Source: {article.source_name}",
                f"- Link: {article.url}",
                f"- Why it matters: This story is relevant to {topic_text} and scored highly in the source ranking.",
                f"- Summary: {(article.summary or article.text[:280]).strip()}",
                "",
            ]
        )

    summary_blob = "; ".join(article.title for article in articles[:5]) or "the day in news"
    youtube_script = textwrap.dedent(
        f"""
        Hook: Here are the biggest stories shaping the conversation right now: {summary_blob}.

        Intro:
        Today we're tracking the stories that matter most and why they deserve your attention.

        Main beats:
        {chr(10).join(f"- {article.title}: {(article.summary or article.text[:220]).strip()}" for article in articles[:5])}

        Close:
        If you want the full reading list, check the links and briefing notes.
        """
    ).strip()
    short_script = textwrap.dedent(
        f"""
        Hook:
        Stop scrolling. These are the stories worth your time today.

        Body:
        {chr(10).join(f"- {article.title}" for article in articles[:4])}

        CTA:
        Follow for the deeper breakdown and full newsletter.
        """
    ).strip()
    newsletter = textwrap.dedent(
        f"""
        Subject: Your news brief: {articles[0].title if articles else 'Top stories'}

        Intro:
        Here is the short list of what deserves your attention today.

        Rundown:
        {chr(10).join(f"- {article.title}: {(article.summary or article.text[:220]).strip()}" for article in articles[:5])}

        Outro:
        Reply with the themes you want tracked next.
        """
    ).strip()

    return GeneratedBundle(
        recommended_readings_markdown="\n".join(reading_lines).strip(),
        youtube_script=youtube_script,
        short_video_script=short_script,
        newsletter=newsletter,
    )


def build_prompt(articles: list[Article], topics: list[str]) -> str:
    article_lines = []
    for index, article in enumerate(articles, start=1):
        article_lines.append(
            "\n".join(
                [
                    f"[{index}] {article.title}",
                    f"Source: {article.source_name}",
                    f"URL: {article.url}",
                    f"Published: {article.published_at.isoformat() if article.published_at else 'unknown'}",
                    f"Summary: {(article.summary or article.text[:500]).strip()}",
                    f"Signals: {', '.join(article.score_reasons)}",
                ]
            )
        )
    topic_list = ", ".join(topics) if topics else "general news relevance"
    return textwrap.dedent(
        f"""
        You are an editorial strategist. Based on the source material below, produce a single JSON object with keys:
        recommended_readings_markdown, youtube_script, short_video_script, newsletter.

        Requirements:
        - recommended_readings_markdown: markdown list of the 5-8 best readings with title, source, link, why-it-matters, and suggested order.
        - youtube_script: a polished 6-10 minute script with hook, intro, story transitions, and closing CTA.
        - short_video_script: a 45-90 second script for Instagram Reels/TikTok with a hard opening hook and punchy pacing.
        - newsletter: a concise but intelligent newsletter draft with subject line, intro, sections, and closing.
        - Prioritize these topics when relevant: {topic_list}.
        - Do not invent facts beyond the supplied source material.
        - Return valid JSON only.

        Source material:
        {chr(10).join(article_lines)}
        """
    ).strip()


def parse_response_text(payload: dict) -> str:
    if isinstance(payload.get("output_text"), str) and payload["output_text"].strip():
        return payload["output_text"]

    chunks: list[str] = []
    for output_item in payload.get("output", []):
        for content_item in output_item.get("content", []):
            text = content_item.get("text")
            if isinstance(text, str):
                chunks.append(text)
    return "\n".join(chunks).strip()


def generate_bundle(articles: list[Article], topics: list[str], model: str) -> GeneratedBundle:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return fallback_bundle(articles, topics)

    prompt = build_prompt(articles, topics)
    request_body = json.dumps({"model": model, "input": prompt}).encode("utf-8")
    request = urllib.request.Request(
        OPENAI_API_URL,
        data=request_body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=90) as response:
        payload = json.loads(response.read().decode("utf-8"))

    response_text = parse_response_text(payload)
    data = json.loads(response_text)
    return GeneratedBundle(
        recommended_readings_markdown=data["recommended_readings_markdown"],
        youtube_script=data["youtube_script"],
        short_video_script=data["short_video_script"],
        newsletter=data["newsletter"],
    )
