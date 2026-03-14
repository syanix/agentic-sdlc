# Cloudflare D1 Database Stack

## SQLite Compatibility

- D1 uses SQLite under the hood — write standard SQLite-compatible SQL.
- Be aware of SQLite limitations: no `ALTER COLUMN`, limited `ALTER TABLE` support, no stored procedures.
- Use `STRICT` tables where possible to enforce column type checking at the engine level.
- D1 does not support concurrent writes from multiple Workers — design for eventual consistency in distributed workloads.

## Drizzle ORM Integration

- Use Drizzle ORM for type-safe queries and schema management with D1.
- Define the schema in `src/db/schema.ts` using `sqliteTable` from `drizzle-orm/sqlite-core`.
- Initialise the Drizzle client with the D1 binding: `drizzle(env.DB)`.
- Use Drizzle's query builder for composable, type-safe queries — avoid raw SQL unless Drizzle cannot express the query.

## Schema Migrations

- Generate migrations with `wrangler d1 migrations create <database-name> <migration-name>`.
- Migration files are stored in the `migrations/` directory as numbered SQL files.
- Apply migrations with `wrangler d1 migrations apply <database-name>` for remote or `--local` for local development.
- If using Drizzle, generate migration SQL with `npx drizzle-kit generate` and copy into a D1 migration file.
- Keep migrations small and incremental — SQLite's limited `ALTER TABLE` often requires create-copy-drop patterns for column changes.

## Batch Operations

- Use the D1 batch API (`db.batch([...])`) to execute multiple statements in a single round trip.
- Batch operations run inside an implicit transaction — all statements succeed or all fail.
- Prefer batching over sequential queries to reduce latency, especially for multi-table writes.

## Binding Configuration

- Define D1 bindings in `wrangler.toml` under `[[d1_databases]]` with `binding`, `database_name`, and `database_id`.
- Access the binding in the Worker via `env.DB` (or whatever name is set in the `binding` field).
- Use separate databases for staging and production — configure per-environment bindings in `wrangler.toml`.

## Local Development

- Run the Worker locally with `wrangler dev` — D1 bindings automatically use a local SQLite file.
- Apply migrations locally with `wrangler d1 migrations apply <database-name> --local`.
- Use `wrangler d1 execute <database-name> --local --command "SELECT ..."` for ad-hoc local queries.
- The local database resets on `wrangler d1 migrations apply --local` if using `--reset` — omit the flag to apply incrementally.

## Performance Considerations

- Keep queries simple and indexed — SQLite performs best with straightforward access patterns.
- Create indexes on columns used in WHERE clauses, JOIN conditions, and ORDER BY expressions.
- Use `SELECT` with explicit column lists rather than `SELECT *` to reduce payload size at the edge.
- Batch related queries into a single `db.batch()` call to minimise round trips.
- D1 automatically replicates reads to edge locations — read-heavy workloads benefit from global distribution with no extra configuration.

## Backup and Export

- Export the database with `wrangler d1 export <database-name> --output backup.sql`.
- Use `wrangler d1 execute <database-name> --file backup.sql` to restore from an exported file.
- Schedule regular exports to external storage for offsite disaster recovery.
- Use D1's time-travel feature to query the database at a previous point in time for investigation or recovery.
- Test restore procedures regularly — do not assume backups work without verification.
