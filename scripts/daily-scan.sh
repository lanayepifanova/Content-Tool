#!/bin/bash
# Runs the Basis Point scan headlessly, for launchd to fire once a day.
#   ./scripts/daily-scan.sh          — normal run
#   ./scripts/daily-scan.sh --dry    — same, but skips the email and the push
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
[ "${1:-}" = "--dry" ] && DRY="
This is a DRY RUN: write the brief and the JSON, but do NOT send the email and
do NOT commit or push. Say clearly at the end that it was a dry run."

PROMPT="Run today's Basis Point content scan.

Follow the repo skill \`basis-point-scan\` exactly, start to finish. Read
\`agent/taste.md\` (binding, including its LEARNED section), \`agent/format.md\`,
and the last 6 briefs in \`briefs/\` for de-duplication before researching.

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

Write \`briefs/$TODAY.md\`, generate the JSON with
\`node scripts/brief-to-json.mjs\`, email it with \`node scripts/send-digest.mjs\`,
then commit and push the brief. If the email fails, still commit and push, and
report the failure. Finish with a four-line report.$DRY"

claude -p "$PROMPT" \
  --model opus \
  --permission-mode acceptEdits \
  --allowedTools \
    "Read Write Edit Glob Grep WebSearch WebFetch Skill TodoWrite" \
    "Bash(node:*)" "Bash(git:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" \
    "Bash(tail:*)" "Bash(grep:*)" "Bash(date:*)" "Bash(wc:*)" "Bash(mkdir:*)"

STATUS=$?
echo "=== $(date '+%H:%M:%S') — finished, exit $STATUS ==="
exit $STATUS
