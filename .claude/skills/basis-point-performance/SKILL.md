---
name: basis-point-performance
description: Log a published video's numbers and work out why it did what it did, then fold the lesson into the rubric. Use when Lana reports view counts, comment reactions, or asks why something worked or flopped.
---

# Basis Point Performance

Turn what a published video actually did into a rule the next scan follows.
This is the outer loop: `/basis-point-learn` distils her *predictions* about
ideas, this distils *results*. Where the two disagree, results win.

Work in the repository root.

## 1. Take the numbers

She will usually give a title or description, a view count, and something about
the comments. Ask for whatever is missing, in this order of importance:

1. **What the comments did.** The single most useful field. Were people
   arguing, and about what? Agreeing? Correcting a fact? Silent? A video's
   comment section is the difference between the two formats that worked and
   the ones that didn't, and it is the thing no analytics screen reports.
2. **The view count**, and roughly how long it has been up. 100k in a day and
   100k over a month are different results.
3. **The opening line as delivered**, verbatim if she has it. The hook is the
   variable most worth tracking, and it is what the *Hooks* menu in a brief
   exists to serve.
4. Platform, post date, and a link if there is one.

If it came from a brief, find it — `grep` the title in `briefs/` — and note
which idea and which of its hooks she used, including whether she used hook one
or swapped in an alternate. That is the only way the hook types ever get
evidence attached to them.

Do not ask for everything at once, and do not block on the fields she does not
have. A dated entry with a view count and one honest sentence about the comments
is worth more than a complete form she never fills in.

## 2. Write the entry

Append to `agent/performance.md`, newest first, in the existing shape: title,
**Platform**, **Posted**, **Views**, **Format**, **Hook used**, **What the
comments did**, **Why it worked**, **Repeat it by**, optional **Link**.

Two fields carry the work:

- **Why it worked** — the mechanism, not a restatement of the outcome. "It got
  a lot of comments" is the observation; "the claim was verifiable by looking at
  the video, so every viewer was qualified to have an opinion" is the mechanism.
  Write the version that would let someone reproduce it without the subject.
- **Repeat it by** — the instruction to a future run. Concrete enough to act on:
  what to hunt for, how to open it, what to avoid. If you cannot write this, the
  entry is an anecdote and should say so.

**A flop gets the same treatment.** Ask for the ones that died, and write them
up with the same fields. Two wins tell you what correlates with success; a flop
that shares three of their four traits is the thing that tells you which trait
mattered. Never let the log become a trophy case — say so plainly if it is
becoming one.

Then run `node scripts/brief-to-json.mjs --performance` so the reader's
Performance tab picks it up.

## 3. Rewrite the patterns

Update the **Patterns** block at the top of `agent/performance.md`. Each line is
a rule with its evidence count — `*(2 of 2 outliers)*`, `*(1 video)*`. Rules
that are now contradicted get removed, not softened. Rules that only ever had
one video behind them stay marked as such.

Hold a real bar here. Two videos is a coincidence with a story attached; three
is a pattern. Say which is which in the line itself rather than letting a guess
harden into a rule by being written confidently.

Watch specifically for:

- **A trait shared by the winners that the flops also have.** That trait is not
  the cause, and if it is currently written as a rule it needs to come out.
- **Hook types earning evidence.** Once several videos have used a named type
  from `agent/format.md`, say which types are pulling their weight.
- **Format decay.** A shape that worked twice and then stopped working is a
  different finding from one that never worked, and it is the more useful one.

## 4. Sync the rubric

`agent/taste.md` has a **What has actually worked** section near the top. It is
the distilled version of this file and the one part of the rubric that
`/basis-point-learn` is forbidden to touch. Update it when the patterns change —
keep it short, keep the two-or-three sentence read on each outlier, and make
sure the bullet list underneath matches the current **Patterns** block.

If a new result contradicts something in the body of the rubric — a bucket's
strong signals, a coverage rule, the polarization axis — do not silently rewrite
that section. Say what the conflict is, propose the specific edit, and let her
decide. A single video is rarely enough to move a rule that was written from
several.

## 5. Report

Four lines: what got logged, what the read on it is, what changed in the
patterns and the rubric, and the one thing the next post should be tested
against to resolve whatever is still ambiguous.
