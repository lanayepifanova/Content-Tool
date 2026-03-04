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
3. `briefs/INDEX.md` — one line per past idea, newest first, for de-duplication.
   Read the **most recent six dates** of it. An idea that repeats a story or
   tool from the last three days is rejected unless the angle is genuinely new.
   Note which ideas were rated `-` and avoid that shape. Check the previous
   Bucket D ideas separately: two long-form ideas in the same week on the same
   subject is a repeat even if the framing differs.

Read the index, not the briefs themselves. A brief is ~58KB because of its
scripts; six of them is ~87k tokens that then get replayed on every turn of the
run, and de-duplication only needs titles and angles. Open a full brief only if
the index leaves a genuine question about whether today's idea repeats one — and
then just that one, with `grep`, not a whole-file read.

`briefs/INDEX.md` is generated. If it is missing or stale, rebuild it with
`node scripts/brief-to-json.mjs --index`.

Do not read `scripts/brief-to-json.mjs` or `scripts/send-digest.mjs`. They are
run, not modified; reading them just adds context.

## 2. Research

Research runs in two passes. The first picks the ideas; the second gathers the
facts the scripts get written from. Do not merge them — choosing an idea and
mining it are different jobs, and skipping the second pass is the main way this
run fails: it produces nine scripts that sound like they were written from a
headline, because they were.

### Pass one — selection

Selection is two moves: **gather** (wide, cheap, parallel) and **judge** (yours).
Gathering is what fills a context with search results, and every result that
lands in yours is re-sent on every later turn of the run — the same argument
that puts pass two in subagents applies here, and pass one is where the run is
longest. So the searching happens in subagents and only the shortlists come
back. The judgment stays with you.

**Dispatch five gather subagents in a single message** — three for bucket A,
one each for B and C — with `subagent_type: "general-purpose"` and
`model: "sonnet"`. Bucket A is split across three separate beats on purpose:
one agent hunting all of "news" reliably comes back with three variations on
market plumbing, and three agents on three beats cannot. Do not search the
short-form buckets yourself. Give each one, inline in its prompt (it does not
share your context):

- its bucket's hunting grounds, verbatim from below
- the filter criteria from `agent/taste.md` that apply to that bucket
- the titles and angles from the six most recent dates in `briefs/INDEX.md`,
  as an explicit do-not-repeat list
- a budget of 6-10 searches, and the instruction to open the primary source
  before trusting coverage
- the return format below, and the instruction to return **only** that — no
  preamble, no ranking, no recommendation

Each B and C agent returns **6-8 candidates**; each bucket A beat agent returns
**4-5**. This shape and nothing else:

```
- **Title** — one line on the angle
  - carries it: one hard number, date, name or exact quote
  - primary: URL
  - freshness: how old · saturation: who has already covered it
  - weakest point: why this might fail the rubric
```

Then **you** pick three per bucket against `agent/taste.md`. Cast wide, filter
hard — the subagents cast, you filter. Chase the strange one. If a bucket comes
back thin or samey, re-dispatch that one agent with what was missing rather
than settling for it; that is cheaper than shipping a weak three.

**Bucket A's three must come from three different beats** — one markets, one
hardware, one startups and product — unless one beat turned up something
genuinely exceptional, and then say so in the report. Three market-structure
stories in one brief is the specific failure this split exists to prevent: the
trading and exchange material is good, but it cannot be the whole bucket.

The hunting grounds to hand each subagent:

**Bucket A — news**, as three separate beats, one agent each. All three cover
the last 72 hours, and all three open the primary source — a filing, a press
release, an exchange notice, a repo — before trusting coverage.

- **A/markets.** Exchange and regulator announcements, prediction markets,
  market-structure oddities, novel financial instruments, index and listing
  mechanics, company financial mechanics that sound implausible.
- **A/hardware.** Semiconductors, foundries and packaging, memory, chip supply
  agreements, export policy and licensing, data-center and power build-outs,
  the physical constraints under the AI trade.
- **A/startups and product.** Startups shipping a specific thing, funding
  rounds with an odd structure, product launches with a strange mechanic, big
  tech shipping or killing something, developer-tool and platform moves. This
  beat is the one a finance-led hunt walks past — do not let it come back
  filled with market stories.

