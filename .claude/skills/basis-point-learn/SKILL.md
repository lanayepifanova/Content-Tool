---
name: basis-point-learn
description: Distill Lana's ratings on Basis Point briefs into the taste rubric. Use after rating ideas in briefs/, or when asked to train, tune, or teach the content agent what she likes.
---

# Basis Point Learn

Turn accumulated ratings into a sharper rubric.

## 1. Collect

Scan every file in `briefs/` for `rate:` lines carrying `+` or `-`, including
any free-text reason. Build the full rated corpus with each idea's bucket,
title, opening line, and reason.

**Read `briefs/KILLED.md` as well, and treat every line in it as a `-`.** Killing
an idea in the reader deletes it from its brief, so the negative half of the
signal no longer lives in the briefs at all — a run that reads only the briefs
sees a corpus of survivors and learns that everything is good. Each line is
`- {slug} {id} · {title} — {reason}`, and the reason is the part that teaches.
The entry is gone, so where a killed line is ambiguous, say so rather than
reconstructing what the idea probably was. Short-form ideas now ship as finished scripts,
so the opening line is the script's first sentence; older briefs have a `Hook`
field instead.

If fewer than 10 rated ideas exist across all buckets, say so and stop — distilling from a thin
sample bakes in noise. Report the count and ask for more rating first.

## 2. Find the pattern

Compare the `+` set against the `-` set **within each bucket**. Look for:

- Recurring subject matter on either side
- Opening structures that consistently win or lose
- Script-level notes: whether a rating is about the subject or about how the
  script was written. Now that the brief ships the finished piece, a `-` can
  mean "wrong story" or "right story, wrong script" — those teach opposite
  lessons, so when the reason doesn't say which, say so rather than guessing
- Whether she prefers absurd/surprising over consequential/serious
- Complexity tolerance — how technical before it stops landing
- Freshness sensitivity — does she reject anything over a day old
- Format-level notes hiding in her free-text reasons

Weight explicit written reasons far above bare symbols. A `-` with "too much
like Tuesday's" is a de-duplication rule, not a topic rejection — read intent
carefully rather than pattern-matching keywords.

Distinguish a real signal from a small sample. Three consistent `-` on the same
shape is a rule; one is an anecdote. Say which is which.

**Long-form is gone.** Bucket D was dropped on 2026-08-20 and briefs are nine
short-form ideas now. Old briefs still carry `D1` entries — read their ratings
as evidence about the subject, not about the format, and never write a rule
about long-form into the rubric.

## 3. Rewrite

Update `agent/taste.md` between the `LEARNED:START` / `LEARNED:END` markers.
Write concrete, actionable rules — "reject funding rounds unless the product
mechanic is the story," not "prefers interesting content." Cite the evidence
count for each rule, e.g. `(4 of 4 rated -)`.

If evidence contradicts a rule in the main body of the rubric, don't silently
override it — flag the conflict and propose the edit.

The **What has actually worked** section is the one part of the rubric ratings
do not get to move. It records what published videos did, and a rating is a
prediction of that at best — where the two disagree, report the conflict and
leave the section alone. It is updated by hand when new view counts come in.

Append a dated entry to the "Distilled history" section of `agent/ratings.md`:
how many ratings were read, what changed, what's still ambiguous.

## 4. Report

State what was learned, what changed in the rubric, and what remains unclear —
including which questions the next batch of ratings would resolve.
