#!/usr/bin/env bash
# UserPromptSubmit context injection hook
# Injects project documentation context on every user prompt.
#
# This replaces raw `cat` commands with properly structured JSON output
# so that context is reliably injected into Claude's conversation.
#
# Usage: Called automatically via UserPromptSubmit hook in settings.json
# Input: Receives prompt details via stdin (JSON)

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
SKILLS_README="${PROJECT_DIR}/.claude/skills/project-docs/README.md"

# Check if the project docs skill exists
if [[ ! -f "${SKILLS_README}" ]]; then
    exit 0
fi

# Read the content
CONTENT=$(cat "${SKILLS_README}" 2>/dev/null || true)

if [[ -z "${CONTENT}" ]]; then
    exit 0
fi

# Emit as structured JSON
ESCAPED_CONTENT=$(printf '%s' "${CONTENT}" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

cat <<EOF
{
  "hookSpecificOutput": ${ESCAPED_CONTENT}
}
EOF

exit 0
