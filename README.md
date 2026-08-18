# Basis Point

A content-ideas agent. Once a day it researches and writes ten content ideas —
three news, three tutorials, three explainers, and one long-form YouTube idea —
into a dated brief, emails it, and learns from how the ideas get rated.

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
             └────kill────→ deleted from the brief, logged to briefs/KILLED.md

briefs/*.md + KILLED.md ──→ /basis-point-learn ─────→ rewrites LEARNED in taste.md
agent/performance.md    ──→ /basis-point-performance ─→ rewrites What has actually worked
```

The markdown brief is the single source of truth. The JSON is derived from it,
and everything done in the reader — rating, killing, marking done — is written
back into the markdown.

**The reader is shelves, not a stack of briefs.** *Unread* is everything not yet
triaged. *Kept* is what is worth making, and a kept idea grows a **Research
more** row — a news search for its subject plus the sources it was built from.
*Done* is what has been posted. Each of those three splits into news, tutorials,
explainers and long-form, with the date on the card. *My account* is the
published log and the rules earned from it. *Friends* is channels worth
learning from and the specific device to take from each. An idea shows its
one-line summary and one paragraph; the script, hooks, material and tags sit
behind **Open it**, because a brief is triaged far more often than it is read.

**Kill deletes.** The entry is removed from the brief markdown outright, with
one click of Undo while the tab is open. Its one-line record — with the reason,
if one was typed — goes to `briefs/KILLED.md` first, because the killed ideas
are the half of the training signal that teaches the most and a brief that keeps
only its winners teaches nothing.

`briefs/INDEX.md` is derived too — one line per past idea, newest first. It is
what a scan reads for de-duplication instead of the briefs themselves. A brief
is ~58KB once its scripts are in, so reading the last six cost ~87k tokens that
then rode along in context for every turn of the run; the index is the same
information for about 2% of that.

The mining pass — gathering the verified facts behind each chosen idea — runs as
ten parallel subagents on Sonnet rather than inline. Their searches live and die
in their own contexts instead of accumulating in the main one, and the selection,
the quality gate and the writing stay on the main model. This is the difference
between a run costing ~$48 and ~$20.

**The nine short-form ideas ship as finished scripts.** Each is 600-1000 words of
spoken prose — five to seven paragraphs, four to six minutes read aloud — that
can be recorded off the screen without writing a word or looking anything up. An
entry is a title, **Hooks**, **The script**, **Sources** and **Tags** — the five
to eight hashtags for the upload box, written while the sources are still open;
tutorials add the numbered setup walkthrough, because standing the thing up is a
separate job from narrating it.

**Hooks** is the opening line in six to ten versions, each a different type —
*flat first*, *number*, *sounds fake*, *reversal*, *artifact*, *correction* and
the rest, listed in `agent/format.md`. The first is the sentence the script
actually opens with and the others are drop-in swaps, so choosing between them
is a reading decision rather than a rewrite. They are written after the script,
from the full mined fact list, which is the only way the *number* and *quote*
versions have anything to be made of. In the reader each row copies itself. The facts the subagents mine feed the script instead of
shipping beside it as a bullet list.

Bucket D is the exception. Ten minutes is a pitch to be approved rather than a
script to be read, so it keeps its thesis, chapters and **The material** — the
raw 20-30 bullets, counter-argument included — and gets written once the idea
clears.

Ideas are `A1..A3` news, `B1..B3` tutorials, `C1..C3` explainers, `D1` long-form.
Bucket D is the ~10-minute YouTube idea: it is researched as its own hunt on a
subject the nine shorts don't cover, and has to pass a substance test — three
acts, new material in the back half, and something specific to put on screen —
before it ships. If nothing clears that bar the brief runs nine plus a note,
which is a real result rather than a failed run.

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
