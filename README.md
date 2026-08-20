# Basis Point

A content-ideas agent. Once a day it researches and pitches nine short-form
content ideas — three news, three tutorials, three explainers — into a dated
brief, emails it, and learns from how the ideas get rated.

## How it works

```
agent/taste.md ────┐
agent/format.md ───┼─→ /basis-point-scan ─→ briefs/YYYY-MM-DD.md  (source of truth)
briefs/INDEX.md ───┘         │                  │
  (de-dup)                   │                  ├─→ .json   (the reader reads this)
                             │                  ├─→ INDEX.md (de-dup surface)
                   pass two fans out to         └─→ email   (Resend)
                   one subagent per idea

  reader:  unread ──keep──→ kept ──mark done──→ done
             │        └──── ask for a script in chat, once it is worth writing
             └────kill────→ deleted from the brief, logged to briefs/KILLED.md

  agent/taste.md ──→ --guidelines ─→ the reader's Guidelines tab

briefs/*.md + KILLED.md ──→ /basis-point-learn ─────→ rewrites LEARNED in taste.md
agent/performance.md    ──→ /basis-point-performance ─→ rewrites What has actually worked
```

The markdown brief is the single source of truth. The JSON is derived from it,
and everything done in the reader — rating, killing, marking done — is written
back into the markdown.

**The reader is shelves, not a stack of briefs.** *Unread* is everything not yet
triaged. *Kept* is what is worth making, and a kept idea grows a **Research
more** row — a news search for its subject plus the sources it was built from.
*Done* is what has been posted. Each of those three splits by bucket, with the
date on the card. *Killed* is everything thrown out — the ideas the Kill button
deleted and the ones left in their briefs on a `-` line — shown with the reason,
because that is the half of the training signal that teaches most. *Guidelines*
renders `agent/taste.md` itself, so the bar the reader sees is the bar the scan
obeys. *My account* is the published log and the rules earned from it. *Friends*
is channels worth learning from and the specific device to take from each.

**Kill deletes.** The entry is removed from the brief markdown outright, with
one click of Undo while the tab is open. Its one-line record — with the reason,
if one was typed — goes to `briefs/KILLED.md` first, because the killed ideas
are the half of the training signal that teaches the most and a brief that keeps
only its winners teaches nothing.

`briefs/INDEX.md` is derived too — one line per past idea, newest first. It is
what a scan reads for de-duplication instead of the briefs themselves. A brief
with scripts written into it runs ~58KB, so reading the last six cost ~87k tokens
that then rode along in context for every turn of the run; the index is the same
information for about 2% of that.

The checking pass — verifying each chosen idea against its primary source — runs
as nine parallel subagents on Sonnet rather than inline. Their searches live and
die in their own contexts instead of accumulating in the main one, while the
selection, the hooks and the quality gate stay on the main model.

**An entry is a pitch, not a script.** The hooks, then two or three sentences of
what the story is: enough to decide on, and no more. An entry is a title,
**Hooks**, **What it is**, **Sources** and **Tags** — the five to eight hashtags
for the upload box, written while the sources are still open; tutorials add the
numbered setup walkthrough, because standing the thing up is a separate job from
describing it.

**The script gets written after an idea is approved,** in conversation, to the
standard in `agent/format.md`. Nine finished scripts per run meant most of a
run's cost went to ideas that were about to be killed.

**Hooks** is the opening line in six to ten versions, each a different type —
*flat first*, *number*, *sounds fake*, *reversal*, *artifact*, *correction* and
the rest, listed in `agent/format.md`. Hook one is the strongest, and it is the
sentence a script written later has to open with; the others are drop-in swaps,
so choosing between them is a reading decision rather than a rewrite. In the
reader each row copies itself.

Now that there is no script under it, the hook is what an idea is triaged on —
which makes two rules load-bearing: it has to carry a fact rather than a tease,
and it has to land on someone outside the beat. *"The cheap AI costs more at
busy times of day. Like electricity."* works on a person who has never heard of
DeepSeek.

Ideas are `A1..A3` news, `B1..B3` tutorials, `C1..C3` explainers. Long-form
(`D1`) was dropped on 2026-08-20; briefs before that date still carry one and
still load in the reader.

Briefs from before August 2026 are named `YYYY-MM-DD-am.md` / `-pm.md`, from
when the scan ran twice daily. Both name shapes load in the reader.

## Commands

