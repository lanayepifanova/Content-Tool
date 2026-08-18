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
each, their hook menus, plus the Bucket D pitch. Follow `agent/format.md` exactly — **The script**
section there governs length, shape and voice, and each bucket section says how
its five paragraphs differ. Write:

- `briefs/YYYY-MM-DD.md`
- `briefs/YYYY-MM-DD.json` — generated by running
  `node scripts/brief-to-json.mjs briefs/YYYY-MM-DD.md`, not written by hand.

**Write the hooks after the script, not before.** Six to ten per idea, no two of
the same type, per the **Hooks** section of `agent/format.md`. Writing them
first produces six rewordings of the same sentence, because there is only one
fact in mind at that point; writing them last means the whole mined fact list is
available and the *number*, *quote* and *comparison* versions have something to
be made of. The first hook is the script's opening sentence copied verbatim —
if a later hook turns out to be the better opening, swap the script's first
sentence to match and reorder, rather than letting the two disagree.

Write the scripts yourself, one at a time, from the mined facts. Do not delegate
them. Nine scripts written by nine subagents are nine different people talking,
and the format only works if the voice is one voice — the hedging, the "I think,"
the way a source gets named mid-sentence. If context is running short, cut an
idea rather than farming out its script.

Quality gate before writing: for each short-form idea, ask whether you'd
genuinely stop scrolling, then write down the comment it would get — the actual
sentence someone types under it. If the only honest answer is a variant of
"interesting, thanks," the idea is informative and nothing else, and merely
informative is now the thing to cut. Check too that at least one Bucket A idea
and, where one exists, the Bucket B artifact-is-the-proof idea survived the
selection. For the long-form, ask whether you'd still be watching at minute six. **Under-delivering
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
- **Does it carry six to ten hooks, of six to ten different types?** Read them
  as a list. If two are the same sentence with the words moved around, one of
  them is not a hook — replace it with a type the idea hasn't used. Check each
  is under 20 words, carries a fact rather than a tease, and is true on its own:
  a hook is the sentence most likely to be quoted back, and the one that sinks
  the video if it overstates.
- **Is hook one the script's first sentence, word for word?** And would every
  other hook drop into that slot without breaking the paragraph under it? A hook
  that needs the paragraph rewritten is a different script, not an alternate.
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

Print a 7-line summary: date, the strongest short and one line on why, the best
hook in the brief quoted in full and which idea it belongs to, which
idea is the day's polarizing one and the argument it starts, the long-form idea
and the one sentence for why it holds ten minutes, the script word counts as a
range, anything notably thin — including any script you had to
write off facts you could not fully verify, and which sentence that is.
