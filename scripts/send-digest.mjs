#!/usr/bin/env node
// Emails a Basis Point brief via Resend.
//   node scripts/send-digest.mjs briefs/2026-08-15-am.md
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const KEYS = ["RESEND_API_KEY", "DIGEST_TO", "DIGEST_FROM"];

// Locally the values live in .env; in the cloud runner there is no .env, so
// real environment variables win and the file is only a fallback.
function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {
    // No .env — fine as long as the environment carries the keys.
  }
  for (const k of KEYS) if (process.env[k]) env[k] = process.env[k];

  const missing = KEYS.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(", ")} — set them in .env locally, or as environment ` +
        `variables on the cloud environment running the scan.`
    );
  }
  return env;
}

// What the email carries, per bucket. The brief keeps everything — this is the
// emailed view only, cut down to what Lana actually reads in her inbox.
//
// The short-form buckets now ship the finished script, and the script is the
// thing she reads, so it goes out whole: an email that summarised it would just
// be a worse version of the entry. Tutorials additionally carry the numbered
// setup, because reading the build on a phone is how she decides to do it.
// Only the long-form still gets cut, since its material is research notes.
//
// Tags ride along in every bucket: they are the upload box's contents, and the
// inbox is where an idea most often gets picked up to post. Hooks ride along
// for the same reason — the alternates are the field most likely to be read on
// a phone and picked between before recording.
const BUCKETS = { A: "news", B: "tutorial", C: "explainer", D: "longform" };
const EMAIL_SECTIONS = {
  news:      { keepOnly: ["Hooks", "The script", "Sources", "Tags", "Freshness"] },
  tutorial:  { keepOnly: ["Hooks", "The script", "How you set it up", "Sources", "Tags", "Freshness"] },
  explainer: { keepOnly: ["Hooks", "The script", "Sources", "Tags", "Freshness"] },
  longform:  { drop: ["The beats"] },
};

// The fact list is front-loaded: the quotes and the headline numbers are at the
// top, the tail is secondary-actor detail. The full list stays in the brief.
const MATERIAL_LIMIT = 8;

function forDigest(md) {
  const out = [];
  let policy = null, keep = true, field = null, materialSeen = 0;

  for (const line of md.split("\n")) {
    const head = line.match(/^## ([ABCD])\d+\s*·/);
    if (head) {
      policy = EMAIL_SECTIONS[BUCKETS[head[1]]] ?? {};
      keep = true;
      field = null;
      out.push(line);
      continue;
    }
    if (/^`rate:/.test(line)) continue; // a UI affordance, not digest content

    const label = line.match(/^\*\*([^*]+)\*\*/);
    if (label && policy) {
      field = label[1].trim();
      keep = policy.keepOnly
        ? policy.keepOnly.includes(field)
        : !(policy.drop ?? []).includes(field);
      materialSeen = 0;
    }
    if (!keep) continue;
    // The script is the whole entry, so its label is noise in an inbox — the
    // heading above it already says which idea this is. It stays in the brief
    // markdown, which is a structured file the parser reads.
    if (field === "The script" && /^\*\*The script\*\*\s*$/.test(line)) continue;
    if (field === "The material" && line.startsWith("- ") && ++materialSeen > MATERIAL_LIMIT) continue;
    out.push(line);
  }
  return out.join("\n");
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Inline styles throughout — Gmail strips <style> blocks.
function toHtml(md) {
  const S = {
    h1: "font:600 22px/1.3 -apple-system,Segoe UI,sans-serif;color:#111;margin:0 0 4px",
    h2: "font:600 15px/1.4 -apple-system,Segoe UI,sans-serif;color:#111;margin:28px 0 10px;padding-top:18px;border-top:1px solid #e5e5e5",
    p: "font:400 14px/1.6 -apple-system,Segoe UI,sans-serif;color:#333;margin:0 0 10px",
    meta: "font:400 12px/1.5 -apple-system,Segoe UI,sans-serif;color:#888;margin:0 0 4px",
    quote: "font:500 15px/1.5 -apple-system,Segoe UI,sans-serif;color:#111;margin:0 0 12px;padding:10px 14px;background:#f6f6f4;border-left:3px solid #111",
    li: "font:400 14px/1.6 -apple-system,Segoe UI,sans-serif;color:#333;margin:0 0 5px",
  };
  const out = [];
  let listTag = null; // "ul" or "ol" — setup steps arrive numbered.
  const closeList = () => { if (listTag) { out.push(`</${listTag}>`); listTag = null; } };

  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim() || /^---+$/.test(line)) { closeList(); continue; }

    const inline = (t) =>
      esc(t)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#0a58ca">$1</a>')
        .replace(/(^|[^\w])\*\*([^*]+)\*\*/g, "$1<strong>$2</strong>")
        .replace(/`([^`]+)`/g, '<code style="background:#f0f0ee;padding:1px 4px;border-radius:3px;font-size:13px">$1</code>')
        .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" style="color:#0a58ca">$2</a>');

    let m;
    if ((m = line.match(/^# (.*)/)))       { closeList(); out.push(`<h1 style="${S.h1}">${inline(m[1])}</h1>`); }
    else if ((m = line.match(/^## (.*)/))) { closeList(); out.push(`<h2 style="${S.h2}">${inline(m[1])}</h2>`); }
    else if ((m = line.match(/^_(.*)_$/))) { closeList(); out.push(`<p style="${S.meta}">${inline(m[1])}</p>`); }
    else if ((m = line.match(/^> (.*)/)))  { closeList(); out.push(`<p style="${S.quote}">${inline(m[1])}</p>`); }
    else if ((m = line.match(/^(?:[-*]|\d+[.)])\s+(.*)/))) {
      const tag = /^[-*]/.test(line) ? "ul" : "ol";
      if (listTag !== tag) {
        closeList();
        out.push(`<${tag} style="margin:0 0 12px;padding-left:20px">`);
        listTag = tag;
      }
      out.push(`<li style="${S.li}">${inline(m[1])}</li>`);
    }
    else { closeList(); out.push(`<p style="${S.p}">${inline(line)}</p>`); }
  }
  closeList();
  return `<div style="max-width:640px;margin:0 auto;padding:24px 20px;background:#fff">${out.join("\n")}
<p style="font:400 12px/1.5 -apple-system,sans-serif;color:#999;margin-top:32px;padding-top:14px;border-top:1px solid #e5e5e5">
Rate ideas in the brief file, then run <code>/basis-point-learn</code>.</p></div>`;
}

const path = process.argv[2];
if (!path) { console.error("usage: node scripts/send-digest.mjs <brief.md>"); process.exit(1); }

const env = loadEnv();
const md = readFileSync(path, "utf8");
const subject = (md.match(/^# (.*)/m)?.[1] ?? `Basis Point — ${basename(path, ".md")}`).trim();
const digest = forDigest(md);

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ from: env.DIGEST_FROM, to: [env.DIGEST_TO], subject, html: toHtml(digest), text: digest }),
});

const body = await res.json();
if (!res.ok) { console.error(`Resend failed (${res.status}):`, body); process.exit(1); }
console.log(`Sent "${subject}" to ${env.DIGEST_TO} — id ${body.id}`);
