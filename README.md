# Basis Point

A content-ideas agent. Twice a day it researches and writes nine social content
ideas — three news, three tutorials, three explainers — into a dated brief,
emails it, and learns from how the ideas get rated.

## How it works

```
agent/taste.md ──┐
agent/format.md ─┼─→ /basis-point-scan ─→ briefs/YYYY-MM-DD-{am|pm}.md  (source of truth)
last 6 briefs ───┘                          │
                                            ├─→ .json  (React UI reads this)
                                            └─→ email  (Resend)

briefs/*.md  ──rate ideas──→ /basis-point-learn ──→ rewrites LEARNED in taste.md
```

The markdown brief is the single source of truth. The JSON is derived from it,
and ratings made in the UI are written back into the markdown.

## Commands

| | |
|---|---|
| `/basis-point-scan` | Run a scan — research, write the brief, email it |
| `/basis-point-learn` | Fold accumulated ratings into `agent/taste.md` |
| `npm run dev` | Brief reader at localhost:5173 — read and rate |
| `node scripts/send-digest.mjs briefs/X.md` | Re-send a brief by email |
| `node scripts/brief-to-json.mjs briefs/X.md` | Regenerate JSON after hand-editing |

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
