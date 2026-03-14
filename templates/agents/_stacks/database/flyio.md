# Fly.io Postgres Database Stack

## Cluster Setup

- Create a Postgres cluster with `fly postgres create --name <app-name>-db --region <region>`.
- Attach the database to an application with `fly postgres attach <db-app-name>` — this sets the `DATABASE_URL` secret automatically.
- Use `fly postgres connect -a <db-app-name>` to open an interactive psql session for ad-hoc queries.

## Connection Configuration

- Use the internal connection string (`postgres://...flycast:5432/...`) for applications running on Fly.io — traffic stays on the private network.
- Use `fly proxy 5432 -a <db-app-name>` to tunnel to the database from your local machine for development and debugging.
- Store connection strings in secrets via `fly secrets set DATABASE_URL=...` — never commit them to source control.
- Use a connection pooler (PgBouncer is included) on port 6432 for serverless or high-concurrency workloads.

## Read Replicas

- Add read replicas in different regions with `fly machine clone <machine-id> --region <region> -a <db-app-name>`.
- Direct read-heavy queries to replicas using the read-only connection string to reduce load on the primary.
- Be aware of replication lag — avoid reading immediately after a write if consistency is required.

## Volume Management and Storage

- Fly.io Postgres stores data on persistent volumes — monitor disk usage with `fly volumes list -a <db-app-name>`.
- Extend volumes with `fly volumes extend <vol-id> -s <size-gb>` before running out of space.
- Set alerts for disk usage thresholds to avoid unexpected write failures.

## Backup Strategies

- Fly.io Postgres uses WAL-based continuous archival for point-in-time recovery.
- Create manual snapshots with `fly volumes snapshots list -a <db-app-name>` and restore as needed.
- Run periodic `pg_dump` backups to external storage (S3 or equivalent) for offsite disaster recovery.
- Test restore procedures regularly — do not assume backups work without verification.

## Scaling

- Scale vertically with `fly scale vm <size> -a <db-app-name>` to increase CPU and memory (e.g., `shared-cpu-2x`, `performance-2x`).
- Scale horizontally by adding read replicas in target regions to distribute read traffic.
- Monitor resource utilisation with `fly postgres status -a <db-app-name>` and scale proactively before hitting limits.

## High Availability

- Deploy with `--initial-cluster-size 3` for automatic leader election and failover.
- Stolon manages replication and failover — the cluster promotes a replica if the primary becomes unavailable.
- Place cluster members across multiple availability zones within a region for resilience.
- Verify HA status with `fly postgres status -a <db-app-name>` and confirm all members are healthy.

## Monitoring

- Use `fly postgres status -a <db-app-name>` to check cluster health, replication state, and resource usage.
- Use `fly logs -a <db-app-name>` to inspect Postgres logs for slow queries, errors, and connection issues.
- Configure external monitoring (e.g., Prometheus with `pg_exporter`) for production-grade observability.

## Migration Strategies

- Run migrations via the Fly.io release command in `fly.toml`: `[deploy] release_command = "npx prisma migrate deploy"`.
- Alternatively, run migrations as a one-off machine: `fly machine run ... --command "npx prisma migrate deploy"`.
- Always run migrations against the primary (read-write) connection string — never against a replica.
- Keep migrations small, incremental, and reversible where possible.
- For large tables, prefer online schema changes (add column, backfill, then add constraint) over locking operations.
