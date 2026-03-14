# Supabase Backend Stack

## Client Setup

- Install `@supabase/supabase-js` and initialise the client with project URL and anon key.
- Create a single shared client instance. Never instantiate multiple clients.
- Use `createClient()` for client-side code with the anon key.
- Use `createClient()` with the service role key only in trusted server-side environments — never expose it to the browser.
- Generate TypeScript types with `supabase gen types typescript --project-id <id> > src/types/database.ts`.
- Pass the generated `Database` type to `createClient<Database>()` for full type safety on all queries.

## Row Level Security (RLS)

- **Always enable RLS** on every table. A table without RLS is publicly accessible to any authenticated or anonymous user.
- Create policies that grant the minimum required access. Prefer restrictive policies over permissive ones.
- Use `auth.uid()` in policies to scope data to the authenticated user:
  ```sql
  CREATE POLICY "Users can read own data"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);
  ```
- Create separate policies for each operation: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- Use `auth.jwt() ->> 'role'` for role-based access control.
- Test RLS policies thoroughly — use the SQL editor with `set role authenticated` and `set request.jwt.claims` to simulate requests.

## Edge Functions

- Write Edge Functions in TypeScript using the Deno runtime.
- Place functions in `supabase/functions/<function-name>/index.ts`.
- Use `Deno.serve()` as the entrypoint. Parse the request and return a `Response`.
- Import the Supabase client from `@supabase/supabase-js` using `esm.sh` or import maps.
- Access environment variables with `Deno.env.get()`. Set secrets with `supabase secrets set`.
- Use Edge Functions for business logic that cannot be expressed in RLS or database functions.
- Always validate input. Return appropriate HTTP status codes and JSON error responses.

## Realtime Subscriptions

- Subscribe to database changes using `supabase.channel()` with the `postgres_changes` event.
- Specify the event type (`INSERT`, `UPDATE`, `DELETE`, `*`) and filter by table and conditions.
- Enable Realtime on specific tables in the Supabase dashboard or via SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE <table>`.
- Always unsubscribe when the component unmounts or the subscription is no longer needed.
- Use Realtime Broadcast for ephemeral messages (cursors, presence) that do not need persistence.

## Storage

- Create buckets with appropriate access policies. Use private buckets by default.
- Set RLS policies on the `storage.objects` table to control upload and download access.
- Use `supabase.storage.from('bucket').upload()` for file uploads. Generate signed URLs for time-limited access.
- Set file size limits and allowed MIME types per bucket.
- Organise files using path prefixes that include the user ID: `{user_id}/{filename}`.

## Authentication

- Use Supabase Auth for email/password, magic link, and OAuth providers.
- Configure OAuth providers (Google, GitHub, etc.) in the Supabase dashboard.
- Use `supabase.auth.signInWithOAuth()` for social login. Use `supabase.auth.signUp()` for email registration.
- Listen for auth state changes with `supabase.auth.onAuthStateChange()`.
- Protect API routes by checking the session: `const { data: { user } } = await supabase.auth.getUser()`.
- Never trust `getSession()` alone for authorisation — always verify with `getUser()` for server-side checks.

## Database Functions and Triggers

- Use PostgreSQL functions for complex business logic that must run atomically.
- Create functions with `SECURITY DEFINER` when they need to bypass RLS (e.g., admin operations). Always set `search_path` explicitly.
- Call database functions from the client with `supabase.rpc('function_name', { params })`.
- Use triggers for automatic side effects: audit logs, updated timestamps, data denormalisation.
- Prefer `BEFORE` triggers for validation and `AFTER` triggers for side effects.

## Migration Patterns

- Use the Supabase CLI for local development: `supabase start`, `supabase db reset`.
- Create migrations with `supabase migration new <name>`. Write raw SQL in migration files.
- Always include both `UP` and rollback logic. Test migrations against a local instance before applying.
- Use `supabase db push` for applying migrations to a remote project.
- Seed data using `supabase/seed.sql` for local development.

## Error Handling

- Check for errors on every Supabase client call: `const { data, error } = await supabase.from(...).select()`.
- Never assume `data` is populated without checking `error` first.
- Map Supabase error codes to user-friendly messages. Handle common codes: `23505` (unique violation), `42501` (insufficient privilege), `PGRST116` (not found).
- Wrap Supabase calls in service functions that provide consistent error handling.

## Local Development

- Use `supabase init` to set up the local project. Run `supabase start` for a full local stack.
- Use the local Studio UI at `http://localhost:54323` for database inspection.
- Run `supabase gen types typescript --local > src/types/database.ts` to regenerate types after schema changes.
- Use `supabase functions serve` for local Edge Function development with hot reload.
