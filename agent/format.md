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

**The material**
- {a single verified fact, with its number, name, date or quote}
- {another — these are raw, unordered, and there are many}
- ...

**Sources**
- {publication} — {url}
- {primary source, filing, or repo} — {url}

**Freshness** {N}h ago · **Saturation** low | medium | high

`rate: ` ← put + or - here

---
```

### The material section

This is the part that means Lana doesn't have to go research the story herself.
It sits under every idea, short-form and long, and it carries the raw facts —
not a script, not prose, not an argument. She writes the script; the brief
supplies everything she'd otherwise have to go and look up.

**Target 10-16 bullets per short-form idea, 20-30 for Bucket D.** Over-supply is
the point: include facts she probably won't use. A bullet she skips costs
nothing, a fact she has to go find costs the whole benefit.

Every bullet must:

- **Carry something hard** — a number, a date, a name, a dollar figure, a
  percentage, a direct quote. A bullet with no specific in it is a sentence
  about the topic, and doesn't belong here.
- **Stand alone.** No "this means that" or "as a result" — each bullet is
  independently liftable into a script in any order. Connective tissue is
  script-writing, which is her job.
- **Attribute inline** when the fact is contestable or the source matters:
  `(Bloomberg)`, `(per the 10-Q)`, `(CFTC press release)`. Put the bare source
  name in parentheses — never a bare URL, which belongs in **Sources**.
- **Quote exactly** when quoting. Full quotation marks, named speaker, no
  paraphrase dressed as a quote.

Cover, where they exist: the core numbers and what they were before · the
timeline with dates · who the named actors are and what each wanted · the
mechanism, stated plainly · the scale comparison that makes a number legible ·
the precedent or the last time this happened · the counter-argument or the
caveat that would embarrass her if a comment pointed it out · what happens next
and when.

Include the inconvenient facts. If the tidy version of the story has a hole in
it, the hole goes in the material — finding out from a comment is worse than
knowing up front.

For Bucket B the material is practical rather than journalistic: exact install
commands, version numbers, the config that has to be right, real cost per run,
the error people hit and what fixes it, star count and last-commit date.

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

**The material**
- {20-30 bullets — same rules as the shorts, more of them}

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
  If a bucket only yields two, ship two and say why in a `> note:` line. This
  is about the number of *ideas* — **The material** is the opposite case, where
  more is better, so long as every bullet carries a hard specific.
- Every factual claim carries a source link. Unverifiable claim = cut the idea.
- No emoji in briefs. No exclamation marks.
- Short-form titles are four to six words, concrete nouns, no colons. The
  Bucket D working title may run to seven; its **Title options** are the ones
  written for the platform and play by YouTube's rules instead.
