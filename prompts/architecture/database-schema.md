---
name: Database Schema Design
domain: architecture
complexity: high
works-with: [architect agent, /feature command]
---

# Database Schema Design Prompt

## When to Use

Use this prompt when you need to design a database schema for a new domain or redesign an existing one, covering entities, relationships, indexes, and migration scripts.

## The Prompt

```
Design a database schema for the [DOMAIN_NAME] domain.

## Entities
[ENTITIES]

## Relationships
[RELATIONSHIPS]

## Database Type
[DATABASE_TYPE]

For each entity, provide:
1. Table/collection name and description
2. All fields with data types, constraints, and default values
3. Primary key strategy (UUID, auto-increment, composite)
4. Indexes with justification based on expected query patterns
5. Foreign key relationships and referential integrity rules

Additionally provide:
- An entity-relationship summary
- Migration scripts for the initial schema creation
- Seed data examples for development and testing
- Query patterns that drove the schema design decisions
```

## Variations

### Relational Normalised
Append to the base prompt:
```
Design a normalised relational schema (target 3NF minimum).
Include:
- Junction tables for many-to-many relationships
- Appropriate use of CHECK constraints and ENUMs
- Denormalisation decisions with explicit justification (e.g., read performance)
- Partitioning strategy if any table is expected to exceed 10M rows
- Audit columns (created_at, updated_at, deleted_at for soft deletes)
```

### Document-Oriented
Append to the base prompt:
```
Design a document-oriented schema for MongoDB or similar.
Include:
- Embedding vs referencing decisions with justification
- Document size considerations and growth patterns
- Compound indexes for common query and sort combinations
- Aggregation pipeline examples for reporting queries
- Schema validation rules using JSON Schema
```

### Event-Sourced
Append to the base prompt:
```
Design an event-sourced storage model.
Include:
- Event store schema with stream identification
- Event types and their payload schemas
- Snapshot strategy (frequency and storage)
- Projection definitions for read models
- Idempotency handling for event replay
- Compaction and archival strategy for old events
```

## Tips

- Let your query patterns drive the schema, not the other way around
- Always include indexes for foreign keys and commonly filtered columns
- Plan for soft deletes from the start — retroactively adding them is painful
- Use database-level constraints (NOT NULL, UNIQUE, CHECK) as a safety net
- Consider time-zone handling early: store timestamps in UTC, convert on display
- Use the /feature command to generate migration files from the schema design
- Test with realistic data volumes — a schema that works with 100 rows may fail at 10M
- Document expected row counts and growth rates alongside the schema
