---
name: System Design
domain: architecture
complexity: high
works-with: [architect agent, /analyze command]
---

# System Design Prompt

## When to Use

Use this prompt when you need to design the high-level architecture for a new system or rethink the architecture of an existing one, covering components, data flow, and technology choices.

## The Prompt

```
You are a senior systems architect. Design the architecture for [SYSTEM_NAME].

## Requirements
[REQUIREMENTS]

## Scale Expectations
[SCALE_EXPECTATIONS]

## Constraints
[CONSTRAINTS]

Please provide:
1. A high-level architecture diagram description (components and their interactions)
2. Technology recommendations with justifications
3. Data flow for the primary use cases
4. Key architectural decisions and their trade-offs
5. Failure modes and mitigation strategies
6. A phased implementation plan starting with the simplest viable architecture

Start with the simplest design that meets the requirements, then identify where
complexity is genuinely needed. Document every trade-off explicitly.
```

## Variations

### Greenfield Design
Append to the base prompt:
```
This is a greenfield project. There are no existing systems to integrate with
initially. Prioritise simplicity and evolvability over completeness. Identify
which components can start as a monolith and be extracted later.
```

### Migration / Refactor
Append to the base prompt:
```
This is a migration from an existing system. The current architecture is:
[CURRENT_ARCHITECTURE]

Key pain points driving the migration:
[PAIN_POINTS]

Provide a strangler fig migration strategy with clearly defined phases.
Each phase must leave the system in a working state. Identify the riskiest
migration steps and propose risk mitigation for each.
```

### Microservices Decomposition
Append to the base prompt:
```
Decompose the system into microservices based on domain boundaries.
For each proposed service, specify:
- Bounded context and ownership
- API contracts (sync and async)
- Data ownership and storage
- Inter-service communication patterns
- Deployment independence constraints

Justify why each boundary exists. If fewer services would suffice, say so.
```

## Tips

- Always start with a monolith-first approach unless there is a compelling reason not to
- Document what you chose NOT to do and why — future engineers will thank you
- Validate scale expectations with back-of-envelope calculations before over-engineering
- Consider operational complexity as a first-class constraint, not an afterthought
- Use the /analyze command to evaluate existing codebases before proposing changes
- Pair with the architect agent for iterative refinement of the design
