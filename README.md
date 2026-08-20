# Basis Point

A reader for content ideas: a dated brief of short-form pitches, triaged into
shelves, with the approved scripts at the end of it.

> **The agent half was removed on 2026-08-20.** `agent/` — the taste rubric, the
> output format, the performance log, the channel notes — and the four
> `/basis-point-*` skills are gone, along with the My account, Friends and
> Guidelines tabs. Lana is rebuilding the rules and the way ideas get judged from
> scratch. Everything is in git history if a piece of it is wanted back.
>
> What is left is the reader, the briefs, and the scripts derived from them. No
> scan can run until a new one is written; `scripts/daily-scan.sh` exits early
> and says so, and the launchd job will do nothing until that guard is removed.

## How it works

```
briefs/YYYY-MM-DD.md  (source of truth)
        │
        ├─→ .json   (the reader reads this)
        ├─→ INDEX.md (one line per past idea)
        └─→ email   (Resend)

  reader:  unread ──keep──→ kept ──mark done──→ done
             │        └──── ask for a script in chat, once it is worth writing
             └────kill────→ deleted from the brief, logged to briefs/KILLED.md

  briefs/APPROVED.md ─→ --approved ─→ the reader's Approved scripts tab
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
because a brief that keeps only its winners is half a record. *Approved scripts*
is the end of the line: the scripts signed off and ready to record, set wide for
reading aloud, one button to copy the lot.

Five tabs, and that is all of them.

**Kill deletes.** The entry is removed from the brief markdown outright, with
one click of Undo while the tab is open. Its one-line record — with the reason,
if one was typed — goes to `briefs/KILLED.md` first, because the reasons are the
half of the record worth keeping.

`briefs/INDEX.md` is derived too — one line per past idea, newest first. It is
a de-duplication surface: reading it is far cheaper than reading the briefs, a
brief with scripts written into it running ~58KB.

**An entry is a pitch, not a script.** The hooks, then two or three sentences of
what the story is: enough to decide on, and no more. An entry is a title,
**Hooks**, **What it is**, **Sources** and **Tags** — the five to eight hashtags
for the upload box, written while the sources are still open; tutorials add the
numbered setup walkthrough, because standing the thing up is a separate job from
describing it.

**The script gets written after an idea is approved,** in conversation. Once the
words are signed off the script goes into `briefs/APPROVED.md` and shows up under
*Approved scripts*. Nothing edits one afterwards without being asked — a silent
improvement to a sentence already approved is the change that is never wanted.

**Hooks** is the opening line in several versions, each labelled with its type —
*flat first*, *number*, *sounds fake*, *reversal*, *correction* and so on. Hook
one is the strongest and the sentence a script written later opens with; the
others are drop-in swaps, so choosing between them is a reading decision rather
than a rewrite. In the reader each row copies itself.

Ideas are `A1..A3` news, `B1..B3` tutorials, `C1..C3` explainers. Long-form
(`D1`) was dropped on 2026-08-20; briefs before that date still carry one and
still load in the reader.

Briefs from before August 2026 are named `YYYY-MM-DD-am.md` / `-pm.md`, from
when the scan ran twice daily. Both name shapes load in the reader.

## Commands

| | |
|---|---|
| `npm run dev` | Reader at localhost:5173 — unread, kept, done, killed, approved scripts |
| `npm run build` | Static viewer into `dist/`, briefs baked in, triage disabled |
| `npm run preview` | Serve `dist/` exactly as a host would — check a deploy before pushing |
| `./scripts/daily-scan.sh` | Disabled — exits early until a new scan exists |
| `node scripts/send-digest.mjs briefs/X.md` | Re-send a brief by email |
| `node scripts/brief-to-json.mjs briefs/X.md` | Regenerate JSON after hand-editing |
| `node scripts/brief-to-json.mjs --index` | Rebuild `briefs/INDEX.md` from every brief's JSON |
| `node scripts/brief-to-json.mjs --approved` | Rebuild `briefs/approved.json` after editing `APPROVED.md` |

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

It ran on your Mac rather than in the cloud because the cloud sandbox's egress
proxy blocks direct fetches to most news and regulator domains, which broke the
rule that primary sources get opened before coverage is trusted. Worth keeping in
mind when the scan is rebuilt.

## Deploying the reader

**The deployed reader is a viewer, not the app.** `vite build` bakes the read
paths into static files — `dist/api/ideas.json`, `killed.json` and
`approved.json` — and the production bundle fetches those instead of the dev
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

Nothing tunes it right now — the rubric and the skills that maintained it were
deleted on 2026-08-20 and a new way of judging ideas has not been written yet.

Triage still works and still records: keep or kill in the reader and put the
reason in the box. Kills land in `briefs/KILLED.md`, keeps stay on the `rate:`
line in the brief. Those reasons are the raw material a new rubric gets built
from, so they are worth writing even with nothing reading them yet.

The old versions — `agent/taste.md`, `agent/format.md`, `agent/performance.md`,
`agent/friends.md` and the four skills — are recoverable from git if any of it
turns out to be worth starting from:

```
git log --oneline --diff-filter=D -- agent/
git show <commit>^:agent/taste.md
```

## Setup

`.env` (gitignored) holds:

```
RESEND_API_KEY=...
DIGEST_TO=...
DIGEST_FROM=onboarding@resend.dev
```

`DIGEST_FROM` can only be `onboarding@resend.dev` and `DIGEST_TO` only the
Resend account's own address until a domain is verified at resend.com/domains.
