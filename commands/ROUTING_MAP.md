---
description: Command-to-agent routing map for the agentic-sdlc plugin
---

# Command-to-Agent Routing Map

This document defines the routing logic for all commands in the agentic-sdlc system. It maps each command to its agent chain, parallel execution strategy, and decision routing.

## Agent Roles Reference

| Role               | Key Responsibilities                                        |
|--------------------|-------------------------------------------------------------|
| Architect          | System design, component boundaries, security, scalability  |
| Backend Developer  | Server-side logic, APIs, data access, database              |
| Frontend Developer | UI components, state management, rendering, accessibility   |
| UX Designer        | Interaction patterns, component structure, responsive design |
| Testing            | Test strategy, coverage, unit/integration/e2e tests         |
| Code Quality       | Standards, refactoring, complexity, maintainability          |
| Product Owner      | Requirements, acceptance criteria, user stories, docs       |
| DevOps             | Infrastructure, deployment, monitoring, CI/CD               |

---

## Plugin Commands

### /feature
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Orchestrator (sequential phases, parallel within)            |
| Phase 1 Agents | Architect ∥ Product Owner                                   |
| Phase 2 Agents | Backend Developer ∥ Frontend Developer ∥ UX Designer        |
| Phase 3 Agents | Testing ∥ Code Quality                                      |
| Phase 4 Agents | DevOps → Architect                                           |
| Parallel Ops   | Within each phase                                            |
| Gate Logic     | Phase N must complete before Phase N+1 begins                |

### /review
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Conditional (based on review type)                           |
| `standard`     | Code Quality ∥ Testing                                      |
| `security`     | Code Quality ∥ Architect                                    |
| `architecture` | Architect ∥ Code Quality                                    |
| `performance`  | Backend Developer ∥ Frontend Developer                      |
| `full`         | ALL agents in parallel                                       |
| Parallel Ops   | All agents within selected type run concurrently             |

### /improve
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Sequential chain (varies by improvement type)                |
| `quality`      | Code Quality → Testing                                      |
| `performance`  | Backend Developer → Frontend Developer → Code Quality       |
| `types`        | Code Quality → Architect                                    |
| `architecture` | Architect → Code Quality → Backend Developer                |
| `tests`        | Testing → Code Quality                                      |
| Parallel Ops   | None (sequential chains for safe incremental changes)        |

### /analyze
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Parallel dispatch (based on analysis type)                   |
| `architecture` | Architect ∥ Code Quality                                    |
| `performance`  | Backend Developer ∥ Frontend Developer                      |
| `security`     | Architect ∥ Code Quality                                    |
| `quality`      | Code Quality ∥ Testing                                      |
| `full`         | ALL agents in parallel                                       |
| Parallel Ops   | All agents within selected type run concurrently             |

### /deploy
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Parallel dispatch (all agents)                               |
| Agent Chain    | ALL agents execute simultaneously                            |
| Parallel Ops   | Maximum parallelism — all domains validated concurrently     |
| Consolidation  | Results merged into pass/warning/fail verdict                |

---

## Project-Level Commands

These commands are typically defined at the project level and route to specific agents.

### /create
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Architect → Backend Developer ∥ Frontend Developer          |
| Purpose        | Scaffold new components, modules, or resources               |
| Parallel Ops   | Backend and frontend scaffolding runs concurrently           |
| Gate Logic     | Architect defines structure before implementation begins     |

### /fix
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Conditional (based on error domain)                          |
| Backend Error  | Backend Developer → Testing                                 |
| Frontend Error | Frontend Developer → Testing                                |
| Full-Stack     | Backend Developer ∥ Frontend Developer → Testing            |
| Parallel Ops   | Diagnosis parallel when cross-stack, testing after fix       |

### /test
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Testing → Code Quality                                      |
| Purpose        | Generate or improve tests for specified target               |
| Parallel Ops   | None (sequential to ensure quality validation)               |
| Output         | Test files with coverage report                              |

### /debug
| Attribute      | Value                                                        |
|----------------|--------------------------------------------------------------|
| Primary Route  | Conditional (based on symptom analysis)                      |
| Runtime Error  | Backend Developer or Frontend Developer                     |
| Performance    | Backend Developer ∥ Frontend Developer                      |
| Data Issue     | Backend Developer → Architect                               |
| Parallel Ops   | When symptom spans multiple domains                          |

---

## Parallel Execution Patterns

### Pattern 1: Full Parallel
All agents execute simultaneously with no dependencies.
- **Used by**: `/deploy`, `/review full`, `/analyze full`
- **Merge strategy**: Consolidate all findings, deduplicate, prioritise

### Pattern 2: Phased Parallel
Sequential phases with parallel execution within each phase.
- **Used by**: `/feature`
- **Merge strategy**: Phase outputs become next phase inputs

### Pattern 3: Conditional Parallel
Agent selection based on command arguments, then parallel execution.
- **Used by**: `/review [type]`, `/analyze [type]`, `/fix`, `/debug`
- **Merge strategy**: Combine findings from selected agents

### Pattern 4: Sequential Chain
Agents execute one after another, each building on prior output.
- **Used by**: `/improve [type]`, `/test`
- **Merge strategy**: Final agent produces consolidated output

---

## Routing Decision Tree

```
Command received
├── /feature → Phase-gated orchestration (Pattern 2)
├── /review
│   ├── standard → Code Quality ∥ Testing
│   ├── security → Code Quality ∥ Architect
│   ├── architecture → Architect ∥ Code Quality
│   ├── performance → Backend Dev ∥ Frontend Dev
│   └── full → ALL parallel (Pattern 1)
├── /improve
│   ├── quality → Code Quality → Testing (Pattern 4)
│   ├── performance → Backend → Frontend → Code Quality (Pattern 4)
│   ├── types → Code Quality → Architect (Pattern 4)
│   ├── architecture → Architect → Code Quality → Backend (Pattern 4)
│   └── tests → Testing → Code Quality (Pattern 4)
├── /analyze
│   ├── architecture → Architect ∥ Code Quality
│   ├── performance → Backend Dev ∥ Frontend Dev
│   ├── security → Architect ∥ Code Quality
│   ├── quality → Code Quality ∥ Testing
│   └── full → ALL parallel (Pattern 1)
├── /deploy → ALL parallel (Pattern 1) → Verdict
├── /create → Architect → Backend ∥ Frontend (Pattern 2)
├── /fix → Diagnose domain → Route to specialist → Testing (Pattern 3)
├── /test → Testing → Code Quality (Pattern 4)
└── /debug → Analyse symptom → Route to specialist(s) (Pattern 3)
```

---

## Optimisation Guidelines

1. **Maximise parallelism**: Always prefer parallel agent dispatch when agents have no data dependencies
2. **Minimise round-trips**: Provide complete context upfront to avoid agents requesting additional information
3. **Early termination**: If a critical blocker is found (e.g., in `/deploy`), surface it immediately rather than waiting for all agents
4. **Context sharing**: When agents in the same phase analyse the same files, share file reads to reduce duplication
5. **Progressive output**: Display results as each agent completes rather than waiting for all to finish
6. **Scope narrowing**: For large codebases, narrow agent scope to relevant modules to reduce processing time
7. **Cache awareness**: Reuse recent analysis results when running related commands in sequence (e.g., `/analyze` followed by `/improve`)
8. **Fallback routing**: If a specialist agent is unavailable, the Code Quality agent serves as a general-purpose fallback
