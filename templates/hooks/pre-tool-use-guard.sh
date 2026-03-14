#!/usr/bin/env bash
# PreToolUse safety guard
# Blocks dangerous shell commands before execution.
#
# This hook inspects Bash tool invocations for destructive patterns
# and blocks them with an explanatory message.
#
# Usage: Called automatically via PreToolUse hook in settings.json
# Input: Receives tool use details via stdin (JSON)
# Exit code: 0 with {"decision": "block"} JSON to prevent execution

set -euo pipefail

INPUT=$(cat)

# Extract the command from tool input
COMMAND=$(echo "${INPUT}" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    tool_input = data.get('tool_input', {})
    print(tool_input.get('command', ''))
except (json.JSONDecodeError, KeyError):
    pass
" 2>/dev/null || true)

# If no command extracted, allow (non-Bash tool or parse failure)
if [[ -z "${COMMAND}" ]]; then
    exit 0
fi

# ─── Dangerous pattern checks ───────────────────────────────────────────

BLOCKED_REASON=""

# Destructive file operations
if echo "${COMMAND}" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--recursive)\s'; then
    BLOCKED_REASON="Recursive force-delete (rm -rf) is blocked. Remove files individually or ask the user for confirmation."
fi

if echo "${COMMAND}" | grep -qE 'rm\s+-[a-zA-Z]*f' && echo "${COMMAND}" | grep -qE '\s(/|~|\$HOME)\s*$'; then
    BLOCKED_REASON="Deleting home or root directory is blocked."
fi

# Destructive git operations
if echo "${COMMAND}" | grep -qE 'git\s+push\s+.*--force'; then
    BLOCKED_REASON="Force-push is blocked. Use --force-with-lease if you must, or ask the user."
fi

if echo "${COMMAND}" | grep -qE 'git\s+reset\s+--hard'; then
    BLOCKED_REASON="git reset --hard is blocked — this discards uncommitted work. Ask the user first."
fi

if echo "${COMMAND}" | grep -qE 'git\s+clean\s+-[a-zA-Z]*f'; then
    BLOCKED_REASON="git clean -f is blocked — this deletes untracked files permanently. Ask the user first."
fi

# Database destruction
if echo "${COMMAND}" | grep -qiE 'DROP\s+(TABLE|DATABASE|SCHEMA)'; then
    BLOCKED_REASON="DROP TABLE/DATABASE/SCHEMA is blocked. Ask the user for explicit confirmation."
fi

if echo "${COMMAND}" | grep -qiE 'TRUNCATE\s+TABLE'; then
    BLOCKED_REASON="TRUNCATE TABLE is blocked. Ask the user for explicit confirmation."
fi

# Credential/secret exposure
if echo "${COMMAND}" | grep -qE 'cat\s+.*\.(env|pem|key|secret)'; then
    BLOCKED_REASON="Reading credential/secret files via cat is blocked. Use environment variables instead."
fi

# ─── Emit decision ──────────────────────────────────────────────────────

if [[ -n "${BLOCKED_REASON}" ]]; then
    # Escape the reason for JSON
    ESCAPED_REASON=$(printf '%s' "${BLOCKED_REASON}" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read())[1:-1])')
    cat <<EOF
{
  "decision": "block",
  "reason": "${ESCAPED_REASON}"
}
EOF
    exit 0
fi

# No dangerous patterns detected — allow execution
exit 0
