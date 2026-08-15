---
name: basis-point-learn
description: Distill Lana's ratings on Basis Point briefs into the taste rubric. Use after rating ideas in briefs/, or when asked to train, tune, or teach the content agent what she likes.
---

# Basis Point Learn

Turn accumulated ratings into a sharper rubric.

## 1. Collect

Scan every file in `briefs/` for `rate:` lines carrying `+` or `-`, including
any free-text reason. Build the full rated corpus with each idea's bucket,
title, hook, and reason.

If fewer than 10 rated ideas exist, say so and stop — distilling from a thin
sample bakes in noise. Report the count and ask for more rating first.

## 2. Find the pattern

Compare the `+` set against the `-` set **within each bucket**. Look for:

- Recurring subject matter on either side
- Hook structures that consistently win or lose
- Whether she prefers absurd/surprising over consequential/serious
- Complexity tolerance — how technical before it stops landing
- Freshness sensitivity — does she reject anything over a day old
- Format-level notes hiding in her free-text reasons

Weight explicit written reasons far above bare symbols. A `-` with "too much
like Tuesday's" is a de-duplication rule, not a topic rejection — read intent
carefully rather than pattern-matching keywords.

Distinguish a real signal from a small sample. Three consistent `-` on the same
shape is a rule; one is an anecdote. Say which is which.

## 3. Rewrite

Update `agent/taste.md` between the `LEARNED:START` / `LEARNED:END` markers.
Write concrete, actionable rules — "reject funding rounds unless the product
mechanic is the story," not "prefers interesting content." Cite the evidence
count for each rule, e.g. `(4 of 4 rated -)`.

If evidence contradicts a rule in the main body of the rubric, don't silently
override it — flag the conflict and propose the edit.

Append a dated entry to the "Distilled history" section of `agent/ratings.md`:
how many ratings were read, what changed, what's still ambiguous.

## 4. Report

State what was learned, what changed in the rubric, and what remains unclear —
including which questions the next batch of ratings would resolve.
