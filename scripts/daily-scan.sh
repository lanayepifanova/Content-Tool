#!/bin/bash
# Runs the Basis Point scan headlessly, for launchd to fire once a day.
#   ./scripts/daily-scan.sh          — normal run
#   ./scripts/daily-scan.sh --dry    — same, but skips the email and the push
#   ./scripts/daily-scan.sh --force  — run even if today's brief already exists
#
# launchd starts jobs with a near-empty environment, so everything this needs
# is resolved explicitly below rather than inherited from a login shell.

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$HOME/Library/Logs/basis-point"
LOG="$LOG_DIR/$(date +%Y-%m-%d).log"
mkdir -p "$LOG_DIR"

exec >>"$LOG" 2>&1
echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') — starting scan ==="

# nvm keeps node under a versioned path, so resolve it rather than hardcoding a
# version that breaks on the next upgrade.
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
fi
export PATH="$HOME/.local/bin:$HOME/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# Headless runs otherwise wait only 600s for background tasks and then kill
# them. Pass one dispatches five gather subagents and pass two ten mining ones;
# a single mining agent has taken over 400s on its own, so the ceiling fires
# mid-pass and the run returns "the agents are still out" with no brief written
# and exit 0. This is what silently lost the 2026-08-16 run.
export CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0

for bin in claude node git; do
  command -v "$bin" >/dev/null || { echo "FATAL: $bin not on PATH"; exit 1; }
done
echo "node $(node --version) · claude $(claude --version 2>&1 | head -1)"

cd "$REPO" || { echo "FATAL: cannot cd to $REPO"; exit 1; }

TODAY="$(date +%Y-%m-%d)"

DRY=""
FORCE=""
DRY_FLAG=""
for arg in "$@"; do
  [ "$arg" = "--force" ] && FORCE=1
  [ "$arg" = "--dry" ] && DRY_FLAG=1
done

# A scan costs roughly $20-50, so never spend one on a brief that already
# exists. This fires when a manual run and the scheduled run land on the same
# day, which has happened and cost a full duplicate run.
if [ -z "$FORCE" ] && [ -e "$REPO/briefs/$TODAY.md" ]; then
  echo "briefs/$TODAY.md already exists — skipping. Re-run with --force to override."
  echo "=== $(date '+%H:%M:%S') — finished, exit 0 (skipped) ==="
  exit 0
fi

[ -n "$DRY_FLAG" ] && DRY="
This is a DRY RUN: write the brief and the JSON, but do NOT send the email and
do NOT commit or push. Say clearly at the end that it was a dry run."

PROMPT="Run today's Basis Point content scan.