| | |
|---|---|
| `/basis-point-scan` | Run a scan — research, write the brief, email it |
| `/basis-point-learn` | Fold accumulated ratings into `agent/taste.md` |
| `/basis-point-performance` | Log a published video's numbers and distil the lesson |
| `/basis-point-friends` | Analyse a creator's channel and write down what to steal |
| `npm run dev` | Reader at localhost:5173 — kept, unread, done, my account, friends |
| `npm run build` | Static viewer into `dist/`, briefs baked in, triage disabled |
| `npm run preview` | Serve `dist/` exactly as a host would — check a deploy before pushing |
| `./scripts/daily-scan.sh` | Run the scan headlessly, as the daily schedule does |
| `./scripts/daily-scan.sh --dry` | Same, but no email and no push |
| `./scripts/daily-scan.sh --force` | Run even if today's brief already exists |
| `node scripts/send-digest.mjs briefs/X.md` | Re-send a brief by email |
| `node scripts/brief-to-json.mjs briefs/X.md` | Regenerate JSON after hand-editing |
| `node scripts/brief-to-json.mjs --index` | Rebuild `briefs/INDEX.md` from every brief's JSON |
| `node scripts/brief-to-json.mjs --performance` | Rebuild `agent/performance.json` after editing the log |
| `node scripts/brief-to-json.mjs --friends` | Rebuild `agent/friends.json` after editing the channel notes |

The daily run is a launchd agent, `com.lanayepifanova.basis-point`, firing at
06:00 local. launchd uses wall-clock time, so that stays 06:00 across the DST
change. Logs, including cost per run, go to `~/Library/Logs/basis-point/` —
`YYYY-MM-DD.log` for readable progress and `.jsonl` for the raw event stream.

If `briefs/YYYY-MM-DD.md` already exists the script exits without running, so a
manual scan and the scheduled one on the same day cannot both spend a run.
`--force` overrides it.

Reload after editing the plist:

```
launchctl unload ~/Library/LaunchAgents/com.lanayepifanova.basis-point.plist
launchctl load   ~/Library/LaunchAgents/com.lanayepifanova.basis-point.plist
```

It runs on your Mac rather than in the cloud because the cloud sandbox's egress
proxy blocks direct fetches to most news and regulator domains, which breaks the
rule that primary sources get opened before coverage is trusted.

## Deploying the reader

**The deployed reader is a viewer, not the app.** `vite build` bakes the three
read paths into static files — `dist/api/ideas.json`, `performance.json` and
`friends.json` — and the production bundle fetches those instead of the dev
server. Nothing else is needed: point Vercel at the repo, take the Vite preset,
and every push the daily run makes redeploys it with the new brief.

What it cannot do is triage. Keep, kill, mark-done and the reason box are hidden
in a production build, because those endpoints write back into `briefs/*.md` and
the markdown is the source of truth — it lives on the machine the scan runs on,
next to the git history and the launchd agent, and a host with a read-only
filesystem has nothing to write to. Rating stays a `npm run dev` job.

The API is a Vite dev-server plugin in `vite.config.js`, not a set of serverless
functions, so `configureServer` runs on localhost only. If a deployed reader
ever shows an empty shelf, that is the reason: the static files did not get
emitted, or the bundle is asking for `/api/ideas` rather than `/api/ideas.json`.

## Tuning it

Two files control everything the agent does:

- **`agent/taste.md`** — what counts as a good idea. Edit it directly any time;
  it's read before every run. The `LEARNED` section at the bottom is maintained
  by `/basis-point-learn`, everything above it is yours.
- **`agent/format.md`** — how briefs are written. Change the template here and
  the next brief follows it.

To train it: keep or kill in the reader, add a short reason, then run
`/basis-point-learn`. Reasons matter far more than symbols. Be ruthless early —
a kill on a merely-okay idea teaches more than a keep on an obvious winner.

- **`agent/friends.md`** — channels worth learning from, and the mechanic to
  steal from each rather than a description of them. Run
  `/basis-point-friends` with a profile URL and it reads the reel grid, opens
  the outliers, scrapes the comments and writes the entry. The comments are how
  the mechanic is found: if the top comment is a guess the video was a quiz, if
  it is an attack the video was a claim, and if it is "🔥🔥" the video was
  inspiration and did nothing at all.
- **`agent/performance.md`** — what published videos actually did, and the read
  on why. This outranks the ratings: a keep is a prediction, a view count is a
  result. Add an entry when a video lands — including the flops, which are the
  only things that show which of the winners' traits actually mattered — or run
  `/basis-point-performance` with the numbers and let it write the entry, redo
  the patterns and sync the rubric. It currently holds the two outliers, the
  GPU-hours reel at 292k and the edited-by-Claude demo at 101k, distilled into
  the **What has actually worked** section of `agent/taste.md`, which is the one
  part of the rubric `/basis-point-learn` is forbidden to touch.

Two standing rules the rubric now enforces, both learned from those two videos:
every idea has to name the argument it starts, and **tutorials are Claude
only** — other companies' tools are sponsorship inventory, so they are never the
subject, the recommendation or the title, and software Claude operates appears
only as the surface it acts on.

## Setup

`.env` (gitignored) holds:

```
RESEND_API_KEY=...
DIGEST_TO=...
DIGEST_FROM=onboarding@resend.dev
```

`DIGEST_FROM` can only be `onboarding@resend.dev` and `DIGEST_TO` only the
Resend account's own address until a domain is verified at resend.com/domains.
