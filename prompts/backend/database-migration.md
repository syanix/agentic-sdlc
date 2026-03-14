---
name: Database Migration
domain: backend
complexity: high
works-with: [architect agent, /feature command]
---

# Database Migration

## When to Use

Use this prompt when you need to create a database schema migration, whether adding tables, modifying columns, or performing data transformations.

## The Prompt

You are a database engineer designing a schema migration.

Create a migration for: [MIGRATION_PURPOSE]

### Context

- **ORM / Migration tool**: [ORM_TOOL]
- **Current schema**: [CURRENT_SCHEMA]
- **Target schema**: [TARGET_SCHEMA]
- **Database engine**: PostgreSQL (adjust if different)

### Implementation Checklist

1. Generate a timestamped migration file using the ORM's CLI
2. Write the `up` migration with all DDL changes
3. Write the `down` migration that fully reverses every change
4. Add data backfill logic if existing rows need transformation
5. Test the migration against a copy of production data
6. Verify rollback restores the schema and data to the prior state
7. Document any manual steps required before or after deployment

### Migration Safety Rules

- Never drop a column in the same release that stops writing to it
- Add new NOT NULL columns with a DEFAULT value first, backfill, then remove the default if needed
- Use `IF NOT EXISTS` / `IF EXISTS` guards for idempotent re-runs
- Wrap destructive operations in a transaction where the database supports transactional DDL
- Keep each migration focused on a single logical change

### Naming Convention

```
YYYYMMDDHHMMSS_[descriptive_name].[ext]
Example: 20260314120000_add_organisation_settings_table.sql
```

## Variations

### Add New Table
Define columns, types, constraints, and indices. Include foreign keys with
appropriate `ON DELETE` behaviour (CASCADE, SET NULL, RESTRICT).
Always add `created_at` and `updated_at` timestamp columns.

### Modify Existing Columns
Rename columns using a multi-phase approach:
1. Add new column
2. Dual-write to both columns
3. Backfill old rows
4. Switch reads to new column
5. Stop writing to old column
6. Drop old column in a later release

### Data Migration
Separate schema changes from data changes. Run data migrations as a distinct step
so they can be retried independently. Use batched updates to avoid locking tables.

## Tips

- **Zero-downtime**: Assume the application is running during migration. Additive changes (new tables, new nullable columns) are safe. Destructive changes require a phased approach.
- **Rollback safety**: Always test `down` migrations. If a migration is irreversible (e.g. dropping data), document it clearly and require manual approval.
- **Performance**: Large table alterations can lock rows. Use `ALTER TABLE ... ADD COLUMN` with defaults (Postgres 11+) to avoid full table rewrites.
- **Backups**: Take a snapshot before running migrations in production. Automate this in CI/CD.
- **Indices**: Create indices `CONCURRENTLY` on large tables to avoid blocking writes.
- Track migration state in a `schema_migrations` table — never skip or reorder migrations.
