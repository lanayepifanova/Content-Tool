# Basis Point — Output Format

Every run writes two files:
- `briefs/YYYY-MM-DD.md`   — the human-readable brief (source of truth)
- `briefs/YYYY-MM-DD.json` — same content, for the React UI

One run per day. Ten ideas: nine short-form (A/B/C) plus one long-form (D).

Every idea leads with prose — two paragraphs that explain the thing and why it
matters — and carries its detail in **The material** below that. There is no
beat sheet: scripting is Lana's job, and a pre-chopped 0-3s/3-15s skeleton gets
in the way of it.

---

## Markdown template

```
# Basis Point — {Weekday}, {Month D}
_{N} ideas · generated {HH:MM} · sources checked: {count}_

---

## A1 · NEWS · {four-to-six word title}

**Hook** (0-3s, this is the actual first line of the video)
> {one sentence, spoken aloud, no preamble}

**What this is**
{First paragraph: the concept or the event, explained plainly to someone who has
not been following it. Define the mechanism, name the actors, land the one
number that anchors it. Assume no prior context and no jargon that isn't
unpacked in the same sentence.}

{Second paragraph: why it matters. Who is affected, what changes because of it,
and what makes it worth 60 seconds rather than a headline. This is where the
specific surprising thing goes — the reason it stops a scroll.}

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

Then `B1..B3` (tutorials) and `C1..C3` (explainers), same shape — **What this
is** stays as the lead in every bucket — with these bucket-specific additions
underneath it:

**Bucket B adds, after "What this is":**
- **What you build** — one sentence
- **Time to build** — realistic estimate
- **How you set it up** — the numbered walkthrough, see below
- **The money shot** — the on-screen moment where it visibly works
- **Where else this applies** — 3-5 other jobs the same setup does
- **Gotchas** — what will break, keys needed, cost

**Bucket C adds, after "What this is":**
- **The misconception** — what people wrongly believe
- **The analogy** — the single image carrying the explanation
- **Where the analogy breaks** — stated honestly, often a good closing note

### Bucket B — how you set it up

A tutorial idea is only useful if Lana can sit down and follow it. This field is
the actual walkthrough, not a summary of one: numbered steps, in order, from a
clean machine to the thing working.

**Target 6-12 steps.** Each step is one action, and every step that involves a
command, a path, a package name, a model name, a setting or a config key states
it verbatim — never "install the dependencies" when `npm i -g browser-use@0.3.2`
is the truth. Where a step produces output worth checking, say what a correct
result looks like so a wrong one is obvious immediately.

Name the prerequisites before step 1: runtime versions, an account that has to
exist, a key that has to be issued and where it comes from. If a step is where
most people get stuck, mark it and say what the failure looks like.

The two paragraphs of **What this is** carry the concept — what the tool
actually does and why the approach is better than the obvious alternative. The
steps carry the doing. Don't repeat the concept inside the steps.

### Bucket B — where else this applies

Three to five concrete other uses for the same setup, each one sentence and each
a real job rather than a category. "Pull every competitor's pricing page into a
sheet weekly" is a use; "market research" is a category. This is where a
tutorial stops being a demo of a tool and becomes something worth keeping.

---

## Bucket D — the long-form idea

Exactly one per brief, written last, and it is a different shape from the
shorts. Ten minutes is not a short stretched out — it needs an argument that
develops. Same header convention, but with its own fields:

```
## D1 · LONGFORM · {four-to-seven word working title}

**Hook** (0-15s, the cold open before any title card)
> {two or three sentences. Sets the stake and makes a promise the video pays off.}

**What this is**
{Two paragraphs, same job as the shorts: the first explains the subject to
someone with no prior context, the second says why it matters now. For Bucket D
this is the pitch — if these two paragraphs don't make someone want ten
minutes, the thesis below won't save it.}

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

Chapter timestamps use `M:SS-M:SS`. Bucket D keeps its chapters because a
ten-minute argument has to be shown to develop — that is the field proving the
idea isn't a short. Short-form ideas have no beat sheet at all.

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
- **Write each prose paragraph on one line**, however long, with a blank line
  between paragraphs. The digest email turns every source line into its own
  paragraph, so hard-wrapping the two lead paragraphs shatters them into
  fragments in Lana's inbox. This applies to prose only — the material,
  the setup steps and the sources stay one bullet per line.
- Setup steps are numbered `1.` `2.` `3.`; every other list is `- `. The email
  and the app both key off that distinction to render them as ordered.
- Short-form titles are four to six words, concrete nouns, no colons. The
  Bucket D working title may run to seven; its **Title options** are the ones
  written for the platform and play by YouTube's rules instead.
