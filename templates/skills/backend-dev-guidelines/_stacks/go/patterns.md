# Go Backend Patterns

## Project Layout

- Follow the standard Go project layout conventions
- Place application entry points in `cmd/`, internal packages in `internal/`, and shared libraries in `pkg/`
- Keep `main.go` thin: parse config, wire dependencies, start the server

```
cmd/
  api/
    main.go
internal/
  config/
    config.go
  handler/
    user_handler.go
  service/
    user_service.go
  repository/
    user_repository.go
  model/
    user.go
  middleware/
    auth.go
    logging.go
pkg/
  httperr/
    errors.go
```

---

## Interface-Driven Design

- Accept interfaces, return concrete structs
- Define interfaces in the package that consumes them, not the one that implements them
- Keep interfaces small: prefer one or two methods over large contracts
- Use interface composition to build larger contracts from smaller ones

```go
// Defined in the service package, not the repository package
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*model.User, error)
    Create(ctx context.Context, user *model.User) error
}
```

---

## Error Handling

- Define custom error types for domain-specific failures
- Wrap errors with `fmt.Errorf("context: %w", err)` to preserve the chain
- Use `errors.Is()` for sentinel comparisons and `errors.As()` for type assertions
- Return errors rather than panicking; reserve `panic` for truly unrecoverable states
- Centralise error-to-HTTP mapping in the handler or middleware layer

---

## Context Propagation

- Pass `context.Context` as the first parameter to every function that does I/O
- Set timeouts on outbound calls: `context.WithTimeout(ctx, 5*time.Second)`
- Check `ctx.Err()` before starting expensive operations
- Store request-scoped values (request ID, user claims) in context using typed keys
- Never store mutable state or optional dependencies in context

---

## Concurrency Patterns

- Launch goroutines with clear ownership and lifecycle management
- Use `errgroup.Group` for parallel tasks that must all succeed or fail together
- Prefer channels for communication between goroutines; use `sync.Mutex` for shared state protection
- Always handle goroutine cancellation via context
- Use `sync.WaitGroup` when you need to wait for goroutines but do not need error propagation
- Buffer channels appropriately to avoid goroutine leaks

```go
g, ctx := errgroup.WithContext(ctx)
g.Go(func() error { return fetchUsers(ctx) })
g.Go(func() error { return fetchOrders(ctx) })
if err := g.Wait(); err != nil {
    return fmt.Errorf("parallel fetch: %w", err)
}
```

---

## Middleware Patterns

- Structure middleware as functions that accept and return `http.Handler` or framework-specific handlers
- Chain middleware in a consistent order: recovery, logging, auth, request ID
- Keep middleware focused on a single concern
- Use Gin's `c.Next()` and `c.Abort()` or Echo's `next(c)` for control flow
- Extract common request data (user ID, tenant) in middleware and set it on context

---

## Database Access

- Use `sqlc` to generate type-safe Go code from SQL queries
- Wrap generated code in a repository struct for testability
- Use `pgx` as the underlying PostgreSQL driver for connection pooling and performance
- Run migrations with `golang-migrate` or `goose` as part of the deployment pipeline
- Use transactions for multi-step writes: begin, defer rollback, commit on success

---

## Configuration

- Load configuration from environment variables using `envconfig` or `viper`
- Define a strongly typed config struct and validate all fields at startup
- Fail fast if required configuration is missing or invalid
- Separate config by concern: `DatabaseConfig`, `AuthConfig`, `ServerConfig`
- Never read environment variables directly in business logic; inject config via the struct
