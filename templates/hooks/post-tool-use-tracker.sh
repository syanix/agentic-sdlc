#!/usr/bin/env bash
# Post-tool-use file tracker
# Logs modified files for session awareness
#
# This hook is triggered after Edit or Write tool use.
# It records the modified file path to a session tracking file,
# enabling agents to maintain awareness of what has changed
# during the current session.
#
# Usage: Called automatically via PostToolUse hook in settings.json
# Input: Receives tool use details via stdin (JSON)

set -euo pipefail

# Configuration
SESSION_DIR="${CLAUDE_SESSION_DIR:-.claude/sessions}"
TRACKING_FILE="${SESSION_DIR}/modified-files.log"
TIMESTAMP_FORMAT="%Y-%m-%dT%H:%M:%S%z"

# Ensure the session directory exists
mkdir -p "${SESSION_DIR}"

# Read the tool use event from stdin
INPUT=$(cat)

# Extract the file path from the tool use event
# The input JSON contains tool_name, tool_input, and tool_output fields
FILE_PATH=$(echo "${INPUT}" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    tool_input = data.get('tool_input', {})
    # Edit tool uses 'file_path', Write tool uses 'file_path'
    path = tool_input.get('file_path', '')
    if path:
        print(path)
except (json.JSONDecodeError, KeyError):
    pass
" 2>/dev/null || true)

# If we extracted a file path, log it
if [[ -n "${FILE_PATH}" ]]; then
    TIMESTAMP=$(date +"${TIMESTAMP_FORMAT}")

    # Append to the tracking file (avoid duplicates for consecutive edits to the same file)
    LAST_ENTRY=$(tail -1 "${TRACKING_FILE}" 2>/dev/null | awk '{print $2}' || true)

    if [[ "${LAST_ENTRY}" != "${FILE_PATH}" ]]; then
        echo "${TIMESTAMP} ${FILE_PATH}" >> "${TRACKING_FILE}"
    fi
fi

# Always exit successfully — hook failures should not block the agent
exit 0
