---
name: PRD Creation
domain: product
complexity: high
works-with: [po agent, /analyze command]
---

# PRD Creation Prompt

## When to Use

Use this prompt when you need to draft a Product Requirements Document to align stakeholders on what is being built, why, and how success will be measured.

## The Prompt

You are a senior product manager drafting a Product Requirements Document.

**Product name:** [PRODUCT_NAME]
**Problem statement:** [PROBLEM_STATEMENT]
**Target users:** [TARGET_USERS]
**Success metrics:** [SUCCESS_METRICS]

Create a PRD with the following sections:

1. **Overview** — One-paragraph summary of what we are building and why.
2. **Problem statement** — The user pain point or business opportunity, supported
   by evidence (data, research, or customer feedback).
3. **Goals and non-goals** — What this initiative will and will not achieve.
4. **Target users** — Personas and their key characteristics.
5. **User scenarios** — 2-3 concrete scenarios showing how users will interact
   with the solution.
6. **Requirements** — Functional and non-functional requirements, prioritised
   as Must Have / Should Have / Nice to Have (MoSCoW).
7. **Success metrics** — Measurable outcomes with baselines and targets.
8. **Scope and timeline** — Phases, milestones, and what is explicitly out of scope.
9. **Risks and mitigations** — Key risks with proposed mitigation strategies.
10. **Open questions** — Unresolved decisions that need stakeholder input.

---

## Variations

### New Feature PRD

**Product:** [PRODUCT_NAME] | **Feature:** [FEATURE_NAME]
**Problem:** [PROBLEM_STATEMENT] | **Users:** [TARGET_USERS]

Include impact analysis on existing functionality, feature flag strategy
for progressive rollout, and backward compatibility considerations.

### Platform Migration PRD

Migrate from [CURRENT_PLATFORM] to [TARGET_PLATFORM]:
**Product:** [PRODUCT_NAME] | **Reason:** [PROBLEM_STATEMENT] | **Success:** [SUCCESS_METRICS]

Include: parallel running period, data migration plan, rollback procedures,
and communication plan. Define "migration complete" with measurable criteria.

### MVP Scoping PRD

**Concept:** [PRODUCT_NAME] | **Problem:** [PROBLEM_STATEMENT] | **Users:** [TARGET_USERS]

Ruthlessly prioritise. Test one core hypothesis with smallest investment.
Define what we learn, how we measure, and what decisions results inform.

---

## Tips

- Start with the problem, not the solution — ensure the problem is worth solving.
- Use the `/analyze` command to gather codebase context for technical feasibility.
- The `po` agent can help generate user scenarios and acceptance criteria.
- Make metrics specific: "Reduce p95 latency from 800ms to 200ms" not "improve performance".
- Clearly separate must-haves from nice-to-haves — scope creep kills timelines.
- Include non-functional requirements (performance, security, accessibility) from the start.
- Review the PRD with engineering before finalising to catch feasibility issues early.
- A PRD is a living document; version it and update as decisions are made.
