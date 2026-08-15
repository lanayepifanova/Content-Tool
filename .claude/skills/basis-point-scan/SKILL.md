---
name: basis-point-scan
description: Run a Basis Point content scan — research and write 10 content ideas (3 news, 3 tutorials, 3 explainers, 1 long-form YouTube) into a dated brief, then email the digest. Use when asked to find content ideas, run the scan, or generate today's brief. Also invoked by the daily schedule.
---

# Basis Point Scan

Produce one brief: nine short-form ideas and one long-form YouTube idea. Runs
once a day. Work in the repository root — the directory containing `agent/`,
`briefs/`, and `scripts/`.

## 1. Load context

Read in this order — do not skip, the whole point is that runs improve:

1. `agent/taste.md` — the rubric. This is binding, including its LEARNED section.
2. `agent/format.md` — the output template.
3. The **last 6 briefs** in `briefs/` — for de-duplication. An idea that repeats
   a story or tool from the last three days is rejected unless the angle is
   genuinely new. Note which ideas were rated `-` and avoid that shape.
   Check the previous Bucket D ideas separately: two long-form ideas in the
   same week on the same subject is a repeat even if the framing differs.

Older briefs are named `YYYY-MM-DD-am.md` / `-pm.md` from when this ran twice a
day. Read them the same way; new briefs are just `YYYY-MM-DD.md`.

## 2. Research

Research runs in two passes. The first picks the ideas; the second is what
makes the brief usable without any further work from Lana. Do not merge them —
choosing an idea and mining it are different jobs, and skipping the second pass
is the main way this run fails.

### Pass one — selection

Budget roughly 12-18 searches for the short-form buckets, weighted toward
whichever looks thin, then 6-10 more for the long-form.

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

**Bucket D — the long-form idea.** Research this as its own hunt, after the
nine are settled, on a subject the shorts don't already cover. Same instincts,
different depth target: you are looking for an argument that survives ten
minutes, not a fact that lands in ten seconds.

Work it in this order:

1. **Pick two or three candidates** from the day's research — including threads
   you found interesting but rejected as shorts because they needed too much
   setup. That rejection reason is often exactly what makes a good long-form.
2. **Try to break each one.** Read the primary sources properly, not just the
   coverage. The candidate survives only if reading further made it *more*
   interesting rather than less. If the second source flattens the story into
   something ordinary, drop it and move to the next candidate.
3. **Run the substance test** from `agent/taste.md` — all four questions,
   answered concretely. Write the chapter breakdown before deciding it works:
   if the middle chapters are vague, the idea is thin and you have found that
   out cheaply.
4. **Check what goes on screen.** Name the specific documents, charts, or
   recordings. An idea with no visual plan is not ready.

Prefer a live news peg when one exists, but evergreen is allowed here. If no
candidate survives, ship the nine shorts and write a `> note:` under a `## D1`
heading saying what you looked at and why none held up. That is a real result,
not a failed run.

### Pass two — mining the selected ideas

Once the ten ideas are chosen, go back through them one at a time and gather
**The material**: the raw fact list defined in `agent/format.md`. Target 10-16
bullets per short, 20-30 for the long-form.

This is the expensive part of the run and it is the point of the run. Budget
2-4 further searches or fetches per idea — call it 25-40 across the brief, on
top of pass one. A brief with ten well-chosen ideas and thin material is worse
than one with eight ideas mined properly.

For each idea:

1. **Go back to the primary source and read it,** not the coverage of it. The
   numbers, dates and exact quotes come from the filing, the release, the repo,
   the order. Coverage is for finding the story; primaries are for the facts.
2. **Get the before-number.** A figure alone is not material — "$11.5B" means
   nothing without "up from $787M." Every headline number needs its baseline,
   its comparison, or its scale.
3. **Pin the timeline.** Specific dates, in order, including what happens next
   and when.
4. **Name the actors** and what each one wanted.
5. **Find the counter-argument.** Actively search for the strongest case
   against the framing, and put it in the material. If a comment could embarrass
   her with a fact, that fact goes in the brief.
6. **Quote exactly.** Named speaker, verbatim, in quotation marks. If you cannot
   find the exact wording, do not present it as a quote.

For Bucket B the mining is hands-on rather than journalistic: read the actual
README and recent commits, get the real install command and version numbers, the
config that has to be right, the true cost per run, and the error people
actually hit. Check the issues tab for what breaks.

Never invent a fact to fill the list. Fewer, harder bullets beat a padded list,
and a wrong number is far worse than a missing one — she will say it on camera.
If something could not be verified, leave it out rather than hedging it in.

## 3. Write

Follow `agent/format.md` exactly. Write:
- `briefs/YYYY-MM-DD.md`
- `briefs/YYYY-MM-DD.json` — generated by running
  `node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md`, not written by hand.

Quality gate before writing: for each short-form idea, ask whether you'd
genuinely stop scrolling. Cut anything that's merely informative. For the
long-form, ask whether you'd still be watching at minute six. **Under-delivering
is correct** — a note explaining why a bucket yielded two beats a padded third.

Then the material gate, applied per idea: could Lana open this brief and start
recording without looking anything up? If she'd still need to go find a number,
a date, or the other side of the argument, the material isn't finished. This
gate is about completeness, not brevity — it is the one place in the brief
where more is better.

## 4. Deliver

```bash
node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md
node scripts/send-digest.mjs briefs/YYYY-MM-DD.md
git add briefs/ && git commit -m "Brief: {date}" && git push
```

If email fails, still commit the brief and report the failure — never lose a run.

## 5. Report

Print a 5-line summary: date, the strongest short, the long-form idea and the
one sentence for why it holds ten minutes, the total material bullets gathered,
anything notably thin — including any idea whose material you could not fill
out properly and why.
