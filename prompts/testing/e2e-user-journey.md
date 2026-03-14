---
name: E2E User Journey
domain: testing
complexity: high
works-with: [po agent, /feature command]
---

# End-to-End User Journey Tests

## When to Use

Use this prompt when you need to test a complete user journey through the application, validating that multi-step workflows function correctly from the user's perspective.

## The Prompt

```
Write E2E tests for the "[JOURNEY_NAME]" user journey using [E2E_TOOL]
against [BASE_URL].

Steps:
[STEPS]

Requirements:
- Wait for expected UI state before proceeding at each step
- Use stable selectors: data-testid, ARIA roles, or visible text
- Assert application state at each step
- Handle loading states and async fetches gracefully
- Take a screenshot on failure for debugging
```

## Variation 1 — Happy Path Journey

```
Test the primary happy path for "[JOURNEY_NAME]": [STEPS]
Verify success messages, redirects, and final state. Confirm data
persistence by navigating away and returning. Target completion
within 30 seconds. Use the `po` agent to validate steps match the
acceptance criteria.
```

## Variation 2 — Error Recovery Journey

```
Test error recovery for "[JOURNEY_NAME]":
1. Network failure mid-journey — verify error message and retry behaviour
2. Validation errors — verify inline errors next to correct fields
3. Session expiry — verify redirect to login and journey resumption
4. Server error (500) — verify user-friendly message with recovery action
Each scenario must confirm the user can recover without data loss.
```

## Variation 3 — Multi-Role Journey

```
Test "[JOURNEY_NAME]" spanning multiple user roles: [ROLES]
Flow: Role A initiates, Role B acts on it, Role A sees the update.
For each role switch, use separate browser contexts or re-authenticate.
Verify permissions are enforced — each role only sees authorised content.
Use `/feature` to cross-reference with the feature specification.
```

## Tips

- **Stability over speed.** Wait for explicit conditions (element visible,
  network idle) — never use fixed `sleep` calls.
- **Use data-testid sparingly.** Prefer ARIA roles and visible text as
  selectors — they double as accessibility checks.
- **Isolate test data.** Create data via API in `beforeEach`. Never rely
  on pre-existing database state.
- **Keep journeys focused.** One journey per file. If a journey exceeds
  10-12 steps, split it into smaller sub-journeys.
- **Record traces on failure.** Configure [E2E_TOOL] to capture traces —
  they are invaluable for debugging flaky tests.
- **Coordinate with the `po` agent** to ensure steps map directly to
  user story acceptance criteria.
