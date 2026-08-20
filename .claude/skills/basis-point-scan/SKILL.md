---
name: basis-point-scan
description: Run a Basis Point content scan — research and pitch 9 short-form content ideas (3 news, 3 tutorials, 3 explainers) into a dated brief, then email the digest. Use when asked to find content ideas, run the scan, or generate today's brief. Also invoked by the daily schedule.
---

# Basis Point Scan

Produce one brief: nine short-form ideas — three news, three tutorials, three
explainers. Short-form only; there is no long-form bucket. Runs once a day. Work
in the repository root — the directory containing `agent/`, `briefs/`, and
`scripts/`.

**Each idea ships as a pitch, not a script.** Hooks, then two or three sentences
of what the story is. The 600-1000 word script is written later, in conversation,
for the ideas Lana keeps — writing nine of them up front spent most of a run on
ideas that were about to be killed. `agent/format.md` is the contract; follow it
exactly.

## 1. Load context

Read in this order — do not skip, the whole point is that runs improve:

1. `agent/taste.md` — the rubric. This is binding, including its LEARNED section.
2. `agent/format.md` — the output template.
3. `briefs/INDEX.md` — one line per past idea, newest first, for de-duplication.
   Read the **most recent six dates** of it. An idea that repeats a story or
   tool from the last three days is rejected unless the angle is genuinely new.
   Note which ideas were rated `-` and avoid that shape.

Read the index, not the briefs themselves — de-duplication only needs titles and
angles, and a brief that has had scripts written into it is large enough that six
of them cost more context than the whole rest of the run. Open a full brief only
if the index leaves a genuine question about whether today's idea repeats one —
and then just that one, with `grep`, not a whole-file read.

Also read `briefs/KILLED.md`. It is short, it is the negative half of the
signal, and the **Verdicts** section of `agent/taste.md` generalises from it.

`briefs/INDEX.md` is generated. If it is missing or stale, rebuild it with
`node scripts/brief-to-json.mjs --index`.

Do not read `scripts/brief-to-json.mjs` or `scripts/send-digest.mjs`. They are
run, not modified; reading them just adds context.

## 2. Research

Research runs in two passes. The first picks the ideas; the second checks that
each one is true and finds the detail the pitch turns on. Do not merge them —
choosing an idea and verifying it are different jobs, and skipping the second is
how a brief ends up pitching a story that falls apart on the first primary
source.

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
  - the argument: the one sentence two viewers would disagree about under this
  - primary: URL
  - freshness: how old · saturation: who has already covered it
  - weakest point: why this might fail the rubric
