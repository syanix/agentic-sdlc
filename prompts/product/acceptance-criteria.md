---
name: Acceptance Criteria
domain: product
complexity: low
works-with: [po agent, /feature command]
---

# Acceptance Criteria Prompt

## When to Use

Use this prompt when you need to write comprehensive, testable acceptance criteria for a feature covering happy paths, error handling, and edge cases.

## The Prompt

You are a quality-focused product owner writing acceptance criteria.

**Feature name:** [FEATURE_NAME]
**User actions:** [USER_ACTIONS]
**Expected outcomes:** [EXPECTED_OUTCOMES]
**Edge cases to cover:** [EDGE_CASES]

Write comprehensive acceptance criteria that are:
- **Testable** — Each criterion has a clear pass/fail condition.
- **Specific** — No ambiguous language (avoid "should be fast", "user-friendly").
- **Complete** — Cover the happy path, error paths, and edge cases.
- **Independent** — Each criterion can be verified on its own.

Include criteria for:
1. **Happy path** — The primary flow works as described.
2. **Validation** — Invalid inputs are handled gracefully with clear messages.
3. **Error handling** — System errors produce appropriate user feedback.
4. **Boundary conditions** — Limits, empty states, and maximum values.
5. **Accessibility** — Keyboard navigation, screen reader compatibility.
6. **Performance** — Response time expectations under normal load.

---

## Variations

### Given-When-Then Format

Write criteria for [FEATURE_NAME] using Gherkin syntax:
```
Given [precondition]
When [action performed by user]
Then [expected observable outcome]
```
Actions: [USER_ACTIONS] | Outcomes: [EXPECTED_OUTCOMES] | Edge cases: [EDGE_CASES]
Write one scenario each for: happy path, validation failure, error recovery,
and boundary condition. Use concrete values, not abstract descriptions.

### Checklist Format

Write criteria for [FEATURE_NAME] as a verification checklist:
- [ ] [Criterion with specific, measurable condition]
- [ ] [Criterion covering error handling]
- [ ] [Criterion covering edge case]
Organise into: Functionality, Validation, Error Handling, Performance, Accessibility.

### Scenario-Based Format

Write criteria for [FEATURE_NAME] as user scenarios:
**Scenario 1: [Scenario name]**
- User starts at: [starting state]
- User does: [specific actions, step by step]
- System responds: [observable outcome]
- Data state: [what changed in the system]
Cover edge cases: [EDGE_CASES]. Include a mistake-and-recovery scenario.

---

## Tips

- If you cannot write a test for it, it is not a valid acceptance criterion.
- Use the `/feature` command to generate initial criteria, then refine manually.
- The `po` agent can identify edge cases you may have missed.
- Avoid specifying implementation details — describe what, not how.
- Include negative criteria: "The system does NOT allow..." matters equally.
- Cover the "what happens when the user does nothing" case (timeouts, defaults).
- Number your criteria for easy reference in code reviews and testing.
- Review criteria with developers and testers before development starts.
