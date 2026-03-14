#!/usr/bin/env bash
# session-start.sh — Injects orchestration context into every Claude Code session.
# Called by the SessionStart hook on startup, resume, clear, or compact.

set -euo pipefail

# ─── Build context payload ───────────────────────────────────────────────────

CONTEXT=$(cat <<'CONTEXT_END'
SESSION CONTEXT:

## Available Agents

### Plugin agents (general-purpose)
- **task-orchestrator** — Decomposes goals into subtasks and delegates to specialist agents.
- **architect** — Designs system architecture, defines boundaries, and evaluates trade-offs.
- **po** — Acts as product owner: clarifies requirements, writes acceptance criteria, prioritises work.
- **code-refactorer** — Improves existing code structure without changing behaviour.
- **ux-designer** — Creates UI/UX specifications, wireframes, and interaction flows.

### Project agents (stack-specific, defined per project)
- **be-dev** — Backend developer: APIs, database, validation, authentication.
- **fe-dev** — Frontend developer: components, routing, state, accessibility.
- **be-tester** — Backend tester: unit tests, integration tests, coverage.
- **fe-tester** — Frontend tester: E2E specs, visual regression, performance.

## Available Commands

### Plugin commands (general-purpose)
- **/feature** — Plan and implement a new feature end-to-end.
- **/review** — Review code for quality, security, and best practices.
- **/improve** — Suggest and apply improvements to existing code.
- **/analyze** — Analyse codebase structure, dependencies, or performance.
- **/deploy** — Prepare and execute a deployment workflow.

### Project commands (defined per project)
- **/create** — Scaffold a new resource (component, endpoint, migration, etc.).
- **/fix** — Diagnose and fix a bug or failing test.
- **/test** — Run or generate tests for a given scope.
- **/debug** — Start an interactive debugging session.

## Orchestration Principles
1. **Route, don't implement** — The orchestrator delegates to specialist agents rather than doing the work itself.
2. **Parallelise where possible** — Independent subtasks should be dispatched concurrently.
3. **Max 3 iterations** — Any agent loop must converge within three attempts; escalate if not resolved.
CONTEXT_END
)

# ─── Emit hook output ────────────────────────────────────────────────────────

# Escape the context for safe JSON embedding
ESCAPED_CONTEXT=$(printf '%s' "$CONTEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

cat <<EOF
{
  "hookSpecificOutput": ${ESCAPED_CONTEXT},
  "hookEventName": "SessionStart",
  "additionalContext": "Orchestration context injected. Use /help to list available commands. Delegate to specialist agents via the task-orchestrator."
}
EOF
