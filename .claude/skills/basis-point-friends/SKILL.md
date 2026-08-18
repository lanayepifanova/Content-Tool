---
name: basis-point-friends
description: Analyse a creator Lana likes and write down the specific device worth stealing. Use when she shares a profile URL, asks what she can learn from a channel, or asks to refresh the Friends tab.
---

# Basis Point Friends

Work out what a channel is actually doing to its viewer, and write down the part
that transfers. Work in the repository root.

The output is **not** a description of the channel. It is a mechanic: the thing
the video does that makes a person comment, share or watch to the end, stated
so it could be applied to a completely different subject tomorrow.

## 1. Gather

Use the browser. For each profile:

1. **The reel grid.** Open `instagram.com/{handle}/reels/` and read the view
   counts off the tiles — the DOM often needs a few scroll passes before the
   links resolve, so scroll, then query `a[href*="/reel/"]`. Record the median
   and the outliers separately. The median is what the channel reliably does;
   the outliers are what it is being rewarded for.
2. **The outliers, opened individually.** Go to `instagram.com/p/{id}/` rather
   than the reel URL — the permalink layout renders the caption and the comment
   thread inline, where the `/reels/` feed does not. Read the caption in full
   and scrape the comments with their like counts.
3. **The bio and highlights.** Named story highlights are usually a statement of
   the channel's content pillars, and the bio says whether the account is
   optimising for reach or for a funnel.
4. **The video itself, frame by frame.** This is the part worth the effort, and
   it works: the `<video>` element on a permalink page is seekable from the
   console, and the page screenshot captures whatever frame it is parked on.
   Define a helper that seeks to a list of timestamps, draws each frame into a
   grid on a `<canvas>` fixed over the page, and label each cell with its
   timestamp — then take one screenshot of the canvas and read the whole
   structure at once. The canvas may be tainted by the blob source, which does
   not matter: nothing reads the pixels back in JavaScript, the screenshot does.

   Sample roughly `[0.5, 2, 4, 7]` seconds for the hook and four more spread
   across the runtime for the structure. Burned-in captions are readable at a
   210x373 cell, which means **the spoken script can be recovered from the
   captions** — that is the highest-value thing on the page and the reason to do
   this rather than reading the caption and guessing. Resize the window taller
   first so a full grid fits in one capture.

Watch for the follower-to-view ratio. Views far under the follower count means
the format is serving something other than the algorithm — usually a product —
and the content should be read as qualification rather than reach.

## 2. Find the mechanic

The question is always: **what does this video make the viewer do?** The answers
that have shown up so far, as a starting vocabulary rather than a checklist:

- It asks a question the viewer can answer from their own experience, in public.
- It makes a claim the viewer can verify by looking at the video itself.
- It names somebody to be angry at who is not the creator.
- It gives the viewer something to send to one specific person.
- It leaves an argument unfinished.

Read the comments to find it, not the video. The comments are the record of what
the video actually did — if the top comment is a guess, the video was a quiz; if
it is an attack, the video was a claim; if it is "🔥🔥", the video was
inspiration and did nothing at all. Quote the comments with their like counts,
because which comment out-performed which is most of the finding.

**A big channel with an inert comment section is a finding, not a failure to
analyse.** Write it down. Knowing that a million views of motivational content
produces no argument is directly useful to someone whose two best videos were
arguments.

## 3. Write the entry

Append to `agent/friends.md`: `## @handle`, then **Profile**, **Reach**, **The
model**, **Steal this** (bullets), **Don't copy**, an optional **Note**, and
**Link**.

Then, under it, one `### ` block per video studied — this is the part she reads.
Fields: **Numbers** (likes · comments · shares · duration · date), **On-screen
hook** (the text actually burned into the first seconds, quoted), **Spoken
open** (the first four to six caption lines with their timestamps), **Caption**,
**What it actually is** (the physical format — where it was shot, what the
graphics are made of, what is on screen versus said), **Beats** (bullets, each
`0:00-0:12 — what happens`), and **Steal** (one paragraph: the single
transferable thing).

**What it actually is** is the field that most often gets written lazily. It
should be concrete enough to reproduce the look: "one continuous take in a
public workspace, lav mic, a real whiteboard on castors that he draws on live"
rather than "a talking-head explainer."

Mark any caption line too small to read cleanly rather than guessing at it.

Two fields carry the value. **Steal this** must be specific enough to act on in
a script tomorrow — "the guess-which-one-is-real structure" rather than "good
hooks." **Don't copy** matters as much: most channels have a register, a
monetisation pattern or an engagement-bait habit that would be actively wrong
for a channel built on being correct and sourced.

Then update the **Devices worth stealing** block at the top, which is the
cross-channel synthesis, ranked by how well each device transfers to what Lana
already makes. A device only one channel uses is a hypothesis; one that shows up
independently on two channels with different subjects is a real mechanic.

Run `node scripts/brief-to-json.mjs --friends` so the Friends tab picks it up.

## 4. Be honest about thin evidence

If a grid did not load, if the captions were not read, if the numbers are one
row rather than a distribution — say so in a **Note** field on the entry and in
the report. An inferred model presented as an observed one is worse than no
entry, because it gets acted on with false confidence.

## 5. Report

Three lines: the one device most worth trying next, which channel it came from
with the number behind it, and what would have to be true for it to work on a
finance-and-tech channel rather than the channel it was found on.
