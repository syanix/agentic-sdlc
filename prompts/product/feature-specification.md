---
name: Feature Specification
domain: product
complexity: high
works-with: [po agent, architect agent, /feature command]
---

# Feature Specification Prompt

## When to Use

Use this prompt when you need a detailed technical specification for a feature, covering user flows, data models, API contracts, and delivery planning.

## The Prompt

You are a senior product engineer writing a detailed feature specification.

**Feature name:** [FEATURE_NAME]
**User problem:** [USER_PROBLEM]
**Proposed solution:** [PROPOSED_SOLUTION]
**Technical constraints:** [TECHNICAL_CONSTRAINTS]

Create a feature specification covering:

1. **Summary** — One-paragraph description of the feature and its value.
2. **User problem** — What pain point does this solve? Include evidence.
3. **Proposed solution** — How the feature works from the user's perspective.
4. **User flow** — Step-by-step interaction flow with decision points.
5. **Functional requirements** — Detailed behaviours, inputs, outputs, and rules.
6. **Non-functional requirements** — Performance, security, accessibility,
   internationalisation, and observability requirements.
7. **Data model changes** — New entities, fields, or relationships required.
8. **API contracts** — Endpoints, request/response shapes, and error codes.
9. **Dependencies** — External services, libraries, or team dependencies.
10. **Phased delivery plan** — How to deliver incrementally with value at each phase.
11. **Testing strategy** — Unit, integration, and end-to-end test approach.
12. **Rollback plan** — How to safely revert if issues arise post-deployment.

---

## Variations

### API Feature Spec

**Feature:** [FEATURE_NAME] | **Problem:** [USER_PROBLEM] | **Constraints:** [TECHNICAL_CONSTRAINTS]

Focus on: RESTful resource design, request/response schemas with examples,
auth requirements, rate limiting, versioning, error codes, pagination,
and webhook/event notifications.

### UI Feature Spec

**Feature:** [FEATURE_NAME] | **Problem:** [USER_PROBLEM] | **Solution:** [PROPOSED_SOLUTION]

Focus on: interaction flow, component hierarchy, responsive behaviour,
loading/empty/error states, accessibility (WCAG 2.1 AA), animations,
internationalisation, and browser/device support matrix.

### Platform / Infrastructure Spec

**Feature:** [FEATURE_NAME] | **Problem:** [USER_PROBLEM] | **Constraints:** [TECHNICAL_CONSTRAINTS]

Focus on: architecture diagram, scalability and capacity planning,
monitoring/alerting, disaster recovery, security boundaries,
configuration management, migration strategy, and operational runbooks.

---

## Tips

- A good spec is clear enough that two independent teams would build the same thing.
- Use the `/feature` command to scaffold the initial specification structure.
- The `po` agent handles user-facing requirements; the `architect` agent validates feasibility.
- Include non-functional requirements from the start — retrofitting is expensive.
- Define what "done" looks like for each delivery phase.
- Specify observability: what metrics and traces confirm the feature works in production?
- Plan for failure: every external dependency will eventually be unavailable.
- Use concrete examples and sample data rather than abstract descriptions.
