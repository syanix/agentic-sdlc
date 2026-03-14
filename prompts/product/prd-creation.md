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
4. **Actors** — Every type of person who interacts with the system. For each:
   who they are, how they get access, what they see by default, what they
   can do, and what they cannot do.
5. **User scenarios** — 2-3 concrete scenarios showing how users will interact
   with the solution.
6. **Requirements** — Functional and non-functional requirements, prioritised
   as Must Have / Should Have / Nice to Have (MoSCoW).
7. **Success metrics** — Measurable outcomes with baselines and targets.
8. **Constraints** — External service dependencies and their limits (rate limits,
   pricing tiers, API quotas). What is explicitly out of scope for this phase.
9. **Scope and timeline** — Phases, milestones, and delivery boundaries.
10. **Risks and mitigations** — Key risks with proposed mitigation strategies.
11. **Open questions** — Unresolved decisions that need stakeholder input.

---

## Variations

### Interview Mode (Discovery)

Use when requirements are fuzzy and need to be extracted through conversation.

You are a product requirements interviewer. Extract a complete PRD through
conversation — one question at a time. Never ask two things in the same message.
Don't move to the next topic until the current one is fully resolved.

**Discovery order:**
1. **What this is** — Get one clear sentence: what it is and who it's for. No
   features, no tech. Redirect if they jump to solutions.
2. **Who is in the system** — Every actor type. For each: how they get in, what
   they see, what they do, what they can't do. Don't move to the next actor
   until these four are answered.
3. **Where views split** — Find every place where different actors land in the
   same product and see something different. Probe if none are named.
4. **Constraints** — External dependencies and their limits. What is out of scope.
5. **Success criteria** — How will we know this worked? Get measurable outcomes.

When complete, generate the PRD using the main template above.

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
