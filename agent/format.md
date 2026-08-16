# Basis Point — Output Format

Every run writes two files:
- `briefs/YYYY-MM-DD.md`   — the human-readable brief (source of truth)
- `briefs/YYYY-MM-DD.json` — same content, for the React UI

One run per day. Ten ideas: nine short-form (A/B/C) plus one long-form (D).

**The nine short-form ideas are finished scripts.** Not a pitch, not a fact
list, not a beat sheet — the spoken piece, written out, in the voice Lana says
it in. She should be able to open the brief, pick one, and record it without
writing a word or looking anything up. That is the whole design: an entry is a
title, **The script**, and **Sources**. Nothing else, in any of the three
short-form buckets.

There is no **Hook** field, no **What this is**, no **The material** and no beat
sheet on a short-form idea. Every one of those was a note toward a script that
is now written. The only extra field that survives is Bucket B's numbered setup
walkthrough, because building the thing is a separate job from narrating it.

Bucket D is the exception and keeps its old shape — ten minutes is a pitch to be
approved, not a script to be read. See **Bucket D** below.

---

## Markdown template

```
# Basis Point — {Weekday}, {Month D}
_{N} ideas · generated {HH:MM} · sources checked: {count}_

---

## A1 · NEWS · {four-to-six word title}

**The script**
{Paragraph one — one line in the file, however long it runs.}

{Paragraph two.}

{...four to six paragraphs in total.}

**Sources**
- {publication} — {url}
- {primary source, filing, or repo} — {url}

**Freshness** {N}h ago · **Saturation** low | medium | high

`rate: ` ← put + or - here

---
```

`B1..B3` and `C1..C3` use the same three fields, with `TUTORIAL` and `EXPLAINER`
in the header. Bucket B adds **How you set it up** between the script and the
sources.

---

## The script

This section governs all nine short-form ideas. The bucket sections below only
say how the shape differs.

**Five to seven paragraphs, 600-1000 words** — roughly four to six minutes read
aloud, with paragraphs running 100-180 words. This is not a 60-second clip with
more words in it: it is a piece of talking that has room to make one point
properly, and the length is what lets the correction, the number or the
walkthrough land instead of flashing past.

**Count the words, don't estimate them.** A finished script has a checkable
length and a run that guesses at it guesses low — the first brief in this format
reported 505-620 words for scripts that were actually 644-847.

Each paragraph is **one line in the file**, with a blank line between. The digest
email turns every line into its own paragraph, so a hard-wrapped script arrives
in her inbox as fragments.

It is continuous spoken prose. No headings inside it, no bullets, no bold, no
timestamps, no stage directions, no "cut to." Nothing that has to be silently
skipped while reading it aloud. If a sentence would not survive being said out
loud, it is not written yet.

### Voice

First person where it is a judgment — "I think," "the interesting thing about
this is." Hedged exactly as far as the evidence hedges: "probably part of the
story without being the entire story" is the register, not "this proves."

Name sources inside the sentence, the way you would speaking — "a 2024 paper
called *Why Do Large Language Models Struggle to Count Letters?*", "per the
10-Q", "in the CFTC's own press release" — and put the link in **Sources**.
Never read a URL aloud.

Every jargon term is unpacked in the sentence that introduces it. No rhetorical
questions to camera, no "let me explain," no "in this video," no "stay tuned,"
no exclamation marks, no lists read aloud, no closing call to action.

The last paragraph is a view, not a recap. It says what the thing means or what
it predicts, and it carries the honest limit — the caveat, the counter-argument,
the place the analogy stops holding. Never summarise what was just said.

### Verification

Every factual claim in the script is checked against a primary source **before**
it is written, and every source used appears under **Sources**. The old
**material** section was where inconvenient facts and counter-arguments lived;
now they live in the script itself, usually in the fourth or fifth paragraph,
stated out loud. A fact that would embarrass her if a comment raised it is not a
fact to leave out — it is usually the most interesting sentence in the piece.

A number that cannot be verified does not get softened or hedged into the
script. It gets left out. She is saying these sentences on camera as her own, so
a wrong figure is far more expensive here than a missing one.

---

## Bucket A — the news script

The shape:

1. **Open on the concrete thing that happened,** with its number and its date,
   in the first two sentences. No windup, no "you may have seen." The first line
   is the line that stops a scroll, and it is a fact rather than a tease.
2. **Explain the mechanism** to someone with no prior context — what actually
   moved, who the named actors are and what each one wanted. Every headline
   number arrives with its baseline: "$11.5B, up from $787M a year earlier," not
   "$11.5B."
3. **Land the surprise.** The specific detail that makes this worth three
   minutes rather than a headline — the odd structure, the thing that sounds
   implausible until you see how it works.
4. **Give the other side.** The strongest case against the framing, or the
   caveat a well-informed comment would raise. Said plainly, not buried.
5. **Close on what happens next and when,** with the honest uncertainty attached.

Dates are absolute — "on Tuesday" is dead in a week; "on August 12th" is not.

---

## Bucket B — the tutorial script

The script narrates the build for a viewer watching a screen recording. The
shape:

1. **Open on what gets built and why it is worth building** — one concrete job
   it does, stated as a job rather than a category.
2. **The concept:** what the tool actually is, and why this approach beats the
   obvious alternative. This is the paragraph the numbered steps do not carry.