```

The **argument** line is not optional and is not a summary. It is filter 6 from
`agent/taste.md`, answered per candidate, and it is the field the selection
turns on: a candidate whose argument line reads "people would find this
interesting" has answered that it has none. Tell each subagent to write it
honestly rather than talking a weak candidate up — a shortlist of five with two
honest blanks is more useful than five inflated ones.

Then **you** pick three per bucket against `agent/taste.md`. Cast wide, filter
hard — the subagents cast, you filter. Chase the strange one. If a bucket comes
back thin or samey, re-dispatch that one agent with what was missing rather
than settling for it; that is cheaper than shipping a weak three.

**Bucket A's three must come from three different beats** — one markets, one
hardware, one startups and product — unless one beat turned up something
genuinely exceptional, and then say so in the report. Three market-structure
stories in one brief is the specific failure this split exists to prevent: the
trading and exchange material is good, but it cannot be the whole bucket.

**And at least one of the three is the strong-form polarizing story** — see
*The polarization axis* in `agent/taste.md`. That is the 292k-view shape: a real
first-of-its-kind that a general audience will fight about the meaning of. The
two constraints are independent — the polarizing one can come from any beat —
and where they collide, take the fight over the tidier beat spread and say so
in the report. If no beat produced one, do not manufacture it by reframing a
mild story loudly: re-dispatch the beat that came closest with an explicit
instruction to hunt for what people are already arguing about, and if that also
comes back empty, ship three good non-polarizing ideas and say so.

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

Tell all three beat agents, in their prompts, what the best-performing story of
this kind looked like: an exchange announcing futures on GPU compute time. New,
real, verifiable from a primary source, and impossible to read without forming
an opinion about what it says about the economy. Its top comment was "Peak
recession indicator" with 2,385 likes.

Hand them the anger targets from *What people are already angry about* in
`agent/taste.md`, verbatim, as hunting ground — data centers and what they cost
a specific town, AI replacing somebody's craft, things built that nobody voted
for, a named company doing the predictable thing at somebody's expense, and new
indexes or futures on things that sound like they should not be tradable. These
are where a live grievance is already sitting and only needs a peg. The
A/hardware agent in particular should treat data-center power, water, grid and
siting stories as a first-class beat rather than a footnote to chips.

The bar does not move: the grievance has to exist without the framing, the facts
have to come from a primary source, and the candidate has to carry a mechanism
worth explaining. A story that is only infuriating is not a candidate — return
it only if there is something underneath the anger to teach.

Ask each of them to include at least one candidate whose *implications* are
contested — something being made
tradable, automated, priced or replaced that a normal person has a reaction to —
and to say in the argument line what the two sides actually are. They are being
asked to find where a real fight exists, not to make an ordinary story sound
like one; a candidate whose controversy only appears if you frame it in bad
faith fails filter 5 and should not be returned.

**Bucket B — tutorials, Claude only.** State this at the top of that
subagent's prompt, in these words: every candidate must be a thing **Claude**
does. No other AI tool, model, agent framework, wrapper or third-party MCP
server — not as the subject, not as the recommendation, not named in the title.
Other people's products are sponsorship inventory and are not covered free.
Software Claude operates may appear as the surface it acts on — Premiere, a
browser, a terminal, a repo — but the capability being shown is Claude's, and a
candidate that survives its own Claude being swapped out is a competitor's demo.
A shortlist that comes back full of other tools is a failed dispatch: send it
again rather than picking the least-bad entry.

Hunting grounds, then: Claude Code and what it can be pointed at, driving
Premiere Pro from Claude, Claude in Chrome working a live browser, subagents and
orchestration, skills and hooks and scheduled runs, Claude writing and then
running its own code, long-context and whole-repo work, and anything where
Claude does a job that is visibly a person's job. Verify against the actual
docs, changelog or release notes rather than coverage.

Rank candidates on two things and say so in the prompt: **how visible** the
result is on a phone in the first seconds, and **what there is to argue about**.
The best-performing tutorial to date was a reel edited entirely by Claude that
said so — the artifact was the proof, and the comments were people fighting
about whether it looked good. So prefer output a general audience feels
entitled to rate — an edit, a design, a page, a piece of writing, a UI — over a
correct-looking terminal response, and flag which candidates could produce *the
video itself*. A candidate whose demo is a wall of logs, or one nobody could
disagree with, is weak here however impressive the capability, and its
weakest-point line should say so.

**Bucket C — explainers.** These don't require news, but a concept that connects
to something in the current cycle is stronger. Pick concepts where the honest
explanation beats the pop-science one. Verify the technical claim — an explainer
built on a subtly wrong analogy is worse than no explainer.

### Pass two — checking the selected ideas

Once the nine ideas are chosen, check each one against its primary source. This
pass answers two questions and stops: **is the story true as pitched,** and
**what is the one detail the pitch turns on** — the strange fact, the reversal,
the number with its baseline.

Target 5-8 verified facts per idea. That is enough to write the hooks and the
two or three sentences honestly, and enough to know the story does not collapse
on contact with the filing. It is deliberately less than the old mining pass:
the deep fact list — 10-16 bullets, the counter-arguments, the timeline — is
what a script is written from, and it gets gathered when a script is asked for,
on the one or two ideas that survive triage rather than on all nine.

Budget 1-2 searches or fetches per idea, call it 10-18 across the brief. **A
hook that overstates is the failure this pass exists to prevent** — it is the
sentence most likely to be quoted back, and the brief is now mostly hooks.

**Run this pass as parallel subagents — one per idea, all dispatched in a
single message.** A subagent's searches live and die in its own context; only
the finished bullets come back.

Use the Agent tool with `subagent_type: "general-purpose"` and
`model: "sonnet"` — this is verification and extraction against a fixed
standard, not judgment, and the selection you already made was the judgment
call. **The subagents check; you write.** Do not ask a subagent for the hooks:
the voice is the product, it is one voice across the nine, and it is not
delegable to a model that has never read a rated brief.

Give each subagent, inline in its prompt (it does not share your context):

- the idea's id, title and one-line angle
- its sources so far, as URLs
- the five checking rules below, verbatim
- the bullet target — 5-8 verified facts
- the instruction to return **only** the finished bullet list as markdown
  `- ` lines, no preamble, and to say plainly which bullets it could not verify

Then check what comes back before you write from it: any bullet without a hard
number, date, name or exact quote gets cut, and an idea that came back thin is
your problem to fix, not the subagent's. **An idea whose central claim could not
be verified is cut from the brief,** not pitched with a hedge — a hook is the
one sentence that has to be true standing alone.

The five rules each subagent applies:

1. **Go back to the primary source and read it,** not the coverage of it. The
   numbers, dates and exact quotes come from the filing, the release, the repo,
   the order. Coverage is for finding the story; primaries are for the facts.
2. **Get the before-number.** A figure alone is not material — "$11.5B" means
   nothing without "up from $787M." Every headline number needs its baseline,
   its comparison, or its scale.
3. **Pin the timeline.** Specific dates, in order, including what happens next
   and when.
4. **Name the actors** and what each one wanted.
5. **Say what would kill it.** One line: the fact that, if true, makes this
   story ordinary. You are not writing the counter-argument out here — that
   belongs to the script — but if reading the primary source flattened the story
   into something predictable, say so plainly. That is the most useful thing you
   can return.

And when quoting: named speaker, verbatim, in quotation marks. If you cannot
find the exact wording, do not present it as a quote.

For Bucket B, say so explicitly in that subagent's prompt: its mining is
hands-on rather than journalistic. Read the actual README and recent commits,
get the real install command and version numbers, the config that has to be
right, the true cost per run, and the error people actually hit. Check the
issues tab for what breaks.

The Bucket B subagent also returns the **How you set it up** walkthrough — the
6-12 numbered steps specified in `agent/format.md`, which is the one extra field
a tutorial entry still ships. All of it comes out of the same reading, so ask
for it in one prompt: the steps must be the real ones from the README and the
repo, with commands and versions verbatim, not a plausible-looking
reconstruction. A step the subagent could not verify is left out and flagged,
exactly like a fact.

Every subagent prompt ends with this, verbatim: never invent a fact to fill the
list. Fewer, harder bullets beat a padded list, and a wrong number is far worse
than a missing one — it is going into a hook she says on camera as her own. If
something could not be verified, leave it out rather than hedging it in.

## 3. Write

Follow `agent/format.md` exactly. An entry is a title, **Hooks**, **What it
is**, **Sources** and **Tags** — plus **How you set it up** for Bucket B. No
script. Write:

- `briefs/YYYY-MM-DD.md`
- `briefs/YYYY-MM-DD.json` — generated by running
  `node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md`, not written by hand.

**The hooks are the run's real output.** They are what an idea is triaged on now
that there is no script under them, and they are what gets said on camera
unchanged. Six to ten per idea, no two of the same type, per the **Hooks**
section of `agent/format.md`. Hook one is the strongest, not the first one you
wrote.

Two rules from `agent/taste.md` bear directly on how a hook is written, and they
are the ones most often missed:

- **It has to land on someone outside the beat.** Every noun a stranger already
  owns. "The cheap AI costs more at busy times of day" works on someone who has
  never heard of DeepSeek; "DeepSeek introduced off-peak API pricing" only works
  on someone who was going to watch anyway. Where the mechanism has no everyday
  name, borrow one — the *familiar thing* type exists for exactly this.
- **It carries a fact, not a tease.** The line is the thing itself, stated
  plainly, and it is true standing alone. This is the constraint that separates
  a hook that travels from a headline that gets fact-checked in the replies.

Write **What it is** after the hooks: two or three sentences, per the spec in
`agent/format.md`. What happened, the detail that makes it a video, and where it
earns one, the argument it starts.

Quality gate, per idea, before it goes in the brief:

- **Would you stop scrolling?** Then write down the comment it would get — the
  actual sentence someone types under it. If the only honest answer is a variant
  of "interesting, thanks," the idea is informative and nothing else, and merely
  informative is the thing to cut.
- **Does it pass filter 7?** Name what a person who follows this beat would have
  guessed, and how the story differs. If it does not differ, cut it — this is
  the filter that killed the chip-plant story, the model-licence story and the
  hockey-futures story, and predictable ideas arrive dressed as trending ones.
- **Is hook one under 20 words, factual, and true alone?** Read it cold.
- **Are the hooks six different ways in, or one sentence six times?** If two are
  the same fact reworded, one is not a hook — replace it with a type the idea
  has not used.
- **Is every number in a hook verified, with its baseline?** A figure with no
  before-number is half a fact, and it is going on camera.
- **Do the nine sound like one person?** Read the nine hook-ones together. If
  one is in a different register, rewrite it, not the others.
- **Does it carry its tags?** Five to eight single-token lowercase hashtags on
  one line after **Sources**, every one naming something the idea actually
  involves. Write them while the sources are still in front of you.

Check that at least one Bucket A idea is the day's polarizing one, and that the
Bucket B artifact-is-the-proof idea survived where one exists. **Under-delivering
is correct** — a note explaining why a bucket yielded two beats a padded third.

## 4. Deliver

```bash
node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md
node scripts/send-digest.mjs briefs/YYYY-MM-DD.md
git add briefs/ && git commit -m "Brief: {date}" && git push
```

If email fails, still commit the brief and report the failure — never lose a run.

## 5. Report

Print a 6-line summary: date, the strongest idea and one line on why, the best
hook in the brief quoted in full and which idea it belongs to, which idea is the
day's polarizing one and the argument it starts, any bucket that under-delivered
and why, and anything notably thin — including any idea whose central claim you
could only partly verify, and which claim that is.

Do not offer to write scripts. Lana asks for those on the ideas she keeps.
