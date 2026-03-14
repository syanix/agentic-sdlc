# Cloudflare Workers Patterns

## Hono Framework

- Use Hono as the routing framework for structured request handling
- Define route groups with `app.route()` to organise endpoints by feature
- Use Hono's context (`c`) for request parsing, response building, and accessing bindings
- Apply middleware with `app.use()` for auth, CORS, logging, and error handling
- Access environment bindings via `c.env` rather than global variables

```typescript
const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());
app.use('/api/*', authMiddleware);
app.route('/api/users', userRoutes);
export default app;
```

---

## D1 Database

- Use Drizzle ORM for type-safe schema definition and query building
- Define schemas in a shared `schema.ts` file with Drizzle's SQLite column builders
- Run migrations locally with `wrangler d1 migrations apply` and in production via CI
- Use `db.batch()` for multiple operations that should execute in a single round trip
- Prefer prepared statements over raw SQL to avoid injection risks
- Keep queries simple; D1 is SQLite-based and does not support all PostgreSQL features

---

## KV Storage

- Design keys with hierarchical prefixes for efficient listing: `user:{id}:profile`
- Use metadata to store small auxiliary data alongside values without extra reads
- Set expiration (`expirationTtl`) on cache-like entries to avoid stale data
- Use `list()` with prefix filters for paginated retrieval of related keys
- Remember KV is eventually consistent; do not use it for data requiring strong consistency

---

## R2 Object Storage

- Generate presigned URLs for direct client uploads to avoid proxying large files through the Worker
- Set lifecycle rules to automatically delete temporary or expired objects
- Use custom metadata on objects for tagging and filtering
- Organise objects with path prefixes: `uploads/{user_id}/{timestamp}/{filename}`
- Handle multipart uploads for files larger than the Worker memory limit
- Return appropriate `Content-Type` and `Cache-Control` headers when serving objects

---

## Durable Objects

- Use Durable Objects for strongly consistent, stateful coordination (counters, rate limiters, sessions)
- Store state with `this.ctx.storage` for transactional key-value access
- Use alarms (`this.ctx.storage.setAlarm()`) for scheduled future execution
- Implement WebSocket handling in Durable Objects for real-time collaboration
- Keep Durable Object logic minimal; delegate complex processing to separate Workers
- Use `idFromName()` for deterministic routing to the same instance

---

## Environment Bindings

- Declare all bindings in `wrangler.toml`: D1 databases, KV namespaces, R2 buckets, secrets
- Define a TypeScript `Env` interface matching your bindings for type safety
- Use `wrangler secret put` for sensitive values; never commit secrets to source control
- Use `vars` in `wrangler.toml` for non-sensitive configuration values
- Separate bindings per environment with `[env.staging]` and `[env.production]` sections

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "xxx"

[vars]
ENVIRONMENT = "production"
```

---

## Edge Constraints

- Keep Worker execution within the CPU time limit (10ms free, 30s paid)
- Minimise memory usage; Workers have a 128MB limit per isolate
- Avoid large in-memory data structures; stream responses where possible
- Be aware of cold start behaviour; keep the global scope lightweight
- Use `waitUntil()` for non-blocking background work (analytics, logging) after the response
- Bundle dependencies carefully; large bundles increase cold start latency

---

## Error Handling

- Wrap route handlers in try/catch blocks; unhandled exceptions return 500 with no body
- Return structured JSON error responses with `status`, `message`, and `code` fields
- Use Hono's `onError` handler for global exception catching
- Log errors to an external service via `waitUntil()` to avoid blocking the response
- Validate request bodies early and return 400 with descriptive validation errors
- Handle D1 and KV errors specifically; they may throw on quota limits or timeouts