3. **The build, narrated** — the arc of the setup in prose, naming the two or
   three moments that matter, including the one where most people get stuck.
   Not a reading of the step list: the steps are below for her hands, this is
   for her mouth.
4. **The money shot:** the on-screen moment where it visibly works, described so
   she knows what has to be recorded by then.
5. **Where else this goes** — two or three other real jobs the same setup does,
   and the honest cost or limit: what it charges per run, what breaks, what it
   cannot do.

### How you set it up

The one field that survives alongside the script, because Lana has to stand the
thing up before she can film it, and prose is the wrong container for a command.
Numbered steps, in order, from a clean machine to the thing working.

**Target 6-12 steps.** Each step is one action, and every step that involves a
command, a path, a package name, a model name, a setting or a config key states
it verbatim — never "install the dependencies" when `npm i -g browser-use@0.3.2`
is the truth. Where a step produces output worth checking, say what a correct
result looks like so a wrong one is obvious immediately.

Name the prerequisites before step 1: runtime versions, an account that has to
exist, a key that has to be issued and where it comes from. If a step is where
most people get stuck, mark it and say what the failure looks like. Keys, costs
and version pins live here, not in the script.

---

## Bucket C — the explainer script

The reference case for the whole format. The shape:

1. **Open by naming the subject and the wrong explanation.** "Today we are
   talking about {X}, because the explanation you have probably heard is not
   quite right." Then state the popular explanation properly, at its strongest,
   before saying what the better account is. A straw man that is easy to knock
   down makes the correction worthless.
2. **Give the analogy a paragraph of its own.** One everyday image, developed
   far enough that the viewer can reason inside it rather than just recognise
   it — "One way to think about this is to imagine..." — and landing on the
   exact distinction the analogy exists to make.
3. **Bring the evidence.** What the paper, the measurement or the mechanism
   actually found, with its specifics: the predictor that mattered, the one that
   turned out not to, the number. This is the paragraph that makes the video
   true rather than merely plausible.
4. **Say what follows.** The consequence — why the workaround works, why the
   thing behaves this way in practice, what someone should now expect to see.
5. **End on the broader point,** stated as a view: "I think the broader point is
   more interesting than..." The honest limit lives here too — where the analogy
   stops holding, or what is still genuinely unsettled.

An explainer opens by naming its subject directly, which the news script does
not. That is allowed here because it opens three minutes of one argument rather
than three seconds of a scroll-stopper.

---

## Bucket D — the long-form idea

Exactly one per brief, written last, and it is the one entry that is still a
pitch rather than a script. Ten minutes is not a short stretched out — it needs
an argument that develops, and that argument has to be worth approving before it
is worth writing fifteen hundred words of it. Same header convention, its own
fields:

```
## D1 · LONGFORM · {four-to-seven word working title}

**Hook** (0-15s, the cold open before any title card)
> {two or three sentences. Sets the stake and makes a promise the video pays off.}

**What this is**
{Two paragraphs: the first explains the subject to someone with no prior
context, the second says why it matters now. This is the pitch — if these two
paragraphs don't make someone want ten minutes, the thesis below won't save it.}

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
- {20-30 bullets — the raw fact list, see below}

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

Chapter timestamps use `M:SS-M:SS`. The chapters are the field that proves the
idea isn't a short: a ten-minute argument has to be shown to develop.

### The material — Bucket D only

The raw facts behind the long-form, so the argument can be written without going
back to research it. **20-30 bullets.** Over-supply is the point: a bullet she
skips costs nothing, a fact she has to go find costs the whole benefit.

Every bullet must:

- **Carry something hard** — a number, a date, a name, a dollar figure, a
  percentage, a direct quote. A bullet with no specific in it is a sentence
  about the topic, and doesn't belong here.
- **Stand alone.** No "this means that" or "as a result" — each bullet is
  independently liftable into the script in any order.
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

---

## Rules

- Everything in a short-form entry is written to be **spoken**, because all of
  it gets spoken. No "In this video." No "Ever wondered." No rhetorical-question
  openers. Bucket D's **Hook** follows the same rule.
- Never pad to hit the count. Three strong ideas beat three plus a filler. If a
  bucket only yields two, ship two and say why in a `> note:` line. Never pad a
  script to reach the word target either — 620 tight words beat 1000 with a
  paragraph of throat-clearing in them.
- Every factual claim carries a source link. Unverifiable claim = cut the idea.
- No emoji in briefs. No exclamation marks.
- **Write each prose paragraph on one line**, however long, with a blank line
  between paragraphs. The digest email turns every line into its own paragraph,
  so hard-wrapping a script shatters it into fragments in Lana's inbox. This
  applies to prose only: the setup steps, the material and the sources stay one
  bullet per line.
- Setup steps are numbered `1.` `2.` `3.`; every other list is `- `. The email
  and the app both key off that distinction to render them as ordered.
- A short-form entry carries exactly the title, **The script**, **Sources**, the
  freshness line and the rate line — plus **How you set it up** for Bucket B.
  Anything else under an `## A`, `## B` or `## C` heading is a leftover note and
  gets cut.
- Short-form titles are four to six words, concrete nouns, no colons. The
  Bucket D working title may run to seven; its **Title options** are the ones
  written for the platform and play by YouTube's rules instead.