Follow the repo skill \`basis-point-scan\` exactly, start to finish. Read
\`agent/taste.md\` (binding, including its LEARNED section), \`agent/format.md\`,
and the six most recent dates in \`briefs/INDEX.md\` for de-duplication before
researching. Do not read whole past briefs — the index is the de-duplication
surface, and a brief is ~58KB of scripts that then ride along in context for
the rest of the run.

Produce ten ideas: three news (A1-A3), three tutorials (B1-B3), three explainers
(C1-C3), and one long-form YouTube idea (D1, roughly 10 minutes). D1 is its own
hunt on a subject the nine shorts do not cover and must pass the substance test
in the rubric; if nothing clears that bar, ship nine plus a \`> note:\` under a
\`## D1\` heading explaining why. Never pad to hit a count.

Open primary sources before trusting coverage. Every factual claim needs a
source link; cut anything you cannot verify.

The nine short-form ideas ship as finished scripts: 400-600 words of spoken
prose each, four to six paragraphs, written so Lana can record them off the
screen without writing a word or looking anything up. An entry is the title,
\`The script\` and \`Sources\` — tutorials also keep the numbered setup
walkthrough. No hook field, no \`What this is\`, no \`The material\` and no beat
sheet on a short. D1 keeps its old shape, material included.

Do both research passes. Pass two — mining each chosen idea for its facts — is
the point of the run, not an optional extra. Target 10-16 facts per short and
20-30 for the long-form, every one carrying a hard number, date, name or exact
quote, including the counter-argument. For the nine shorts that list is your
working input and does not ship: you write the script from it, and the
counter-argument becomes a paragraph said out loud. Never invent a fact to fill
the list.

Write the nine scripts yourself. Do not delegate them to subagents — the voice
has to be one voice across the brief.

Run BOTH passes as parallel subagents, with \`subagent_type: \"general-purpose\"\`
and \`model: \"sonnet\"\`, exactly as the skill describes.

Pass one: five gather subagents in a single message — three for news (markets,
hardware, startups and product), one for tutorials, one for explainers — each
returning only a short candidate list, never raw search results. Pass two: one
mining subagent per chosen idea, all in a single message, each returning only
its finished bullets.

Do not run searches yourself in either pass; search results that land in your
context are re-sent on every later turn. The judgment stays with you: you pick
from the shortlists, you apply the quality gates, you write the scripts.

The three news ideas must come from three different beats — one markets, one
hardware, one startups and product. Three market-structure stories in one brief
is the failure mode: the trading and exchange material is good, but it cannot
be the whole bucket.

Write \`briefs/$TODAY.md\`, generate the JSON with
\`node scripts/brief-to-json.mjs\`, email it with \`node scripts/send-digest.mjs\`,
then commit and push the brief. If the email fails, still commit and push, and
report the failure. Finish with a four-line report.$DRY"

# Stream the run so the log shows progress instead of going silent for 20
# minutes. The raw stream is teed to a .jsonl first, so a hiccup in the
# readable filter below can never cost us the run's output.
RAW="$LOG_DIR/$TODAY.jsonl"

# A scan runs for tens of minutes with long quiet stretches while subagents
# work, so the Mac idle-sleeps underneath it and the API call dies with
# "your computer went to sleep mid-response." caffeinate -is holds sleep off
# for exactly as long as the run takes. The display is left alone.
CAFFEINATE=""
command -v caffeinate >/dev/null && CAFFEINATE="caffeinate -is"

set -o pipefail
$CAFFEINATE claude -p "$PROMPT" \
  --model opus \
  --permission-mode acceptEdits \
  --output-format stream-json \
  --verbose \
  --allowedTools \
    "Read Write Edit Glob Grep WebSearch WebFetch Skill TodoWrite Agent Task" \
    "Bash(node:*)" "Bash(git:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" \
    "Bash(tail:*)" "Bash(grep:*)" "Bash(date:*)" "Bash(wc:*)" "Bash(mkdir:*)" \
  | tee "$RAW" \
  | node -e '
      // Turn the event stream into readable progress lines. Anything
      // unexpected is ignored rather than thrown — the raw .jsonl has it all.
      let buf = "";
      process.stdin.on("data", (c) => {
        buf += c;
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          let e; try { e = JSON.parse(line); } catch { continue; }
          const stamp = () => new Date().toTimeString().slice(0, 8);
          try {
            for (const b of e?.message?.content ?? []) {
              if (b.type === "tool_use") {
                const q = b.input?.query || b.input?.url || b.input?.file_path ||
                          b.input?.command || b.input?.skill || "";
                console.log(`[${stamp()}] ${b.name}: ${String(q).slice(0, 110)}`);
              } else if (b.type === "text" && b.text.trim()) {
                console.log(`[${stamp()}] ${b.text.trim().slice(0, 400)}`);
              }
            }
            if (e.type === "result") {
              const cost = e.total_cost_usd != null ? ` · $${e.total_cost_usd.toFixed(2)}` : "";
              const mins = e.duration_ms != null ? ` · ${Math.round(e.duration_ms / 60000)}m` : "";
              console.log(`\n--- result (${e.subtype})${mins}${cost} ---\n${e.result ?? ""}`);
            }
          } catch {}
        }
      });
    '

STATUS=${PIPESTATUS[0]}

# claude can exit 0 having written nothing — a killed background task or an
# interrupted response both end that way, and a silent exit 0 reads as a
# successful run in launchd and in the log. The brief file is the only honest
# success signal, so check for it.
if [ ! -e "$REPO/briefs/$TODAY.md" ]; then
  echo "FATAL: run ended with exit $STATUS but briefs/$TODAY.md was never written."
  echo "Check $LOG_DIR/$TODAY.jsonl for where it stopped, then re-run."
  [ "$STATUS" -eq 0 ] && STATUS=1
fi

echo "=== $(date '+%H:%M:%S') — finished, exit $STATUS ==="
exit $STATUS
