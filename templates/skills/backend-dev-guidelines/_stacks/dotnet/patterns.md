# .NET Backend Patterns

## Minimal API Organisation

- Group related endpoints using `MapGroup()` with a shared prefix
- Define endpoint methods in static classes organised by feature: `UserEndpoints`, `OrderEndpoints`
- Register all endpoint groups in `Program.cs` via extension methods
- Use `TypedResults` for compile-time response type checking
- Apply filters and metadata (auth, validation) at the group level where possible

```csharp
app.MapGroup("/api/users")
   .WithTags("Users")
   .RequireAuthorization()
   .MapUserEndpoints();
```

---

## Entity Framework Core

- Define one `DbContext` per bounded context; avoid a single monolithic context
- Use Fluent API configuration in `IEntityTypeConfiguration<T>` classes, not data annotations
- Enable query splitting for includes: `AsSplitQuery()` to avoid cartesian explosion
- Use `AsNoTracking()` for read-only queries to improve performance
- Run migrations via `dotnet ef migrations add` and `dotnet ef database update`
- Optimise queries by selecting only needed columns with `.Select()` projections

---

## Dependency Injection

- Register services with appropriate lifetimes: `Scoped` for per-request, `Singleton` for stateless, `Transient` for lightweight
- Use keyed services (`.AddKeyedScoped()`) for multiple implementations of the same interface
- Prefer constructor injection; avoid the service locator pattern
- Register options and configuration before services that depend on them
- Use `IServiceScopeFactory` when resolving scoped services from singletons

---

## Middleware Pipeline

- Order middleware carefully: exception handling first, then logging, auth, CORS, endpoints
- Create custom middleware as classes implementing `IMiddleware` or as inline delegates
- Use `UseExceptionHandler` with `ProblemDetails` for standardised error responses
- Apply `UseRouting()` before `UseAuthentication()` and `UseAuthorization()`
- Keep middleware focused on a single cross-cutting concern

```csharp
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();
app.MapEndpoints();
```

---

## Options Pattern

- Bind configuration sections to strongly typed classes using `IOptions<T>`
- Use `IOptionsSnapshot<T>` for scoped access to reloadable configuration
- Validate options at startup with `ValidateDataAnnotations()` or `ValidateOnStart()`
- Define default values in the options class constructor
- Keep options classes in the feature they belong to, not in a central location

---

## Results Pattern

- Return `Results<Ok<T>, NotFound, ValidationProblem>` from endpoint methods for type safety
- Use `TypedResults.Ok()`, `TypedResults.NotFound()`, `TypedResults.Problem()` factory methods
- Map domain exceptions to `ProblemDetails` responses with appropriate status codes
- Include `traceId` in problem details for production traceability
- Define a consistent error envelope: `type`, `title`, `status`, `detail`, `errors`

---

## Background Services

- Implement `BackgroundService` for long-running tasks (queue consumers, schedulers)
- Use `IHostedService` for startup/shutdown lifecycle hooks
- Handle cancellation via `CancellationToken` in `ExecuteAsync`
- Use channels (`Channel<T>`) for producer-consumer patterns between request handlers and background workers
- Log exceptions in background services; unhandled exceptions can terminate the host
- Configure graceful shutdown timeout in host options

---

## Configuration

- Use `appsettings.json` for defaults and `appsettings.{Environment}.json` for overrides
- Store secrets locally with `dotnet user-secrets`; use a vault in production
- Access configuration via the Options pattern, never `IConfiguration` directly in services
- Validate all required configuration at startup to fail fast
- Use environment variables for container deployments, following the `__` separator convention
