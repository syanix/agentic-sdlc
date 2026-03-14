---
name: ADR Creation
domain: architecture
complexity: low
works-with: [architect agent, /analyze command]
---

# Architecture Decision Record (ADR) Prompt

## When to Use

Use this prompt when you need to document a significant architectural or technical decision, capturing the context, options considered, and rationale for the chosen approach.

## The Prompt

```
Write an Architecture Decision Record (ADR) using the following structure.

## Title
[DECISION_TITLE]

## Context
[CONTEXT]

## Options Considered
[OPTIONS_CONSIDERED]

## Constraints
[CONSTRAINTS]

Generate the ADR in this format:

### Status
(Proposed | Accepted | Deprecated | Superseded)

### Context
Describe the forces at play, including technical, political, and organisational.
Be specific about what triggered this decision.

### Decision
State the decision clearly and concisely.

### Options Considered
For EACH option provide:
- Description of the approach
- Pros (specific and measurable where possible)
- Cons (specific and measurable where possible)
- Estimated effort and risk

### Consequences
- What becomes easier or harder as a result
- What new constraints are introduced
- What follow-up decisions will be needed

### Compliance
How will adherence to this decision be verified or enforced?
```

## Variations

### Technology Selection ADR
Append to the base prompt:
```
This ADR is for selecting a technology or library. Additionally include:
- Maturity and community health of each option
- Licencing implications
- Team familiarity and ramp-up cost
- Migration path if this choice is later reversed
- Vendor lock-in assessment
```

### Pattern Adoption ADR
Append to the base prompt:
```
This ADR is for adopting an architectural or design pattern. Additionally include:
- Where the pattern will and will NOT be applied
- Examples of correct usage in our codebase
- Anti-patterns to avoid
- How new team members will learn the pattern
```

### Deprecation ADR
Append to the base prompt:
```
This ADR is for deprecating a technology, pattern, or component. Additionally include:
- Timeline for deprecation phases
- Migration guide for affected teams
- What happens to code that has not migrated by the deadline
- How to measure migration progress
```

## Tips

- Record what was rejected and why — this is often more valuable than what was chosen
- Write ADRs at the time of the decision, not after the fact
- Link ADRs to the tickets or discussions that prompted them
- Use the /analyze command to gather data about existing usage before proposing changes
- Keep the language direct; avoid hedging or marketing-speak
- Number your ADRs sequentially (e.g., ADR-0001) for easy reference
