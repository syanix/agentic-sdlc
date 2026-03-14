# Supabase Postgres Database Stack

## Row Level Security (RLS)

- Enable RLS on every table: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY`.
- Define policies for each operation — SELECT, INSERT, UPDATE, DELETE — rather than using broad permissive rules.
- Use `auth.uid()` to scope policies to the authenticated user: `USING (user_id = auth.uid())`.
- For INSERT policies, use `WITH CHECK` to validate data on write.
- Prefer specific policies over complex combined ones — multiple simple policies are easier to reason about and audit.
- Always test policies with different user roles before deploying to production.

## Database Functions and Triggers

- Use PL/pgSQL functions for complex operations that should run close to the data.
- Expose functions to the API via `CREATE OR REPLACE FUNCTION` in the `public` schema — Supabase auto-generates REST endpoints.
- Mark functions as `SECURITY DEFINER` only when they need to bypass RLS; prefer `SECURITY INVOKER` by default.
- Use triggers for automated actions such as updating `updated_at` timestamps or maintaining audit logs.
- Define trigger functions separately from trigger bindings for reusability.

## Realtime

- Enable Realtime on specific tables via the Supabase dashboard or by adding the table to the `supabase_realtime` publication.
- Subscribe to changes in the client using `supabase.channel('channel').on('postgres_changes', ...)`.
- Filter subscriptions by event type (INSERT, UPDATE, DELETE) and column values to minimise unnecessary traffic.
- Disable Realtime on tables with high write throughput unless the application genuinely needs live updates.

## Migrations

- Create migrations with `supabase migration new <name>` — this generates a timestamped SQL file in `supabase/migrations/`.
- Apply migrations locally with `supabase db reset` to rebuild from scratch, or `supabase migration up` for incremental application.
- Push migrations to a hosted project with `supabase db push`.
- Keep each migration focused on a single concern — do not combine schema changes with data backfills.
- Review generated SQL before pushing; never blindly apply auto-generated diffs to production.

## Connection Configuration

- Use the pooled connection string (Supavisor, port 6543) for application queries in serverless and edge environments.
- Use the direct connection string (port 5432) for migrations, schema changes, and long-running administrative queries.
- Store connection strings in environment variables — never commit them to source control.
- Configure connection pool mode (transaction or session) based on the application's query patterns.

## Type Generation

- Generate TypeScript types from the database schema with `supabase gen types typescript --project-id <ref> > src/types/database.ts`.
- Regenerate types after every migration to keep the client in sync with the schema.
- Use the generated types with the Supabase client for end-to-end type safety: `createClient<Database>(url, key)`.

## Performance Considerations

- Add indexes on foreign keys, frequently filtered columns, and columns used in RLS policies.
- Use connection pooling via Supavisor to minimise connection overhead in serverless deployments.
- Use `EXPLAIN ANALYSE` to profile slow queries and optimise with indexes or query rewrites.
- Prefer database functions over multiple round trips from the client for complex transactional logic.

## Backup and Restore

- Supabase provides automatic daily backups and point-in-time recovery (PITR) on Pro plans and above.
- Use `pg_dump` via the direct connection string for manual offsite backups.
- Test restore procedures regularly — do not assume backups work without verification.
- For disaster recovery, restore from a PITR snapshot to a specific point in time via the Supabase dashboard.
