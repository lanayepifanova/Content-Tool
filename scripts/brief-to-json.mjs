#!/usr/bin/env node
// Derives the UI's JSON from a brief markdown file, so the markdown stays the
// single source of truth.
//   node scripts/brief-to-json.mjs briefs/2026-08-15-am.md
import { readFileSync, writeFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node scripts/brief-to-json.mjs <brief.md>"); process.exit(1); }

const md = readFileSync(path, "utf8");
const BUCKETS = { A: "news", B: "tutorial", C: "explainer", D: "longform" };

const header = md.match(/^# (.*)/m)?.[1] ?? "";
const ideas = [];

// Each idea starts at "## A1 · NEWS · Title" (D1 · LONGFORM for the YouTube idea)
const chunks = md.split(/^## /m).slice(1);
for (const chunk of chunks) {
  const head = chunk.split("\n")[0];
  const m = head.match(/^([ABCD])(\d+)\s*·\s*[^·]+·\s*(.+)$/);
  if (!m) continue;
  const [, letter, num, title] = m;

  // A field's value is either on the same line as its label
  // (`**Time to build** 10 minutes`) or in the block beneath it.
  const field = (label) => {
    const re = new RegExp(`\\*\\*${label}\\*\\*([^\\n]*)\\n((?:(?!\\*\\*|## )[^\\n]*\\n?)*)`, "i");
    const m = chunk.match(re);
    if (!m) return null;
    const sameLine = m[1].replace(/^\s*\(.*?\)\s*/, "").trim(); // drop "(0-3s)" annotations
    const below = (m[2] || "").trim().replace(/^>\s*/gm, "");
    return sameLine || below || null;
  };

  // Short-form beats are "0-3s"; Bucket D chapters are "0:00-0:45". Both land in `beats`.
  const beats = [...chunk.matchAll(/^- (\d+:\d{2}-\d+:\d{2}|\d+-\d+s) — (.*)$/gm)]
    .map((b) => ({ t: b[1], text: b[2] }));
  // Scoped to the Sources block — the material bullets are also "- ..." lines
  // and must not be mistaken for sources.
  const sourceBlock = chunk.match(/\*\*Sources\*\*[^\n]*\n((?:(?!\*\*|## )[\s\S])*)/);
  const sources = [...(sourceBlock?.[1] ?? "").matchAll(/^- (.+?) — (https?:\/\/\S+)$/gm)]
    .map((s) => ({ name: s[1], url: s[2] }));

  // The raw fact list. Deliberately long — Lana picks from it to write the script.
  const materialBlock = chunk.match(/\*\*The material\*\*[^\n]*\n((?:- [\s\S]*?)?)(?=\n\*\*|\n## |$)/);
  const material = (materialBlock?.[1] ?? "")
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim())
    .filter(Boolean);

  const extra = {};
  for (const label of ["What you build", "Time to build", "The money shot", "Gotchas",
                       "The misconception", "The analogy", "Where it breaks",
                       "Where the analogy breaks", "Pairs with",
                       "The thesis", "Why it holds ten minutes", "What you'd need", "Thumbnail"]) {
    const v = field(label);
    if (v) extra[label] = v;
  }

  // Bucket D lists candidate YouTube titles as bare bullets under "Title options".
  const titleBlock = chunk.match(/\*\*Title options\*\*[^\n]*\n+((?:- .*\n?)+)/);
  const titleOptions = titleBlock
    ? titleBlock[1].split("\n").map((l) => l.replace(/^- /, "").trim()).filter(Boolean)
    : [];

  // The thesis is promoted to `why` for Bucket D, so don't also list it as a field.
  if (letter === "D") delete extra["The thesis"];

  const rateLine = chunk.match(/`rate:\s*([+-]?)([^`]*)`/);
  const symbol = rateLine?.[1]?.trim() || null;

  ideas.push({
    id: `${letter}${num}`,
    bucket: BUCKETS[letter],
    title: title.trim(),
    hook: field("Hook"),
    // Bucket D has no "Why it's good" — its thesis is the headline claim.
    why: field("Why it's good") || (letter === "D" ? field("The thesis") : null),
    beats,
    material,
    sources,
    freshness: chunk.match(/\*\*Freshness\*\*\s*([^·\n]+)/)?.[1].trim() || null,
    saturation: chunk.match(/\*\*Saturation\*\*\s*([^\n]+)/)?.[1].trim() || null,
    note: chunk.match(/^> note:\s*(.+)$/m)?.[1] || null,
    rating: symbol === "+" ? "up" : symbol === "-" ? "down" : null,
    ratingReason: rateLine?.[2]?.trim() || null,
    extra,
    ...(titleOptions.length ? { titleOptions } : {}),
  });
}

const out = { title: header, slug: path.replace(/.*\//, "").replace(/\.md$/, ""), generated: header, ideas };
const dest = path.replace(/\.md$/, ".json");
writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(`${dest} — ${ideas.length} ideas (${ideas.filter(i => i.rating).length} rated)`);
