# Basis Point — Output Format

Every run writes two files:
- `briefs/YYYY-MM-DD.md`   — the human-readable brief (source of truth)
- `briefs/YYYY-MM-DD.json` — same content, for the React UI

One run per day. Ten ideas: nine short-form (A/B/C) plus one long-form (D).

The beat structure below is carried over from the existing Basis Point app, so
briefs drop straight into the format already in use.

---

## Markdown template

```
# Basis Point — {Weekday}, {Month D}
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

## Bucket D — the long-form idea

Exactly one per brief, written last, and it is a different shape from the
shorts. Ten minutes is not a short stretched out — it needs an argument that
develops. Same header convention, but with its own fields:

```
## D1 · LONGFORM · {four-to-seven word working title}

**Hook** (0-15s, the cold open before any title card)
> {two or three sentences. Sets the stake and makes a promise the video pays off.}

**The thesis**
{One sentence — the claim the video argues. Not a topic. "Prediction markets
are becoming the price of truth" is a topic; "prediction markets are being
priced by people who cannot afford to be wrong, which is why they beat polls"
is a thesis.}

**Why it holds ten minutes**
{2-4 sentences naming the specific substance: how many distinct acts, what new
information arrives in the back half, why a viewer stays past minute four. If
the honest answer is "it doesn't," cut the idea.}

**The chapters**
- 0:00-0:45 — {cold open — the concrete scene or number}
- 0:45-2:00 — {the setup: what the viewer needs to believe the rest}
- 2:00-4:00 — {act one — the first mechanism, with its own small payoff}
- 4:00-6:30 — {act two — the complication, the thing that breaks the tidy story}
- 6:30-8:30 — {act three — the consequence, who wins and loses}
- 8:30-10:00 — {the turn — what this predicts, and the honest uncertainty}

**What you'd need**
{Footage, charts, screen recordings, filings to put on screen. Be specific —
"the S-1 page where the compute line item appears," not "some visuals."}

**Title options**
- {YouTube title, written to be clicked, not to be accurate-sounding}
- {a second, different angle}

**Thumbnail**
{The single image. One subject, readable at small size.}

**Sources**
- {at least four, weighted toward primary}

**Freshness** {N}h ago | evergreen · **Saturation** low | medium | high

`rate: `
```

Chapter timestamps use `M:SS-M:SS`; short-form beats keep `Ns-Ns`. Both parse.

---

## Rules

- Hooks are written to be **spoken**, not read. No "In this video." No "Ever
  wondered." No rhetorical-question openers.
- Never pad to hit the count. Three strong ideas beat three plus a filler.
  If a bucket only yields two, ship two and say why in a `> note:` line.
- Every factual claim carries a source link. Unverifiable claim = cut the idea.
- No emoji in briefs. No exclamation marks.
- Short-form titles are four to six words, concrete nouns, no colons. The
  Bucket D working title may run to seven; its **Title options** are the ones
  written for the platform and play by YouTube's rules instead.
