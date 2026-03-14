---
name: architecture-patterns
description: Software architecture patterns and strategic design guidance. Use when making architectural decisions, structuring domains, designing system boundaries, or evaluating trade-offs between patterns like Clean Architecture, Hexagonal, DDD, CQRS, and Event Sourcing.
---

# Architecture Patterns

Guidance on when and how to apply common architecture patterns. Focus on principles and trade-offs rather than prescriptive implementations.

## Clean Architecture

Enforce the **dependency rule**: source code dependencies must point inward only. Inner layers know nothing about outer layers.

### Layers (inside out)
1. **Entities** — enterprise-wide business rules, pure domain objects
2. **Use Cases** — application-specific business rules, orchestration logic
3. **Interface Adapters** — controllers, presenters, gateways, DTOs
4. **Infrastructure** — frameworks, databases, external services, UI

### Typical directory layout
```
src/
  domain/          # entities, value objects, domain interfaces
  application/     # use cases, application services, DTOs
  adapters/        # controllers, presenters, mappers
  infrastructure/  # database, HTTP clients, framework config
```

### When to use
- Medium-to-large applications with complex business logic
- Systems requiring long-term maintainability and testability
- Teams that need to swap frameworks or infrastructure independently

### Anti-patterns
- Skipping layers for convenience (controller calling repository directly)
- Leaking ORM entities into the domain layer
- Creating excessive abstractions in simple CRUD applications

## Hexagonal Architecture (Ports & Adapters)

Isolate the **domain core** from all external concerns through explicit ports (interfaces) and adapters (implementations).

### Core concepts
- **Ports** — interfaces defined by the domain (e.g., `OrderRepository`, `PaymentGateway`)
- **Driving adapters** — invoke the application (HTTP controllers, CLI, message consumers)
- **Driven adapters** — are invoked by the application (database, email, third-party APIs)

### Key benefit: adapter swapping
- Swap a PostgreSQL adapter for an in-memory adapter during testing
- Replace an email provider without touching business logic
- Run the same domain behind REST, GraphQL, or gRPC simultaneously

### When to use
- Applications with multiple entry points or integration channels
- Systems where infrastructure components change frequently
- Projects that prioritise test isolation

## Domain-Driven Design (DDD)

Apply DDD when the **problem domain is complex** and warrants investment in a shared model between developers and domain experts.

### Strategic design
- **Bounded Contexts** — explicit boundaries around distinct sub-domains; each context owns its own model and ubiquitous language
- **Context Mapping** — define relationships between contexts (shared kernel, anti-corruption layer, customer-supplier)

### Tactical patterns
- **Entities** — objects with identity that persists across state changes
- **Value Objects** — immutable objects defined by their attributes, no identity
- **Aggregates** — clusters of entities and value objects with a single root; enforce invariants at the aggregate boundary
- **Domain Events** — record that something meaningful occurred; enable loose coupling between aggregates and bounded contexts
- **Repositories** — collection-like interfaces for aggregate persistence; one repository per aggregate root

### When to use
- Complex domains with rich business rules and many edge cases
- Collaborative environments where shared language reduces miscommunication
- Systems where getting the model wrong has significant business cost

### Anti-patterns
- Applying full DDD tactical patterns to simple CRUD domains
- Aggregates that are too large — keep them small, protect only true invariants
- Anaemic domain models where entities are just data bags with external service logic

## CQRS (Command Query Responsibility Segregation)

Separate the **write model** (commands) from the **read model** (queries) when they have fundamentally different requirements.

### Structure
- **Commands** — modify state, validate invariants, return minimal confirmation
- **Queries** — read-optimised projections, no side effects, can be denormalised
- Models can use different data stores, schemas, or even databases

### Interface pattern
```
commands/
  CreateOrder.ts       # command handler — validates, persists
  CancelOrder.ts
queries/
  GetOrderSummary.ts   # query handler — reads from optimised view
  ListUserOrders.ts
```

### When to use
- Read and write workloads differ significantly in shape or scale
- Complex domains where the write model is normalised but reads need denormalised views
- Systems requiring independent scaling of read and write sides

### When to avoid
- Simple applications where a single model serves both reads and writes adequately
- Teams unfamiliar with eventual consistency trade-offs

## Event Sourcing

Persist **state as a sequence of events** rather than current state. Every state change is an immutable event appended to an event store.

### Core concepts
- **Event Store** — append-only log of domain events; the source of truth
- **Projections** — materialised views built by replaying events into read-optimised models
- **Snapshots** — periodic state snapshots to avoid replaying the full event history
- **Replay** — rebuild state or projections by replaying events from any point in time

### When to use
- Full audit trail is a business requirement (finance, compliance, healthcare)
- Temporal queries are needed (what was the state at time T?)
- Combined with CQRS for complex read/write separation

### When to avoid
- Simple state that rarely changes — event sourcing adds significant complexity
- Teams without experience managing eventual consistency and projection lag

## Choosing the Right Pattern

| Pattern | Best for | Avoid when |
|---------|----------|------------|
| Clean Architecture | Complex business logic, long-lived systems | Simple CRUD, prototypes |
| Hexagonal | Multiple integrations, high testability | Single-channel, small apps |
| DDD | Complex domains, shared language matters | Simple data-in/data-out services |
| CQRS | Divergent read/write models, scaling | Uniform read/write patterns |
| Event Sourcing | Audit trails, temporal queries, replay | Simple state, frequent deletes |

### Over-engineering warnings
- **Start simple.** Most applications only need clean layering. Introduce patterns when complexity demands it.
- **Patterns are tools, not goals.** Adopting CQRS + Event Sourcing + DDD for a to-do app is a recipe for failure.
- **Partial adoption is valid.** Use DDD strategic design without full tactical patterns. Use CQRS without event sourcing.
- **Measure complexity.** If a pattern makes the codebase harder to understand for the team, it is not the right fit yet.
