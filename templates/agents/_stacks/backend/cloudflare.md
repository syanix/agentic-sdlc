# Cloudflare Workers Backend Stack

## Project Structure

Organise the project with clear separation between routing, business logic, and data access.

```
src/
  index.ts               # Hono app entrypoint, middleware, route registration
  routes/                # route definitions grouped by resource
  services/              # business logic layer
  repositories/          # D1/KV/R2 data access
  middleware/            # custom middleware (auth, logging, CORS)
  types/                 # TypeScript types and Zod schemas
  utils/                 # shared utilities
wrangler.toml            # Wrangler configuration and bindings
migrations/              # D1 SQL migration files
```

## Hono Framework

- Use Hono as the routing and middleware framework. It is lightweight and optimised for edge runtimes.
- Group routes by resource:
  ```typescript
  const users = new Hono<{ Bindings: Env }>()
    .get('/', listUsers)
    .post('/', createUser)
    .get('/:id', getUserById);
  app.route('/api/v1/users', users);
  ```
- Use Hono's built-in middleware: `cors()`, `logger()`, `secureHeaders()`, `timing()`.
- Define typed environment bindings with a `Bindings` interface for full type safety.
- Use Zod with `@hono/zod-validator` for request validation.

## D1 Database

- Use D1 as the primary relational database. Access it via the `env.DB` binding.
- Use **Drizzle ORM** for type-safe queries and schema management.
- Define schemas in `src/db/schema.ts` using Drizzle's SQLite-compatible column types.
- Generate migrations with `drizzle-kit generate`. Apply with `wrangler d1 migrations apply <db>`.
- Always use parameterised queries. Never concatenate user input into SQL strings.
- Use `db.batch()` for transactional multi-statement operations.
- Add `created_at` and `updated_at` columns to all tables. D1 uses SQLite, so use `INTEGER` for timestamps.

## KV Storage

- Use Workers KV for key-value data with eventual consistency (suitable for configuration, caching, feature flags).
- Access via the `env.MY_KV` binding. Define it in `wrangler.toml` under `[[kv_namespaces]]`.
- Use `put()` with expiration for cache entries: `await env.MY_KV.put(key, value, { expirationTtl: 3600 })`.
- Store metadata alongside values using the `metadata` option for efficient listing.
- Use `list()` with prefix filtering for namespace-style key organisation.
- Remember KV is eventually consistent — do not use it for data that requires strong consistency.

## R2 Object Storage

- Use R2 for file storage (uploads, media, documents). Access via the `env.MY_BUCKET` binding.
- Use `put()` for uploads and `get()` for downloads. Stream large files with `body` as a `ReadableStream`.
- Set appropriate `httpMetadata` (content type, cache control) on upload.
- Organise objects with path-style keys: `{user_id}/{category}/{filename}`.
- Use presigned URLs for direct client uploads when files are large.

## Durable Objects

- Use Durable Objects for strongly consistent, stateful coordination (counters, rate limiters, collaboration sessions).
- Define a Durable Object class that extends `DurableObject`. Bind it in `wrangler.toml` under `[[durable_objects.bindings]]`.
- Use the built-in transactional storage API: `this.ctx.storage.get()`, `this.ctx.storage.put()`.
- Route requests to a specific Durable Object instance using `env.MY_DO.idFromName(key)`.
- Keep Durable Object logic minimal. They are charged per-millisecond of active compute.

## Wrangler CLI

- Use `wrangler dev` for local development with hot reload. It emulates bindings locally.
- Use `wrangler deploy` to publish to Cloudflare's edge network.
- Define bindings in `wrangler.toml`: D1 databases, KV namespaces, R2 buckets, Durable Objects, secrets.
- Use `wrangler secret put <NAME>` for sensitive values. Never commit secrets to `wrangler.toml`.
- Use `wrangler tail` to stream live logs from production workers.

## Environment Bindings and Secrets

- Define a TypeScript `Env` interface that mirrors all bindings declared in `wrangler.toml`:
  ```typescript
  interface Env {
    DB: D1Database;
    MY_KV: KVNamespace;
    MY_BUCKET: R2Bucket;
    API_SECRET: string;
  }
  ```
- Access bindings through the `env` parameter passed to the fetch handler or Hono context.
- Use separate `wrangler.toml` environments (`[env.staging]`, `[env.production]`) for stage-specific configuration.
- Never hardcode secrets. Use `wrangler secret put` and access via `env.SECRET_NAME`.

## Error Handling

- Create a custom error class with status code, error code, and user-facing message.
- Use Hono's `app.onError()` for global error handling. Return consistent JSON error responses:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "Resource not found" } }
  ```
- Catch and handle D1 errors specifically — check for constraint violations and map to appropriate status codes.
- Log errors with structured context. Use `console.log()` with JSON objects — Workers support structured logging via `wrangler tail`.

## Edge Constraints

- **CPU time limit**: 10ms on the free plan, 30s on the paid plan (per request). Offload heavy computation.
- **Memory limit**: 128MB per Worker. Avoid loading large datasets into memory — stream instead.
- **Subrequest limit**: 50 subrequests per request (free) or 1000 (paid). Batch external API calls.
- **No Node.js built-ins** by default. Use the `nodejs_compat` compatibility flag in `wrangler.toml` for partial Node.js API support.
- Avoid blocking operations. All I/O must be asynchronous.
- Workers have no persistent filesystem. Use KV, R2, or D1 for all storage needs.

## Health Checks

- Expose a `/health` endpoint that returns 200 with basic service information.
- Check D1 connectivity with a lightweight query (`SELECT 1`).
- Include the Worker version or deployment ID in the health response for debugging.
