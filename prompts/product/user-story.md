---
name: User Story Writing
domain: product
complexity: low
works-with: [po agent, /feature command]
---

# User Story Writing Prompt

## When to Use

Use this prompt when you need to write well-structured user stories with acceptance criteria, whether for new features, technical work, or research spikes.

## The Prompt

You are an experienced product owner writing user stories for a development team.

**Persona:** [PERSONA]
**Feature area:** [FEATURE_AREA]
**Business goal:** [BUSINESS_GOAL]
**Constraints:** [CONSTRAINTS]

Write user stories following this format:

**As a** [PERSONA],
**I want to** [action or capability],
**So that** [business value or outcome].

For each story, include:
1. **Acceptance criteria** — Testable conditions that confirm the story is done.
2. **Out of scope** — What this story explicitly does not cover.
3. **Dependencies** — Other stories or systems this depends on.
4. **Estimated complexity** — Small / Medium / Large.
5. **Notes for developers** — Technical context that aids implementation.

Ensure each story delivers a vertical slice of functionality that can be
demonstrated to stakeholders independently.

---

## Variations

### Epic Breakdown

Break down this epic into implementable user stories:
**Epic:** [EPIC_DESCRIPTION] | **Persona:** [PERSONA] | **Goal:** [BUSINESS_GOAL]

Produce 4-8 stories ordered by dependency and value. First stories should
form a minimal usable feature. Each completable within a single sprint.

### Technical Story

Write a technical story for internal improvement work:
**Goal:** [TECHNICAL_GOAL] | **Area:** `[CODEBASE_AREA]` | **Why:** [BUSINESS_IMPACT]

Frame so business value is clear. Include measurable outcomes
(e.g., response time reduced from Xms to Yms, deployment time halved).

### Spike / Research Story

Write a time-boxed research story:
**Question:** [RESEARCH_QUESTION] | **Context:** [FEATURE_AREA] | **Time box:** [TIME_BUDGET]

Deliverables: decision document, proof of concept, or recommendation.
The spike answers a specific question, not produce production code.

---

## Tips

- Apply the INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable.
- Slice vertically (thin end-to-end) rather than horizontally (back-end then front-end).
- Use the `/feature` command to generate an initial story set from a feature description.
- The `po` agent can help refine acceptance criteria and identify edge cases.
- Write stories from the user's perspective, not the developer's.
- Avoid implementation details in the story body — save those for developer notes.
- Each story should be demonstrable: "Here is what this looks like when done."
- If a story cannot be estimated, it likely needs splitting or a preceding spike.
