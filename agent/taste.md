# Basis Point — Taste Rubric

This file is the agent's judgment. It is read before every run and rewritten as
Lana's ratings accumulate. Edit it freely — it is the steering wheel.

Voice target: smart friend who reads the primary source, not a news anchor.
Audience: curious people who work adjacent to tech/finance but aren't insiders.

---

## What has actually worked

Two published reels are far ahead of everything else, and they are the same
video twice with different subject matter. Both are the target.

**"Wall Street is now going to let you trade GPU hours" — 292k views, 7,427
likes, 220 comments, 187 shares.** The top comment is three words — "Peak
recession indicator," 2,385 likes and 32 replies — and it is not about GPUs.
Under it: "lol we really are cooked" (1,515), "Big Short 2," "the
financialization of everything." Running alongside it is a genuinely technical
argument about whether an infinitely reproducible commodity can support a
futures market, what settles at expiry, and why $2/hour on a neocloud is not
$7/hour on a hyperscaler. Two audiences, one story.

**"I didn't edit this. Claude did." — 101k views, 2,146 likes, 87 comments, 31
shares.** The artifact is the proof: the claim is the thing on screen, so every
viewer is qualified to judge it. The split was not even — the criticism won.
"AI SLOP. Be creative" took 398 likes and "we can tell" took 317, while no
supportive comment cleared 15. The detractors distributed it.

What the two have in common is what the rubric below is now tuned to find:

- **The video hands over a frame, not a fact.** A viewer who watches to the end
  has a sentence they already wanted to say and now has a reason to type.
  Informative-and-agreed-with is the failure mode — "huh, interesting" is a
  scroll; "peak recession indicator" is 2,385 likes.
- **Two audiences beat one.** The GPU reel gave the doom crowd a slogan and the
  technical crowd a real question, and the technical thread is where the replies
  were. A story only the first group can react to gets likes and no argument.
- **The disagreement is real and load-bearing**, not manufactured. Both stories
  are true, sourced, and the fight is about the substance — what GPU futures
  imply, whether AI editing is good enough yet. None of this licenses ragebait,
  a stretched claim or an inflated number. A polarizing video built on a wrong
  fact is the one failure worse than a boring one, because the comments that
  catch it are the same comments that would have carried it.
- **It sounds like the end of something, or the start of something.** Both
  stories support the "we are cooked" reading and the "this is amazing" reading
  at once. A story only one of those readings fits is weaker than one both fit.
- **Nobody needs credentials to have an opinion.** Trading compute and a badly
  cut video are both things a general audience feels licensed to judge on
  sight. A story only insiders can react to earns respect and no comments.
- **Hostile comments are the engine, not the damage.** On the tool demo the two
  best-liked comments were both attacks, by more than 20× the best-liked
  defence. Pre-conceding the flaw in the caption did not soften it and did not
  need to.
- **News is shared, demos are argued with.** 187 shares against 31 on posts
  under 3× apart in views. Pick the format knowing which mechanic is being
  bought.
- **Both are remembered as one sentence.** Neither is remembered as a subject —
  they are remembered as "Wall Street is now going to let you trade GPU hours"
  and "this video was edited 100% by Claude." That is why every idea now ships
  a menu of six to ten hooks instead of one opening line: the first sentence is
  the product, and the run does not get to guess at it once. See **Hooks** in
  `agent/format.md`.

### What people are already angry about

The GPU-futures comments were not angry at CME Group. They were angry at
something they already resented, and the story gave them an occasion to say so.
That is the thing to hunt: **a live grievance in search of a news peg.** The
recurring ones, in rough order of how reliably they fire:

- **Data centers.** Power draw, water use, land, noise, who pays for the grid
  upgrade, what a town got in exchange for the tax break. The most reliable
  anger target available, because the cost is local and physical and the benefit
  is somewhere else.
- **AI capability and what it replaces.** Whose job, whose craft, whether the
  output is any good. The tool demo lived here — "editing is a skill we all can
  learn" is the same argument as "who asked for this."
- **Tech development as such.** Something being built that nobody voted for,
  shipped faster than it can be understood, or optimised for a metric the reader
  does not share.
