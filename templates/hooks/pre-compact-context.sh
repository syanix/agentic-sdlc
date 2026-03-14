#!/usr/bin/env bash
# PreCompact context preservation hook
# Captures key decisions and state before context compaction.
#
# When Claude's context window fills up and compaction occurs,
# important decisions, architectural choices, and session state
# can be lost. This hook preserves that context so it survives
# compaction and remains available in the compressed context.
#
# Usage: Called automatically via PreCompact hook in settings.json
# Input: Receives hook event details via stdin (JSON)

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
SESSION_LOG="${PROJECT_DIR}/.claude/sessions/modified-files.log"

# ─── Gather context to preserve ─────────────────────────────────────────

CONTEXT_PARTS=()

# 1. Current git state
GIT_BRANCH=$(git -C "${PROJECT_DIR}" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
GIT_STATUS=$(git -C "${PROJECT_DIR}" status --short 2>/dev/null | head -20 || echo "unavailable")
CONTEXT_PARTS+=("## Current Git State
Branch: ${GIT_BRANCH}
Modified files:
${GIT_STATUS}")

# 2. Files modified during this session (from post-tool-use tracker)
if [[ -f "${SESSION_LOG}" ]]; then
    RECENT_FILES=$(tail -20 "${SESSION_LOG}" 2>/dev/null || true)
    if [[ -n "${RECENT_FILES}" ]]; then
        CONTEXT_PARTS+=("## Files Modified This Session
${RECENT_FILES}")
    fi
fi

# 3. Recent commits made during this session (last 5)
RECENT_COMMITS=$(git -C "${PROJECT_DIR}" log --oneline -5 2>/dev/null || echo "none")
CONTEXT_PARTS+=("## Recent Commits
${RECENT_COMMITS}")

# ─── Emit as hook output ────────────────────────────────────────────────

# Join all context parts
FULL_CONTEXT=$(printf '%s\n\n' "${CONTEXT_PARTS[@]}")

# Escape for JSON
ESCAPED_CONTEXT=$(printf '%s' "${FULL_CONTEXT}" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

cat <<EOF
{
  "hookSpecificOutput": ${ESCAPED_CONTEXT}
}
EOF

exit 0
