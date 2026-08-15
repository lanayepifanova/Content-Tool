---
name: basis-point-scan
description: Run a Basis Point content scan — research and write 9 social content ideas (3 news, 3 tutorials, 3 explainers) into a dated brief, then email the digest. Use when asked to find content ideas, run the scan, or generate today's brief. Also invoked by the twice-daily schedule.
---

# Basis Point Scan

Produce one brief of 9 content ideas. Work in the repo root
(`/Users/lanayepifanova/basis-point`).

## 1. Load context

Read in this order — do not skip, the whole point is that runs improve:

1. `agent/taste.md` — the rubric. This is binding, including its LEARNED section.
2. `agent/format.md` — the output template.
3. The **last 6 briefs** in `briefs/` — for de-duplication. An idea that repeats
   a story or tool from the last three days is rejected unless the angle is
   genuinely new. Note which ideas were rated `-` and avoid that shape.

Determine the slot: before 12:00 local → `am`, otherwise `pm`.

## 2. Research

Budget roughly 12-18 searches, weighted toward whichever bucket looks thin.

**Bucket A — news.** Search for developments in the last 72 hours across tech,
startups, markets, finance. Cast wide, then filter hard through the rubric.
Good hunting grounds: exchange and regulator announcements, prediction markets,
market-structure oddities, novel financial instruments, company mechanics that
sound implausible. Chase the strange one. Always open the primary source —
a filing, a press release, an exchange notice — before trusting coverage.

**Bucket B — tutorials.** Look for AI tools and workflows worth demoing: newly
trending open-source repos, new MCP servers, agent frameworks, automation
pipelines. Verify the thing actually works — check the repo has recent commits
and a real README, not just stars. Prefer tools where a screen recording carries
the whole story. Lana already runs a Premiere Pro MCP, so video-automation
angles are especially live.

**Bucket C — explainers.** These don't require news, but a concept that connects
to something in the current cycle is stronger. Pick concepts where the honest
explanation beats the pop-science one. Verify the technical claim — an explainer
built on a subtly wrong analogy is worse than no explainer.

**PM runs:** check the AM brief first and don't re-serve its stories. Lean
toward what broke during the day.

## 3. Write

Follow `agent/format.md` exactly. Write:
- `briefs/YYYY-MM-DD-{slot}.md`
- `briefs/YYYY-MM-DD-{slot}.json` — array of objects with keys: `id`, `bucket`,
  `title`, `hook`, `why`, `beats` (array), `sources` (array of `{name, url}`),
  `freshness`, `saturation`, `rating` (null), `extra` (bucket-specific fields).

Quality gate before writing: for each idea, ask whether you'd genuinely stop
scrolling. Cut anything that's merely informative. **Under-delivering is
correct** — a note explaining why a bucket yielded two beats a padded third.

## 4. Deliver

```bash
node scripts/send-digest.mjs briefs/YYYY-MM-DD-{slot}.md
git add briefs/ && git commit -m "Brief: {date} {slot}" && git push
```

If email fails, still commit the brief and report the failure — never lose a run.

## 5. Report

Print a 3-line summary: slot, the strongest idea, anything notably thin.
