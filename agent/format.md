# Basis Point — Output Format

Every run writes two files:
- `briefs/YYYY-MM-DD.md`   — the human-readable brief (source of truth)
- `briefs/YYYY-MM-DD.json` — same content, for the React UI

One run per day. Nine short-form ideas: three news (A), three tutorials (B),
three explainers (C). Short-form only — there is no long-form bucket.

**An entry is a pitch, not a script.** The hooks, then two or three sentences of
what the story actually is, and that is the entry. Enough to decide on, and no
more. In Lana's words: *"You don't need too much info, just like the hook or
main idea and a couple sentences. I can expand on the script if I approve of the
piece of news."*

So an entry is a title, **Hooks**, **What it is**, **Sources** and **Tags**.
Nothing else, in any of the three buckets — no beat sheet, no fact list, no
script. Bucket B adds its numbered setup walkthrough, because building the thing
is a separate job from describing it.

**The script gets written after she approves the idea,** in conversation, not in
the brief. Nine finished 600-1000 word scripts per run was most of the cost of a
run spent writing for ideas that were about to be killed — eight of nine on a
typical day. The rules for what a script has to be still live in **The script**
below; they apply when one is asked for.

**Hooks are the exception to the trimming.** The first line is the whole draw,
it is the one sentence worth writing several versions of, and it is what an idea
is triaged on now that the script is not there to read. Six to ten of them, and
the choice between them is Lana's rather than the run's.

---

## Markdown template

```
# Basis Point — {Weekday}, {Month D}
_{N} ideas · generated {HH:MM} · sources checked: {count}_

---

## A1 · NEWS · {four-to-six word title}

**Hooks**
- {type} — {the line, exactly as spoken}
- {type} — {the line}
- {...six to ten, no two of the same type}

**What it is**
{Two or three sentences. What happened or what the thing does, the detail that
makes it worth a video, and the argument it starts. Written to be decided on in
about fifteen seconds — this is not paragraph one of the script.}

**Sources**
- {publication} — {url}
- {primary source, filing, or repo} — {url}

**Tags** #{five to eight lowercase hashtags, one line, space separated}

**Freshness** {N}h ago · **Saturation** low | medium | high

`rate: ` ← put + or - here

---
```

`B1..B3` and `C1..C3` use the same five fields, with `TUTORIAL` and `EXPLAINER`
in the header. Bucket B adds **How you set it up** between **What it is** and the
sources.

---

## Hooks

The opening line, in six to ten versions, no two of the same type. It is the
first field in the entry because it is the first three seconds of the video,
and the two best-performing posts to date are both remembered as their hook —
"Wall Street is now going to let you trade GPU hours" and "this video was edited
100% by Claude." One line of the script did most of the work; writing one
version of it and moving on is leaving the highest-leverage sentence in the
brief to a first draft.

**The first hook is the one the script actually opens with.** The rest are
swaps. That keeps the promise that a script can be recorded exactly as written,
and it means the field is a menu rather than homework.

**Every hook is a drop-in replacement for the script's first sentence.** Swap
any of them in and paragraph one still runs — same facts, same tense, nothing
downstream left dangling by the change. A hook that requires rewriting the
paragraph under it is not a hook, it is a different script.

Each one:

- **One sentence, under 20 words.** Four seconds spoken. If it needs a comma
  splice and two clauses to land, it is the script's second sentence.
- **Carries a fact, not a tease.** "Something strange happened in the futures
  market this week" is a promise; "an exchange listed a futures contract on GPU
  time on Tuesday" is the thing itself. The fact is what makes it unskippable.
- **True standing alone,** and supported by the script under it. A hook is the
  most-quoted sentence in the video and the one a comment screenshots — it eats
  the whole credibility of the piece if it overstates by even a little.
- **No rhetorical question, no "you won't believe," no "this changes
  everything," no "let me explain,"** and nothing that reads as a title card
  rather than a person talking.
- **Lands for someone outside the beat.** Every noun has to be one a stranger
  already owns. "The cheap AI costs more at busy times of day" works on a
  person who has never heard of DeepSeek; "DeepSeek introduced off-peak
  discount pricing on its API" works on someone who already reads about
  DeepSeek, and that person was going to watch anyway. Write for the one who
  wasn't. When the mechanism has no everyday name, borrow one — the strongest
  version of this hook is the analogy to a thing the viewer already gets a bill
  for, and the reference case is *"Starting Monday, the cheap AI costs more at
  busy times of day. Like electricity."*

### The types

Label each hook with its type, so the menu is visibly a menu of different
approaches rather than one idea reworded. Draw from these, and use the label
verbatim:

