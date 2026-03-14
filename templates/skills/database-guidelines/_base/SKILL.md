---
name: database-guidelines
description: Database architecture and PostgreSQL best practices. Use when designing schemas, writing migrations, creating indexes, optimising queries, or making technology selection decisions. Covers schema design, indexing strategies, JSONB usage, partitioning, and performance patterns.
---

# Database Guidelines

Database architecture principles and PostgreSQL-specific best practices. Apply these rules when designing schemas, writing queries, or planning data infrastructure.

---

## Technology Selection

### Relational vs NoSQL Decision Framework
- **Default to PostgreSQL** unless a compelling reason exists for NoSQL
- Use document stores (MongoDB) only when schema is genuinely unpredictable and relationships are minimal
- Use key-value stores (Redis, DynamoDB) for caching, sessions, or simple lookup-by-key workloads
- Use wide-column stores (Cassandra) only for extreme write throughput with simple access patterns
- Use graph databases (Neo4j) only when relationship traversal is the primary query pattern

### CAP Theorem Trade-offs
- PostgreSQL prioritises **Consistency + Availability** (CP in partitioned scenarios)
- If you need eventual consistency for global distribution, consider CockroachDB or Spanner before leaving SQL
- DON'T choose NoSQL solely for "scale" — PostgreSQL handles terabytes with proper indexing and partitioning

---

## Schema Design

### Normalisation Rules
- Normalise to **3NF first**, then selectively denormalise only where measured read performance demands it
- Every denormalisation must have a documented justification and a strategy for keeping data in sync
- DON'T denormalise speculatively — profile first, denormalise second

### Naming Conventions
- Use `snake_case` for all identifiers: tables, columns, indexes, constraints
- Table names are **plural**: `users`, `order_items`, `audit_logs`
- Foreign keys follow `<referenced_table_singular>_id`: `user_id`, `order_id`
- Indexes follow `idx_<table>_<columns>`: `idx_orders_user_id_created_at`
- Constraints follow `<type>_<table>_<columns>`: `uq_users_email`, `chk_orders_total_positive`

### Preferred Data Types
- **Timestamps**: `TIMESTAMPTZ` always — never `TIMESTAMP` without time zone
- **Money/precision**: `NUMERIC(p,s)` — never `FLOAT` or `DOUBLE PRECISION` for monetary values
- **Text**: `TEXT` over `VARCHAR(n)` unless a hard length constraint is genuinely required
- **Primary keys**: `BIGINT GENERATED ALWAYS AS IDENTITY` for internal IDs; `UUID` (v7 preferred) for public-facing IDs
- **Booleans**: `BOOLEAN` with a `NOT NULL` constraint and explicit default
- **Enums**: Use `TEXT` with a `CHECK` constraint, not `CREATE TYPE enum` (enums are painful to modify)

---

## Indexing Strategy

### Index Type Selection
| Use Case | Index Type |
|---|---|
| Equality and range queries | B-tree (default) |
| JSONB containment, arrays, full-text search | GIN |
| Range types, geometric/spatial data | GiST |
| Large append-only / time-series tables | BRIN |

### Indexing Rules
- **PostgreSQL does NOT auto-index foreign keys** — always create FK indexes explicitly
- Use **partial indexes** to index only relevant rows: `CREATE INDEX idx_orders_active ON orders(status) WHERE status != 'archived'`
- Use **covering indexes** (`INCLUDE`) for index-only scans on frequently read columns
- Composite indexes: place high-selectivity columns first; match query column order
- DON'T over-index — each index slows writes and consumes storage. Justify with query plans.
- Monitor with `pg_stat_user_indexes` to find unused indexes

---

## JSONB Guidance

### When to Use JSONB
- DO use for truly semi-structured data: user preferences, metadata, third-party API payloads
- DON'T use to avoid proper schema design — if you query a JSONB key in every request, it should be a column

### JSONB Best Practices
- Add a GIN index for containment queries: `CREATE INDEX idx_events_data ON events USING gin(data)`
- Use containment operators (`@>`) over path extraction (`->>`) for indexed lookups
- Validate JSONB structure at the application layer or with `CHECK` constraints
- Keep JSONB documents under 8 kB where possible to avoid TOAST overhead

---

## Migration Safety

### Rules
- Use **transactional DDL** — PostgreSQL supports it; wrap related changes in a single transaction
- Use `CREATE INDEX CONCURRENTLY` to avoid locking tables during index creation (cannot run inside a transaction)
- DON'T add a column with a volatile default (e.g., `now()`) on large tables — it triggers a full table rewrite. Add the column as nullable, backfill, then set the default
- DON'T drop columns in the same deployment that stops writing to them — deploy in two phases
- Always test migrations against production-scale data volumes before applying

---

## Partitioning

### When to Partition
- Consider partitioning when a table exceeds **50-100 million rows** or query plans show sequential scans on large segments
- DON'T partition prematurely — it adds complexity to queries, maintenance, and constraints

### Partitioning Strategies
| Strategy | Use Case |
|---|---|
| `RANGE` | Time-series data (partition by month/week) |
| `LIST` | Discrete categories (tenant, region, status) |
| `HASH` | Even distribution when no natural range/list key exists |

- Ensure all queries include the partition key in `WHERE` clauses for partition pruning
- Create indexes on each partition, not the parent table

---

## Performance Patterns

### Connection Management
- **Always use a connection pooler** (PgBouncer or built-in pooling) — direct connections are expensive
- Size the pool to `(2 * CPU cores) + effective_spindle_count` on the database server as a starting point
- Set `idle_in_transaction_session_timeout` to prevent abandoned transactions holding locks

### Read Scaling
- Use **read replicas** for reporting, analytics, and read-heavy endpoints
- Accept replication lag: DON'T read from replicas immediately after a write in the same user flow

### Write Optimisation
- Enable **HOT (Heap-Only Tuple) updates** by not indexing frequently updated columns unless necessary
- Use `UNLOGGED` tables for ephemeral staging data (not crash-safe — data lost on crash)
- Batch bulk inserts with `COPY` or multi-row `INSERT ... VALUES` rather than single-row loops

### Query Habits
- Run `EXPLAIN (ANALYZE, BUFFERS)` on any query over 50 ms
- Prefer `EXISTS` over `COUNT(*)` when checking for presence
- Use CTEs for readability but be aware they are **optimisation fences in PG < 12**
- Avoid `SELECT *` — specify columns explicitly

---

> **Stack-specific patterns**: See `resources/` for ORM-specific implementation details, migration tooling, and framework conventions.