- **Companies behaving as companies.** A firm doing the legal, rational,
  entirely predictable thing that is also obviously against the interest of the
  people it happens to. Naming the company matters — an abstract industry gets
  no anger.
- **Financial products that sound stupid.** A new index, future, ETF or
  securitization on something that was not an asset. "An infinite supply
  commodity, what a great thing to trade" is the shape: the reader's instinct is
  that this is dumb, and the video's job is to show them the mechanism that
  makes it not dumb, or to agree that it is.

Two rules on using this. **The anger must already exist** — the story is the
occasion, not the cause, and a story that needs a nudge to be infuriating is a
story being framed dishonestly. And **the mechanism still has to be the
payload**: the reason "Peak recession indicator" worked is that the video under
it was correct, specific and explained how the contract settles. Anger with no
mechanism underneath it is a rage post, gets a worse audience, and is the one
thing in this file that would be genuinely bad to build a channel on.

This section is evidence from published performance, not a rating pattern — it
does not get rewritten by `/basis-point-learn`. Update it by hand when new view
counts say something the points above do not.

---

## Universal filters (apply to all four buckets)

An idea must survive all six to make the brief:

1. **The "wait, what?" test.** Does the one-line version make someone stop
   scrolling? If the opening line needs setup to land, it's weak.
2. **Explainable without a whiteboard** or prior context. The shorts run four
   to six minutes now, but that is room to make one point properly, not room
   for a second point: if the idea needs notation on screen or a second concept
   taught first, it fails. For Bucket D this applies to the premise only — the
   hook has to land in a sentence even though the argument takes ten minutes.
3. **Specific over thematic.** A named company doing a named thing beats a trend.
4. **Not already saturated.** If three large accounts covered it yesterday, skip
   it — unless there's a genuinely unused angle.
5. **True and checkable.** Every claim traces to a primary source. No idea ships
   on the strength of one hype thread.
6. **The comment test.** Name, in one sentence, the argument this starts — the
   thing two viewers would disagree about underneath it. If the honest answer
   is "people would find it interesting," it is a scroll. This is the tie-break
   filter: between a solid idea nobody argues with and a slightly smaller idea
   people fight over, ship the fight. It applies to all four buckets, and it
   never overrides filter 5 — the argument has to be about something true.

Filter 4 also applies across buckets: the long-form idea must not be one of the
day's nine shorts wearing a longer runtime.

Auto-reject: generic macro commentary ("rates are shifting risk appetite"),
funding-round announcements with no product story, model-launch benchmark
horse-race posts, anything whose only hook is a big number.

---

## Bucket A — News (tech · startups · markets · finance)

Covering: tech, startups, semiconductors, markets and finance. Looking for the
recent, real, slightly absurd thing that reveals how a system actually works.

**Gold standard:** Kalshi + SIG + Citadel writing a hedging contract on goats.
Why it works — it's genuinely novel (first of its kind), the names are
recognizable, it sounds made up but is completely real, and underneath the
absurdity is a legible lesson about how derivatives and risk transfer work. The
joke gets attention; the mechanism is the payload.

**Strong signals:** market structure doing something new · a mechanism that
sounds fake · regulatory or exchange first-of-its-kind · a company quietly
solving something in a strange way · numbers that imply a story · prediction
markets, exotic derivatives, weird liquidity plumbing · a new index, future,
ETF or securitization on something a reader's instinct says should not be
tradable · a data-center or power story with a named town, a real number and
somebody bearing the cost · a named company doing the rational thing that is
obviously against somebody's interest · a first that reads as a
late-cycle symptom — the thing being made tradable, financialized, insured or
securitized that nobody thought of as an asset a year ago · a real-economy
consequence a non-insider is already angry about.

**Weak signals:** stock moved X% · CEO said a thing · funding round with no
product angle · "AI is transforming Y" · earnings recaps · an institution
following its own procedure to a foreseeable outcome, where the only news is
that a scheduled step happened on schedule.

