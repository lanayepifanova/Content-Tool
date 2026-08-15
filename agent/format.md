# Basis Point — Output Format

Every run writes two files:
- `briefs/YYYY-MM-DD-{am|pm}.md`   — the human-readable brief (source of truth)
- `briefs/YYYY-MM-DD-{am|pm}.json` — same content, for the React UI

The beat structure below is carried over from the existing Basis Point app, so
briefs drop straight into the format already in use.

---

## Markdown template

```
# Basis Point — {Weekday}, {Month D} · {AM|PM}
_{N} ideas · generated {HH:MM} · sources checked: {count}_

---

## A1 · NEWS · {four-to-six word title}

**Hook** (0-3s, this is the actual first line of the video)
> {one sentence, spoken aloud, no preamble}

**Why it's good**
{2-3 sentences. What makes this stop a scroll — the specific surprising thing,
not a summary of the news.}

**The beats**
- 0-3s — {open on tension, not headline}
- 3-15s — {what happened, plain language}
- 15-35s — {connect to money, power, timing, or behavior}
- 35-60s — {one thing to watch next}

**Sources**
- {publication} — {url}
- {primary source, filing, or repo} — {url}

**Freshness** {N}h ago · **Saturation** low | medium | high

`rate: ` ← put + or - here

---
```

Then `B1..B3` (tutorials) and `C1..C3` (explainers), same shape with these
bucket-specific field swaps:

**Bucket B replaces "Why it's good" with:**
- **What you build** — one sentence
- **Time to build** — realistic estimate
- **The money shot** — the on-screen moment where it visibly works
- **Gotchas** — what will break, keys needed, cost

**Bucket C replaces "Why it's good" with:**
- **The misconception** — what people wrongly believe
- **The analogy** — the single image carrying the explanation
- **Where the analogy breaks** — stated honestly, often a good ending beat

---

## Rules

- Hooks are written to be **spoken**, not read. No "In this video." No "Ever
  wondered." No rhetorical-question openers.
- Never pad to hit the count. Three strong ideas beat three plus a filler.
  If a bucket only yields two, ship two and say why in a `> note:` line.
- Every factual claim carries a source link. Unverifiable claim = cut the idea.
- No emoji in briefs. No exclamation marks.
- Titles are four to six words, concrete nouns, no colons.