- **flat first** — the plain sentence of new fact that sounds invented but
  isn't. Named actor, new thing, odd object, no adjectives. *"Wall Street is now
  going to let you trade GPU hours."* This is the reference case and every idea
  should have one.
- **sounds fake** — the absurd juxtaposition, stated deadpan. *"Citadel and SIG
  just wrote a hedging contract on goats."*
- **number** — the figure with its baseline inside the sentence, so the scale
  lands without a second line. *"$11.5B of it, up from $787M a year ago."*
- **artifact** — a claim about the thing being watched right now, verifiable by
  looking. *"This video was edited 100% by Claude."* Bucket B's strongest, and
  available to any idea where the proof is on screen.
- **reversal** — what was true until a specific date and isn't now. *"Six months
  ago this was illegal."*
- **stakes** — the consequence named before its cause. *"Somebody just bought
  insurance against a model getting worse."*
- **correction** — the belief being overturned, stated as the viewer holds it.
  *"You have probably heard that {X}. That is not quite right."* Bucket C's
  default, and it needs the popular version stated fairly.
- **quote** — exact startling words, attributed in the same breath. *"The CFTC's
  own order uses the phrase '{...}'."*
- **comparison** — two things put side by side that should not be comparable,
  where the comparison is literally true. *"There is now a deeper market for
  compute time than for most corporate bonds."*
- **scene** — the physical detail that implies the whole story. *"There is a
  substation in Ohio with its own dedicated gas plant."*
- **second person** — puts the viewer inside the fact, without inventing one.
  *"You can now take a position on how much electricity a chatbot burns."*
- **familiar thing** — the strange new mechanism named as the ordinary one it
  behaves like, where the likeness is exact rather than decorative. *"The cheap
  AI costs more at busy times of day. Like electricity."* Use it when the story
  is true but the vocabulary is the barrier.

Six to ten of these per idea, each a different type. Where a type genuinely has
no honest version for a story, skip it rather than forcing one — eight real
hooks beat ten with two stretched. The mix is the point: they should not be one
sentence with the words moved around, they should be six different ways in.

---

## What it is

Two or three sentences, and they are the entry. Their job is to let Lana decide
in about fifteen seconds, so they are not the script's first paragraph moved up:

- **Sentence one is what happened,** with the date, the named actor and the
  number that carries it. Not the framing, the event.
- **Sentence two is the detail that makes it a video** — the part that is
  strange, or that reverses what the reader assumed, or that they would not have
  guessed. If there is no such sentence, the idea failed filter 7 and should not
  be in the brief.
- **Sentence three, where it earns its place, is the argument it starts** — who
  disagrees and about what. Skip it rather than writing a vague one.

No stage directions, no "in this video," no promises about what the script will
cover. It is written the way you would tell a friend the story in a sentence and
a half, because that is the test it has to pass anyway.

---

## The script

**Not written during a scan.** A brief ships pitches; a script is written when
Lana approves an idea and asks for it, in conversation. This section is the
standard it is written to when that happens, and the bucket sections below only
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

A stated view is also the only thing in the script a comment can disagree with,
which is what the two best-performing videos were built on. Refusing to land
one — ending on "it will be interesting to see" — turns a piece with a fight in
it into a summary of the fight. Pick the reading you actually find more
convincing, say why in a sentence, and keep the hedge attached: "probably part
of the story without being the entire story" is still a position. What is not
allowed is manufacturing a stronger view than the evidence carries.

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

## Tags

The hashtags that go in the upload box, so a finished idea carries everything
the post needs and the tags get written by whoever just read the sources rather
than from memory at upload time. Five to eight of them, on one line, after
**Sources**.

**Every tag is a single lowercase token** — `#predictionmarkets`, not
`#prediction markets` and not `#PredictionMarkets`. A space ends a hashtag on
every platform, so a two-word tag posts as one tag plus one loose word. No
punctuation inside a tag, no emoji, no tag that is only a number.

The mix, in this order:

1. **Two or three subject tags** — what the video is actually about:
   `#predictionmarkets`, `#localllm`, `#datacenters`.
2. **Two or three named things from the script** — the company, the tool, the
   ticker, the paper: `#cme`, `#nhl`, `#browseruse`. These are what someone
   following the story searches.
3. **One or two category tags** — the shelf it sits on: `#fintech`, `#ai`,
   `#trading`.

Every tag names something the script actually says. A tag carried for reach
alone — `#fyp`, `#viral`, `#foryou`, or a trending tag unrelated to the
subject — does not go in.

---

## Bucket A — the news script

The shape:

1. **Open on the concrete thing that happened,** with its number and its date,
   in the first two sentences. No windup, no "you may have seen." The first line
   is the line that stops a scroll, and it is a fact rather than a tease — it is
   also hook one from the **Hooks** menu above, written out identically. News is
   where the *flat first*, *sounds fake* and *reversal* types live; give it at
   least those three among its six to ten.
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

