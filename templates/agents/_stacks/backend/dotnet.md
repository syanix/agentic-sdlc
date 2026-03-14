# .NET Minimal API Backend Stack

## Project Structure

Organise the project using a feature-based layout with clear separation of concerns.

```
src/
  Api/
    Program.cs              # app builder, middleware, endpoint registration
    Endpoints/              # endpoint definitions grouped by resource
    Services/               # business logic layer
    Repositories/           # data access layer
    Models/                 # domain entities
    DTOs/                   # request/response data transfer objects
    Middleware/             # custom middleware
    Extensions/             # IServiceCollection and IApplicationBuilder extensions
    Filters/                # endpoint filters
  Infrastructure/
    Data/                   # DbContext, configurations, migrations
    Configuration/          # options classes
```

## Minimal API Patterns

- Define endpoints in static classes with extension methods on `IEndpointRouteBuilder`.
- Group endpoints by resource using `MapGroup()`:
  ```csharp
  var users = app.MapGroup("/api/v1/users").WithTags("Users");
  users.MapGet("/", GetAllUsers);
  users.MapPost("/", CreateUser);
  users.MapGet("/{id:guid}", GetUserById);
  ```
- Use `TypedResults` for compile-time return type safety. Prefer `Results<Ok<T>, NotFound, BadRequest>` over untyped `IResult`.
- Apply filters for cross-cutting concerns at the group or endpoint level.
- Keep endpoint handlers thin — delegate all logic to services.

## Entity Framework Core

- Define a `DbContext` with `DbSet<T>` properties for each entity.
- Use Fluent API configuration in `IEntityTypeConfiguration<T>` classes — avoid data annotations on models.
- Add `CreatedAt` and `UpdatedAt` timestamps to all entities. Use value generators or interceptors.
- Run `dotnet ef migrations add <Name>` to create migrations. Always review generated code.
- Run `dotnet ef database update` in development. Use `context.Database.MigrateAsync()` cautiously in production startup.
- Use `AsNoTracking()` for read-only queries. Use `Include()` and `ThenInclude()` for eager loading.
- Prefer UUIDs (`Guid`) for primary keys exposed in APIs.

## Dependency Injection

- Register services in `Program.cs` using the built-in DI container.
- Use `builder.Services.AddScoped<IService, Service>()` for request-scoped services.
- Use `AddSingleton` for stateless services and `AddTransient` for lightweight, stateless factories.
- Define interfaces for all services and repositories. Inject `IService`, never the concrete type.
- Use `Scrutor` for convention-based registration if the project grows large.

## Middleware Pipeline

- Register middleware in the correct order in `Program.cs`:
  ```
  Exception Handling → HTTPS Redirection → CORS → Authentication → Authorisation → Endpoints
  ```
- Use `app.UseExceptionHandler()` for global error handling.
- Create custom middleware by implementing `IMiddleware` or using the delegate pattern.
- Add request timing middleware that logs duration and sets `X-Process-Time` headers.

## Configuration and Options Pattern

- Use the Options pattern with `IOptions<T>`, `IOptionsSnapshot<T>`, or `IOptionsMonitor<T>`.
- Define strongly-typed settings classes and bind them:
  ```csharp
  builder.Services.Configure<DatabaseOptions>(builder.Configuration.GetSection("Database"));
  ```
- Validate options at startup with `ValidateDataAnnotations()` and `ValidateOnStart()`.
- Use `appsettings.json` for defaults. Override with environment variables using `__` as a section separator.
- Never hardcode secrets. Use `dotnet user-secrets` in development and a vault in production.

## Health Checks

- Register health checks with `builder.Services.AddHealthChecks()`.
- Add checks for database, Redis, and downstream services:
  ```csharp
  builder.Services.AddHealthChecks()
      .AddDbContextCheck<AppDbContext>()
      .AddRedis(connectionString);
  ```
- Map health check endpoints: `/health/live` for liveness, `/health/ready` for readiness.
- Return structured health reports with `ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse`.

## Error Handling

- Use the Results pattern — return `Result<T>` from services instead of throwing exceptions.
- Map domain errors to `ProblemDetails` responses for RFC 7807 compliance.
- Register a global exception handler that catches unhandled exceptions and returns `ProblemDetails`.
- Use `IExceptionHandler` (introduced in .NET 8) for structured exception handling.
- Log all 5xx errors with full stack traces. Log 4xx errors at debug level.

## OpenAPI Documentation

- Add `builder.Services.AddEndpointsApiExplorer()` and `builder.Services.AddSwaggerGen()`.
- Annotate endpoints with `.WithName()`, `.WithDescription()`, `.Produces<T>()`, `.ProducesValidationProblem()`.
- Use `WithOpenApi()` for fine-grained OpenAPI metadata.
- Serve Swagger UI at `/swagger` in non-production environments.

## Structured Logging

- Use **Serilog** with `builder.Host.UseSerilog()`.
- Configure sinks: Console (development), JSON file or Seq/Elasticsearch (production).
- Enrich logs with request ID, machine name, and environment.
- Use `LogContext.PushProperty()` for request-scoped context.
- Log at appropriate levels: `Error` for failures, `Warning` for recoverable issues, `Information` for key events, `Debug` for development detail.

## Testing

- Use **xUnit** for unit and integration tests.
- Use `WebApplicationFactory<Program>` for integration tests against the full middleware pipeline.
- Use `Respawn` for database cleanup between integration tests.
- Mock interfaces with **NSubstitute** or **Moq**. Never mock `DbContext` — use an in-memory or test database.