**Bucket B — tutorials.** AI tools and workflows worth demoing: newly trending
open-source repos, new MCP servers, agent frameworks, automation pipelines.
Verify the thing actually works — check the repo has recent commits and a real
README, not just stars. Prefer tools where a screen recording carries the whole
story. Lana already runs a Premiere Pro MCP, so video-automation angles are
especially live.

**Bucket C — explainers.** These don't require news, but a concept that connects
to something in the current cycle is stronger. Pick concepts where the honest
explanation beats the pop-science one. Verify the technical claim — an explainer
built on a subtly wrong analogy is worse than no explainer.

**Bucket D — the long-form idea.** Its own hunt, after the nine are settled, on
a subject the shorts don't already cover. Same instincts, different depth
target: you are looking for an argument that survives ten minutes, not a fact
that lands in ten seconds.

Work it in this order:

1. **Pick two or three candidates** from the shortlists — including threads you
   rejected as shorts because they needed too much setup. That rejection reason
   is often exactly what makes a good long-form. If the shortlists give you
   nothing, dispatch one more gather subagent aimed at D specifically.
2. **Try to break each one.** Dispatch one subagent per candidate, all in a
   single message, same type and model as above. Each reads the primary sources
   properly — not just the coverage — and returns, in under 20 lines: whether
   reading further made the story *more* interesting or less, the two or three
   facts that decide it, the strongest case against, and the sources it opened.
   A candidate survives only if reading further made it more interesting. If the
   second source flattens the story into something ordinary, it is dead.
3. **Run the substance test** from `agent/taste.md` yourself — all four
   questions, answered concretely, on what came back. Write the chapter
   breakdown before deciding it works: if the middle chapters are vague, the
   idea is thin and you have found that out cheaply.
4. **Check what goes on screen.** Name the specific documents, charts, or
   recordings. An idea with no visual plan is not ready.

Prefer a live news peg when one exists, but evergreen is allowed here. If no
candidate survives, ship the nine shorts and write a `> note:` under a `## D1`
heading saying what you looked at and why none held up. That is a real result,
not a failed run.

### Pass two — mining the selected ideas

Once the ten ideas are chosen, mine each one for the facts its script will be
built out of. This produces a **working fact list that does not ship** for the
nine shorts — it is the input you write the script from, and it stays in your
context rather than in the brief. Only Bucket D's list goes into the file, as
**The material**.

Target 10-16 facts per short and 20-30 for the long-form. That is deliberately
more than a 500-word script can hold: a script written from six facts reads
like it was written from six facts, and the fifth paragraph — the caveat, the
counter-argument, the thing that complicates the tidy version — is exactly the
part that comes from the facts you didn't strictly need.

This is the expensive part of the run and it is the point of the run. Budget
2-4 further searches or fetches per idea — call it 25-40 across the brief, on
top of pass one. Ten well-chosen ideas mined thinly produce ten scripts that
say nothing.

**Run this pass as parallel subagents — one per idea, all dispatched in a
single message.** Mining is ten independent extraction jobs, and doing them
inline means all forty-odd search results stay in context for the rest of the
run and get re-sent on every subsequent turn. A subagent's searches live and
die in its own context; only the finished bullets come back.

Use the Agent tool with `subagent_type: "general-purpose"` and
`model: "sonnet"` — this is verification and extraction against a fixed
standard, not judgment, and the selection you already made was the judgment
call. **The subagents mine; you write.** Do not ask a subagent for the script:
the voice is the product, it is consistent across the nine, and it is not
delegable to a model that has never read a rated brief.

Give each subagent, inline in its prompt (it does not share your context):

- the idea's id, title and one-line angle
- its sources so far, as URLs
- the six mining rules below, verbatim
- the bullet target, and the bullet rules from **The material** in
  `agent/format.md` — they govern the working list too, shipped or not
- the instruction to return **only** the finished bullet list as markdown
  `- ` lines, no preamble, and to say plainly which bullets it could not verify

Then check what comes back before you write from it: any bullet without a hard
number, date, name or exact quote gets cut, and an idea that came back thin is
your problem to fix, not the subagent's. If a subagent fails or returns nothing,
mine that idea yourself inline rather than writing a script off thin air.

