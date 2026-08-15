#!/usr/bin/env node
// Derives the UI's JSON from a brief markdown file, so the markdown stays the
// single source of truth.
//   node scripts/brief-to-json.mjs briefs/2026-08-15-am.md
import { readFileSync, writeFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node scripts/brief-to-json.mjs <brief.md>"); process.exit(1); }

const md = readFileSync(path, "utf8");
const BUCKETS = { A: "news", B: "tutorial", C: "explainer" };

const header = md.match(/^# (.*)/m)?.[1] ?? "";
const ideas = [];

// Each idea starts at "## A1 · NEWS · Title"
const chunks = md.split(/^## /m).slice(1);
for (const chunk of chunks) {
  const head = chunk.split("\n")[0];
  const m = head.match(/^([ABC])(\d+)\s*·\s*[^·]+·\s*(.+)$/);
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

  const beats = [...chunk.matchAll(/^- (\d+-\d+s) — (.*)$/gm)].map((b) => ({ t: b[1], text: b[2] }));
  const sources = [...chunk.matchAll(/^- (.+?) — (https?:\/\/\S+)$/gm)].map((s) => ({ name: s[1], url: s[2] }));

  const extra = {};
  for (const label of ["What you build", "Time to build", "The money shot", "Gotchas",
                       "The misconception", "The analogy", "Where it breaks", "Pairs with"]) {
    const v = field(label);
    if (v) extra[label] = v;
  }

  const rateLine = chunk.match(/`rate:\s*([+-]?)([^`]*)`/);
  const symbol = rateLine?.[1]?.trim() || null;

  ideas.push({
    id: `${letter}${num}`,
    bucket: BUCKETS[letter],
    title: title.trim(),
    hook: field("Hook"),
    why: field("Why it's good"),
    beats,
    sources,
    freshness: chunk.match(/\*\*Freshness\*\*\s*([^·\n]+)/)?.[1].trim() || null,
    saturation: chunk.match(/\*\*Saturation\*\*\s*([^\n]+)/)?.[1].trim() || null,
    note: chunk.match(/^> note:\s*(.+)$/m)?.[1] || null,
    rating: symbol === "+" ? "up" : symbol === "-" ? "down" : null,
    ratingReason: rateLine?.[2]?.trim() || null,
    extra,
  });
}

const out = { title: header, slug: path.replace(/.*\//, "").replace(/\.md$/, ""), generated: header, ideas };
const dest = path.replace(/\.md$/, ".json");
writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(`${dest} — ${ideas.length} ideas (${ideas.filter(i => i.rating).length} rated)`);
