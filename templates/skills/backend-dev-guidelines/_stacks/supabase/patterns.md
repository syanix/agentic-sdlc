# Supabase Patterns

## Row Level Security

- Enable RLS on every table: `ALTER TABLE items ENABLE ROW LEVEL SECURITY;`
- Use `auth.uid()` to scope rows to the authenticated user
- Define separate policies for SELECT, INSERT, UPDATE, and DELETE operations
- Use role-based policies with a `user_roles` table or JWT claims for authorisation
- Avoid overly permissive policies; default to deny and explicitly grant access
- Test policies thoroughly — a missing policy silently returns empty results

```sql
CREATE POLICY "Users can read own data"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all data"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Edge Functions

- Write Edge Functions in TypeScript using the Deno runtime
- Parse request method and body manually; use `Deno.serve` for the handler
- Set CORS headers in a shared utility and apply to all responses
- Return early for `OPTIONS` preflight requests
- Use `createClient` from `@supabase/supabase-js` with the service role key for admin operations
- Keep functions focused on a single responsibility; split complex workflows into multiple functions

---

## Database Functions

- Use PL/pgSQL functions for complex logic that benefits from running close to the data
- Create triggers for automatic timestamps (`updated_at`), audit logging, and computed values
- Use `SECURITY DEFINER` sparingly and only when bypassing RLS is intentional
- Set `search_path` explicitly on security definer functions to prevent search path attacks
- Prefer `RETURNS SETOF` for functions that return multiple rows
- Use `NOTIFY` / `LISTEN` for internal event propagation

---

## Realtime

- Subscribe to database changes with channel filters: `schema`, `table`, `event`, `filter`
- Use Presence for tracking online users, cursors, or typing indicators
- Use Broadcast for ephemeral messages that do not need persistence
- Unsubscribe from channels when components unmount to prevent memory leaks
- Handle reconnection gracefully; Realtime channels auto-reconnect but state must be re-synced

```typescript
const channel = supabase
  .channel('room-1')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => handleNewMessage(payload.new))
  .subscribe();
```

---

## Client SDK Patterns

- Generate TypeScript types from the database schema: `supabase gen types typescript`
- Pass generated types to `createClient<Database>()` for end-to-end type safety
- Handle errors explicitly; Supabase returns `{ data, error }` rather than throwing
- Use `.single()` when expecting exactly one row; it returns an error if zero or multiple rows match
- Chain `.select()` with specific columns to reduce payload size

---

## Storage

- Create separate buckets for public and private assets
- Define bucket-level RLS policies for upload, download, and delete operations
- Use signed URLs for time-limited access to private files
- Apply image transformations via URL parameters: `width`, `height`, `resize`
- Set file size and MIME type restrictions on bucket configuration
- Organise files with path prefixes: `{user_id}/{category}/{filename}`

---

## Type Safety

- Regenerate types after every migration: integrate `supabase gen types` into the CI pipeline
- Use the generated `Database` type to type all client queries and responses
- Create helper types for common patterns: `Tables<'users'>`, `Insertable<'users'>`
- Validate Edge Function request bodies with Zod schemas
- Keep generated types in version control for visibility into schema changes
