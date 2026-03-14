# Neon Postgres Database Stack

## Neon Branching

- Use Neon branches to isolate development and preview environments from production.
- Create a branch per pull request or feature using the Neon CLI or API: `neon branches create --name feature/xyz`.
- Preview branches inherit the production schema and a snapshot of the data — no manual seeding required.
- Delete branches when the PR is merged to avoid unnecessary compute costs.
- Use the Neon GitHub integration for automatic branch creation and cleanup on PR lifecycle events.

## Connection Configuration

- Use the Neon serverless driver (`@neondatabase/serverless`) for edge and serverless environments.
- Use connection pooling via Neon's built-in PgBouncer endpoint for long-lived server processes.
- Connection string format: `postgres://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`.
- Use the pooled connection string (port 5432 with `-pooler` suffix) for application queries.
- Use the direct connection string (port 5432, no pooler) for migrations and schema changes.
- Store connection strings in environment variables — never commit them to source control.

## Serverless Driver Usage

- Import from `@neondatabase/serverless` for HTTP-based queries in edge runtimes.
- Use `neon()` for one-shot SQL queries over HTTP — ideal for serverless functions and edge routes.
- Use `Pool` from the serverless driver for WebSocket-based connections when you need transactions or multiple queries.
- Enable `fetchConnectionCache: true` for connection reuse across invocations in serverless environments.

## Migration Strategies

- Use Prisma Migrate as the primary migration tool: `npx prisma migrate dev` for development, `npx prisma migrate deploy` for production.
- Always run migrations against the direct (non-pooled) connection string.
- Test migrations on a Neon branch before applying to production.
- Keep migrations small, incremental, and reversible where possible.
- For large tables, prefer online schema changes (add column with default, backfill, then add constraint) over locking operations.

## Schema Management

- Define the schema in `prisma/schema.prisma` — it is the single source of truth.
- Use `npx prisma db pull` to introspect an existing Neon database into the schema file if bootstrapping.
- Run `npx prisma generate` after every schema change to update the client.
- Review generated SQL with `npx prisma migrate diff` before applying.

## Performance Considerations

- Neon computes scale to zero after inactivity — expect cold start latency of 300-500ms on first connection.
- Use Neon's autoscaling to handle traffic spikes without manual intervention.
- Configure `min_compute_size` to keep the compute warm for latency-sensitive workloads.
- Use connection pooling to minimise connection overhead.
- Add indexes on foreign keys and frequently filtered columns.
- Use `EXPLAIN ANALYSE` to profile slow queries and optimise with indexes or query rewrites.

## Backup and Restore

- Neon provides point-in-time restore (PITR) within the configured history retention window.
- Use Neon branching as a lightweight alternative to traditional backups — branch from any point in time.
- For disaster recovery, create a branch from the desired restore point and promote it to the primary.
- Export data periodically with `pg_dump` for offsite backup if required by compliance.
- Test restore procedures regularly — do not assume backups work without verification.
