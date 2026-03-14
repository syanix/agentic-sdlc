# Go Backend Stack

## Project Layout

Follow the standard Go project layout. Keep `main.go` thin — it wires dependencies and starts the server.

```
cmd/
  api/
    main.go              # entrypoint — parse config, wire deps, start server
internal/
  handler/               # HTTP handlers (controllers)
  service/               # business logic
  repository/            # database access
  domain/                # pure structs, interfaces, domain errors
  middleware/             # logging, auth, recovery, CORS
  config/                # configuration loading
pkg/                     # shared utilities safe for external import
migrations/              # SQL migration files
```

- **cmd/**: Application entrypoints. One directory per binary.
- **internal/**: Private application code. The Go compiler enforces import boundaries.
- **pkg/**: Reusable library code. Only create when genuinely shared across projects.

## Router and Middleware

- Use Gin or Echo for HTTP routing. Prefer Echo for its cleaner middleware API.
- Group routes by resource under versioned prefixes (`/api/v1/users`).
- Apply middleware in order: recovery, request ID, structured logging, CORS, authentication, authorisation.
- Use route groups to scope middleware — apply auth only to protected routes.

## Database Access

- Prefer **sqlc** for type-safe SQL. Write raw SQL queries in `.sql` files and generate Go code.
- Use **GORM** only when rapid prototyping justifies the abstraction cost.
- Use **pgx** as the underlying PostgreSQL driver for connection pooling and performance.
- Run migrations with `golang-migrate/migrate` or `goose`. Never auto-migrate in production.
- Always use prepared statements or parameterised queries — never concatenate SQL.

## Error Handling

- Define domain error types in `internal/domain/errors.go`. Use sentinel errors for expected conditions.
- Wrap errors with `fmt.Errorf("operation failed: %w", err)` to preserve the error chain.
- Create an `AppError` struct with fields for HTTP status, user message, and internal detail.
- Map domain errors to HTTP status codes in handlers — never leak internal errors to clients.
- Check errors immediately. Never use `_` to discard an error return value.

## Context Propagation

- Pass `context.Context` as the first parameter to every function that performs I/O.
- Store request-scoped values (request ID, user claims) in context using typed keys.
- Use context for cancellation and timeouts on database queries and external calls.
- Set appropriate timeouts: HTTP server read/write, database queries, external API calls.

## Graceful Shutdown

- Listen for `SIGINT` and `SIGTERM` signals.
- Call `server.Shutdown(ctx)` with a timeout context (e.g., 30 seconds).
- Close database connections, flush loggers, and drain queues before exiting.

## Dependency Injection

- Prefer **manual dependency injection** via constructor functions. Pass interfaces, not concrete types.
- Use Google **Wire** only for large applications with complex dependency graphs.
- Define interfaces in the package that consumes them, not the package that implements them.

## Configuration

- Use **envconfig** or **Viper** to load configuration from environment variables.
- Define a typed `Config` struct with validation tags.
- Load configuration once at startup. Pass the config struct down — never read `os.Getenv` in business logic.
- Validate all required configuration values at startup. Fail fast on missing values.

## Health Checks

- Expose `/healthz` (liveness) and `/readyz` (readiness) endpoints.
- Liveness: return 200 if the process is running.
- Readiness: check database connectivity and downstream dependencies. Return 503 if unhealthy.

## Structured Logging

- Use **slog** (standard library, Go 1.21+) for structured logging.
- Log in JSON format in production. Use text format for local development.
- Include request ID, method, path, status code, and duration in every request log entry.
- Log at appropriate levels: `Error` for failures, `Warn` for recoverable issues, `Info` for key events, `Debug` for development detail.

## API Documentation

- Use **swaggo/swag** to generate OpenAPI specs from Go annotations.
- Annotate handlers with `@Summary`, `@Description`, `@Param`, `@Success`, `@Failure`, `@Router`.
- Serve Swagger UI at `/swagger/` in non-production environments.
- Run `swag init` as part of the build process to keep documentation in sync.

## Testing

- Place unit tests alongside source files (`service_test.go` next to `service.go`).
- Use table-driven tests for comprehensive input coverage.
- Define interfaces for external dependencies and use mock implementations in tests.
- Use `testcontainers-go` for integration tests that require a real database.
- Run `go vet` and `staticcheck` in CI. Enable the race detector with `-race` for test runs.

## Response Format

- Return consistent JSON response envelopes:
  ```json
  { "data": {}, "meta": { "total": 100, "page": 1, "limit": 20 } }
  ```
- Return errors in a consistent format:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "Resource not found" } }
  ```
- Use appropriate HTTP status codes. Return 201 for resource creation, 204 for successful deletion.