**Where the argument goes.** For a story with a real fight in it — the kind
filter 6 in `agent/taste.md` asks you to name — the fight belongs in paragraphs
four and five, never in the open. The open stays a fact. Then give both
readings at their strongest: the "this is a normal market doing a normal thing"
one and the "this is what the top of a cycle looks like" one, each stated the
way its own side would state it. Then say which you find more convincing and
why. Two honest readings plus a stated preference is what sends people to the
comments; one reading is a lecture and no reading is a summary.

Say the loaded implication out loud rather than gesturing at it. If the honest
reading of a story is that something is being financialized that probably
should not be, that sentence goes in the script — sourced, hedged to exactly
the width of the evidence, and said plainly. It does not go in as a rhetorical
question, and it does not go in bigger than the facts support.

Dates are absolute — "on Tuesday" is dead in a week; "on August 12th" is not.

---

## Bucket B — the tutorial script

Every tutorial is a Claude capability — see **Bucket B** in `agent/taste.md`.
Another company's tool is never the subject, never the recommendation and never
in the title; software Claude operates appears only as the surface it works on.
The script names Claude as the thing doing the work, in the first two sentences,
because that is also the claim people argue with.

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
   she knows what has to be recorded by then. Name what a viewer sees in the
   **first fifteen seconds** as well as where the payoff sits in the arc — a
   demo whose result only becomes visible at minute four gets judged on its
   first five seconds regardless, so the finished artifact has to be on screen
   early even if the explanation of it comes later.
5. **Where else this goes** — two or three other real jobs the same setup does,
   and the honest cost or limit: what it charges per run, what breaks, what it
   cannot do.

Its hook menu leads with the *artifact* type wherever the build allows one, and
carries *stakes* and *number* versions for the same idea — a tool demo can open
on what it made, on what it costs, or on the job it just deleted, and those pull
different audiences.

**The artifact-is-the-proof variant.** When the tool's output can be the video
itself — the edit, the graphic, the page, the clip the viewer is currently
watching — write it that way, and make the claim in the first two sentences:
"this video was edited entirely by Claude" and then the unretouched result. The
claim and the evidence arrive together, everyone watching is qualified to judge
it, and the argument about whether it is any good starts before the script is
over. Two rules if the script takes this shape: claim it flatly, with no
pre-emptive apology and no "obviously a human still checked it" — the hedging
is what kills it — and then name what it did badly yourself in the last
paragraph, before the comments do. Owning the rough edge is what makes the
claim credible; hiding it is what makes the video look dishonest when someone
freeze-frames the bad cut.

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

Its hook menu leads with the *correction* type, and the alternates are where an
explainer gets its reach: the same idea also has a *comparison*, a *number* and
a *second person* opening, and those are usually stronger scroll-stoppers than
the correction even though the correction is the better opening for the
argument.

An explainer opens by naming its subject directly, which the news script does
not. That is allowed here because it opens three minutes of one argument rather
than three seconds of a scroll-stopper.

---

## Rules

- Hooks are written to be **spoken**, because they get spoken verbatim. No "In
  this video." No "Ever wondered." No rhetorical-question openers. **What it is**
  is written to be read, not said — it is the only part of an entry that is.
- Never pad to hit the count. Three strong ideas beat three plus a filler. If a
  bucket only yields two, ship two and say why in a `> note:` line.
- Every factual claim carries a source link. Unverifiable claim = cut the idea.
- No emoji in briefs. No exclamation marks.
- **Write each prose paragraph on one line**, however long, with a blank line
  between paragraphs. The digest email turns every line into its own paragraph,
  so hard-wrapping **What it is** shatters it into fragments in Lana's inbox.
  This applies to prose only: the setup steps and the sources stay one bullet
  per line.
- Setup steps are numbered `1.` `2.` `3.`; every other list is `- `. The email
  and the app both key off that distinction to render them as ordered.
- An entry carries exactly the title, **Hooks**, **What it is**, **Sources**,
  **Tags**, the freshness line and the rate line — plus **How you set it up** for
  Bucket B. Anything else under an `## A`, `## B` or `## C` heading is a leftover
  note and gets cut. A script, once one is written, goes under **The script**
  below the sources; a scan never writes one.
- Hooks are `- {type} — {line}`, one per line, six to ten of them, no two types
  repeated. Hook one is the strongest, and it is the sentence a script written
  later has to open with verbatim. The type label comes from the list in
  **Hooks** and is written in lowercase.
- A `**Status**` line above `rate:` is written by the reader when a video is
  marked done. A scan never writes one, and never removes one it finds.
- Titles are four to six words, concrete nouns, no colons.
