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
surface, and a brief is ~58KB of material that then rides along in context for
the rest of the run.

Produce ten ideas: three news (A1-A3), three tutorials (B1-B3), three explainers
(C1-C3), and one long-form YouTube idea (D1, roughly 10 minutes). D1 is its own
hunt on a subject the nine shorts do not cover and must pass the substance test
in the rubric; if nothing clears that bar, ship nine plus a \`> note:\` under a
\`## D1\` heading explaining why. Never pad to hit a count.

Open primary sources before trusting coverage. Every factual claim needs a
source link; cut anything you cannot verify.

Do both research passes. Pass two — mining each chosen idea for \`The material\`,
the raw fact list — is the point of the run, not an optional extra. Target 10-16
bullets per short and 20-30 for the long-form, every one carrying a hard number,
date, name or exact quote, including the counter-argument. Never invent a fact
to fill the list.

Run pass two as parallel subagents, one per idea, all dispatched in a single
message, with \`subagent_type: \"general-purpose\"\` and \`model: \"sonnet\"\`, exactly
as the skill describes. Each subagent gets the idea and the mining rules inline
and returns only its finished bullets. Then apply the material gate yourself
before anything goes in the brief. Keep pass one, the quality gate and the
writing on your own model — the judgment stays with you.

Write \`briefs/$TODAY.md\`, generate the JSON with
\`node scripts/brief-to-json.mjs\`, email it with \`node scripts/send-digest.mjs\`,
then commit and push the brief. If the email fails, still commit and push, and
report the failure. Finish with a four-line report.$DRY"

# Stream the run so the log shows progress instead of going silent for 20
# minutes. The raw stream is teed to a .jsonl first, so a hiccup in the
# readable filter below can never cost us the run's output.
RAW="$LOG_DIR/$TODAY.jsonl"

set -o pipefail
claude -p "$PROMPT" \
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
echo "=== $(date '+%H:%M:%S') — finished, exit $STATUS ==="
exit $STATUS