**Coverage mix.** The three news ideas should not all be market plumbing. Aim
for roughly one market-structure or finance story and two drawn from the wider
tech beat — startups doing a specific thing, semiconductors and the hardware
supply chain, chip export policy, foundries and packaging, devices, platform
and infrastructure shifts. The rubric above still applies unchanged: a startup
story needs a product mechanic and not a funding number, and a chip story needs
a specific development rather than a market-size projection. This is about where
to hunt, not a lowering of the bar — three market-plumbing stories still beat
two plus a filler.

**The polarization axis.** This is now the second axis the three are picked on,
and it runs across the coverage mix rather than replacing it. Every Bucket A
idea has to answer filter 6 — name the argument it starts — and **at least one
of the three each day is the strong-form version**: a story where a general
audience is going to fight about what it means, not just find it clever. The
GPU-hours reel is the template. Absurd-with-a-lesson still qualifies on its
own; absurd-with-a-lesson *plus* a fight is what the day should lead with.

If a beat comes back with nothing anyone would argue about, that is a real
finding — say so and take a second idea from a beat that did, rather than
filling the slot with a competent story nobody comments under.

The line: the controversy has to be inside the facts. Do not reach for the
outraged framing, do not stretch a number to make it louder, and do not pick
the culture-war version of a tech story. The 292k reel needed no exaggeration —
the fact that it was real was the whole reason it travelled.

Recency: default 72 hours. Up to 7 days if genuinely under-covered.

---

## Bucket B — Tutorials (things Claude does)

Looking for: something Lana could actually build and film with Claude, where the
payoff is visible on screen and there is a reason to argue about it.

**Claude only.** Every tutorial idea is a Claude capability. No other AI tool,
model, agent framework, wrapper, or MCP server built by someone else goes in the
brief, however good it is — coverage of another company's product is inventory
she sells, and giving it away free costs a sponsorship. This is a hard filter
applied before any of the rubric below: an idea that is really a demo of another
tool is rejected even when Claude is somewhere in the pipeline.

The line is *whose capability is being shown*. Software Claude operates is
allowed on screen because it has to be — her editor, her browser, her terminal,
her repo, the file formats involved. What is not allowed is a third-party tool
being the thing that impresses, the thing named in the title, or the thing a
viewer is sent off to install. If the video would still work with that tool
swapped out, it was a surface. If it wouldn't, it is a competitor's demo.

**Named interests:** Claude Code and what it can be pointed at · automating
video editing by driving Premiere Pro from Claude · Claude in Chrome doing
things in a live browser · agents and subagent orchestration · skills, hooks and
scheduled runs · Claude writing and then running its own code · artifacts ·
long-context and multi-file work · anything where Claude does a job that is
visibly a person's job.

**Two hard requirements, on top of Claude-only.** Both, every time, or the idea
does not ship.

1. **Highly visual.** The result has to be legible on a phone screen in the
   first seconds, without narration explaining what is impressive about it. A
   video, a design, a page, a UI, a document, a finished edit — something with a
   before and an after that a viewer sees rather than infers. If proving it
   worked requires reading terminal output, it is not this bucket.
2. **Something to argue about.** Name the fight the way filter 6 asks: is this
   good enough, should it be doing this at all, is this the end of somebody's
   job, did it actually work or is it a demo trick. A tutorial where the only
   possible reaction is "neat" performs like a tutorial where the only possible
   reaction is "neat." The 101k reel was people fighting about whether the edit
   looked bad — the disagreement was the distribution.

Claude doing a job that is visibly somebody's profession is the reliable source
of both at once: the output is judgeable on sight, and the question of whether
it should be doing that job answers itself in the comments.

**The artifact is the proof.** The strongest version of this bucket, and the
one that put a tool demo at 101k views: the tool's output *is the video being
watched*. Claude edited this reel, the model wrote this page, the agent made
this graphic — claimed in the first two sentences, with the unretouched result
on screen while the claim is made. It works because it collapses the demo and
the evidence into one thing, and because a general audience is instantly
qualified to judge it. Half of them said it looked bad. That was the point:
they had to watch it to say so. When an idea can be built this way, build it
this way, and prefer it over a screen recording of the same tool.

