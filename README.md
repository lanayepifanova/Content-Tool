# Basis Point

A content-ideas agent. Once a day it researches and writes ten content ideas —
three news, three tutorials, three explainers, and one long-form YouTube idea —
into a dated brief, emails it, and learns from how the ideas get rated.

## How it works

```
agent/taste.md ────┐
agent/format.md ───┼─→ /basis-point-scan ─→ briefs/YYYY-MM-DD.md  (source of truth)
briefs/INDEX.md ───┘         │                  │
  (de-dup)                   │                  ├─→ .json   (React UI reads this)
                             │                  ├─→ INDEX.md (de-dup surface)
                   pass two fans out to         └─→ email   (Resend)
                   one subagent per idea

briefs/*.md  ──rate ideas──→ /basis-point-learn ──→ rewrites LEARNED in taste.md
```

The markdown brief is the single source of truth. The JSON is derived from it,
and ratings made in the UI are written back into the markdown.

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

**The nine short-form ideas ship as finished scripts.** Each is 400-600 words of
spoken prose — four to six paragraphs, three to four minutes read aloud — that
can be recorded off the screen without writing a word or looking anything up. An
entry is a title, **The script** and **Sources**; tutorials add the numbered
setup walkthrough, because standing the thing up is a separate job from
narrating it. The facts the subagents mine feed the script instead of shipping
beside it as a bullet list.

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
| `npm run dev` | Brief reader at localhost:5173 — read and rate |
| `./scripts/daily-scan.sh` | Run the scan headlessly, as the daily schedule does |
| `./scripts/daily-scan.sh --dry` | Same, but no email and no push |
| `./scripts/daily-scan.sh --force` | Run even if today's brief already exists |
| `node scripts/send-digest.mjs briefs/X.md` | Re-send a brief by email |
| `node scripts/brief-to-json.mjs briefs/X.md` | Regenerate JSON after hand-editing |
| `node scripts/brief-to-json.mjs --index` | Rebuild `briefs/INDEX.md` from every brief's JSON |

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

To train it: rate ideas in the UI or by editing the `rate:` lines in a brief
(`+` keep, `-` kill), add a short reason, then run `/basis-point-learn`. Reasons
matter far more than symbols. Rate ruthlessly early — a `-` on a merely-okay
idea teaches more than a `+` on an obvious winner.

## Setup

`.env` (gitignored) holds:

```
RESEND_API_KEY=...
DIGEST_TO=...
DIGEST_FROM=onboarding@resend.dev
```

`DIGEST_FROM` can only be `onboarding@resend.dev` and `DIGEST_TO` only the
Resend account's own address until a domain is verified at resend.com/domains.