The six rules each subagent applies:

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
   against the framing, and return it with the rest. It is not a footnote here —
   it becomes a paragraph of the script, said out loud. If a comment could
   embarrass her with a fact, that fact gets said before the comment can make it.
6. **Quote exactly.** Named speaker, verbatim, in quotation marks. If you cannot
   find the exact wording, do not present it as a quote.

For Bucket B, say so explicitly in that subagent's prompt: its mining is
hands-on rather than journalistic. Read the actual README and recent commits,
get the real install command and version numbers, the config that has to be
right, the true cost per run, and the error people actually hit. Check the
issues tab for what breaks.

The Bucket B subagent also returns the **How you set it up** walkthrough — the
6-12 numbered steps specified in `agent/format.md`, and the one short-form field
that still ships alongside the script — plus three to five other real jobs the
same setup does, which you fold into the script's last paragraph rather than
listing. All of it comes out of the same reading, so ask for it in one prompt:
the steps must be the real ones from the README and the repo, with commands and
versions verbatim, not a plausible-looking reconstruction. A step the subagent
could not verify is left out and flagged, exactly like a fact.

Every subagent prompt ends with this, verbatim: never invent a fact to fill the
list. Fewer, harder bullets beat a padded list, and a wrong number is far worse
than a missing one — it is going into a script she reads out loud as her own. If something could not be
verified, leave it out rather than hedging it in.

## 3. Write

This is now the longest part of the run: nine finished scripts of 600-1000 words
each, plus the Bucket D pitch. Follow `agent/format.md` exactly — **The script**
section there governs length, shape and voice, and each bucket section says how
its five paragraphs differ. Write:

- `briefs/YYYY-MM-DD.md`
- `briefs/YYYY-MM-DD.json` — generated by running
  `node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md`, not written by hand.

Write the scripts yourself, one at a time, from the mined facts. Do not delegate
them. Nine scripts written by nine subagents are nine different people talking,
and the format only works if the voice is one voice — the hedging, the "I think,"
the way a source gets named mid-sentence. If context is running short, cut an
idea rather than farming out its script.

Quality gate before writing: for each short-form idea, ask whether you'd
genuinely stop scrolling. Cut anything that's merely informative. For the
long-form, ask whether you'd still be watching at minute six. **Under-delivering
is correct** — a note explaining why a bucket yielded two beats a padded third.

Then read each finished script back against these, and fix what fails:

- **Is it 600-1000 words?** Count them — `wc -w` on the script, not an estimate.
  The first brief in this format self-reported 505-620 words for scripts that
  actually ran 644-847, so the estimate is not trustworthy and the check is
  cheap. Short of 600 usually means a missing paragraph, not a tight one.
- **Could she record it as written?** Read it aloud in your head, start to
  finish. Anything she'd have to silently skip, reword or look up is a defect —
  a bracket, a bullet, a stage direction, a URL, an unexplained term.
- **Is every number in it verified, with its baseline?** A figure with no
  before-number is half a fact. A figure you could not verify does not belong in
  a sentence she says on camera.
- **Does the fourth or fifth paragraph carry the inconvenient part?** The caveat,
  the counter-argument, the place the analogy stops holding. A script that only
  argues one side is the specific failure the old material section prevented.
- **Does it end on a view rather than a recap?** If the last paragraph
  summarises the first four, it is not written yet.
- **Does it carry its tags?** Five to eight single-token lowercase hashtags on
  one line after **Sources**, every one naming something the script actually
  says. Write them while the sources are still in front of you — at upload time
  they get reconstructed from memory, which is how a video ends up tagged
  `#ai #tech #news`.
- **Do the nine sound like one person?** Read the opening sentences of all nine
  together. If one is in a different register, rewrite it, not the others.

## 4. Deliver

```bash
node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md
node scripts/send-digest.mjs briefs/YYYY-MM-DD.md
git add briefs/ && git commit -m "Brief: {date}" && git push
```

If email fails, still commit the brief and report the failure — never lose a run.

## 5. Report

Print a 5-line summary: date, the strongest short and one line on why, the
long-form idea and the one sentence for why it holds ten minutes, the script
word counts as a range, anything notably thin — including any script you had to
write off facts you could not fully verify, and which sentence that is.