**Strong signals:** the result is visually obvious in a screen recording · the
tool's output can be the video itself · the output is something a viewer feels
entitled to rate — an edit, a design, a piece of writing, a UI — rather than a
correct-looking terminal response · buildable in under an hour · solves a chore
the audience recognizes · the tool is new enough that nobody's covered it well ·
there's a real "before/after."

**Weak signals:** it is really another company's tool with Claude bolted on ·
the payoff is invisible (backend-only) · the visible proof is a wall of terminal
output · the demo only becomes impressive if you already know how hard the task
was · nobody could disagree with it · already has a great official tutorial.

Every Bucket B idea ships as a script that covers what gets built, why this
approach beats the obvious alternative, the on-screen "it worked" moment, and
two or three other real jobs the same setup does — alongside the numbered setup
walkthrough, the one field that still sits outside the script. The walkthrough
is not optional and not a summary — a tutorial idea that doesn't say how to
actually stand the thing up is a tool announcement wearing a tutorial's clothes.

---

## Bucket C — Explainers (technical → non-technical)

Looking for: a concept where the honest explanation is more interesting than
the pop-science version.

Domains: mathematics · physics · machine learning · reinforcement learning ·
LLMs · computer science · statistics.

**Strong signals:** it arms someone for an argument they are already having —
the data-center power draw, what the model is actually doing, why the number in
the headline is or isn't real · there's a crisp physical or everyday analogy
that doesn't lie · the common intuition is actually wrong and correcting it is
satisfying, and it is an intuition people will defend rather than one they'd
drop on being told ·
it explains something the audience has personally experienced · it connects to
something in the news this week.

**Weak signals:** requires notation on screen · the analogy breaks under any
scrutiny · it's the same explanation everyone gives (no new framing) ·
"here's what a neural network is" with no specific angle.

Each Bucket C idea must have a **misconception being corrected** and a **single
analogy** carrying the explanation — not as named fields any more, but as the
first and second paragraphs of the script. If neither is crisp enough to write
that way, cut the idea.

---

## Bucket D — Long-form (YouTube, ~10 minutes)

One per brief. This is not a short with more words in it — the short-form
filters above still apply to the opening, but a ten-minute video lives or dies
on whether the argument *develops*. A topic that is fully understood by minute
two is a short, and should be filed as one.

**Looking for:** a story or concept with at least three distinct acts, where
each act changes how the viewer reads the previous one. The best version has a
turn in the middle — the tidy explanation the audience arrived with is shown to
be incomplete, and the second half is more interesting because of it.

**The substance test.** Before an idea qualifies, answer all four concretely:

1. What does the viewer believe at minute two that is wrong by minute eight?
2. What arrives in the back half that isn't available in the first? New actor,
   new document, a number that reframes it, a consequence nobody covered.
3. What goes on screen? Ten minutes of talking head over stock footage is a
   podcast. Name the filings, charts, screen recordings, or archival material.
4. Could someone honestly cover this in ninety seconds? If yes, it is a short.

If any answer is thin, it does not ship. Under-delivering is still correct —
a brief with nine shorts and a note explaining why nothing had ten minutes in
it beats a padded long-form idea.

**Strong signals:** a mechanism with a hidden second layer · a story with
documents to read on screen · a concept where the standard explanation is
subtly wrong and correcting it takes real time · something with a history
(this happened before, here is how it went) · a system whose incentives only
become visible once you follow the money two steps out.

**Weak signals:** a list ("seven tools that...") · a recap of a week's news ·
a topic where the whole payload is in the title · a tutorial that is really
twelve minutes of installation · anything requiring access, footage, or data
Lana does not have and cannot get.

**Source bar is higher.** Four sources minimum, weighted toward primary. A
ten-minute video makes ten minutes of claims, and one wrong load-bearing fact
takes the whole thing down.

Recency: long-form is allowed to be evergreen. A story from two months ago is
fine if it is under-covered and has depth. Prefer a live news peg when one
exists, but never force one.

---

## Learned preferences

Appended automatically as ratings accumulate. Empty until the feedback loop
has data — see `agent/ratings.md`.

<!-- LEARNED:START -->
_(nothing learned yet — rate a few briefs and this section fills in)_
<!-- LEARNED:END -->
