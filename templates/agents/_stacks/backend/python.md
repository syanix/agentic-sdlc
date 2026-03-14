# FastAPI Backend Stack

## Project Structure

Organise the project using a `src` layout with clear separation of concerns.

```
src/
  app/
    main.py              # FastAPI app factory, lifespan, middleware registration
    config.py            # pydantic-settings configuration
    routers/             # route definitions grouped by resource
    services/            # business logic layer
    repositories/        # database access layer
    models/              # SQLAlchemy ORM models
    schemas/             # Pydantic request/response schemas
    dependencies/        # FastAPI dependency callables
    middleware/           # custom middleware
    exceptions/          # custom exception classes and handlers
migrations/              # Alembic migration files
alembic.ini
tests/
```

- **Routers**: Handle HTTP concerns only — parse requests, return responses, delegate to services.
- **Services**: Contain business logic. Accept and return Pydantic schemas or domain types.
- **Repositories**: Abstract database access. Accept and return ORM models.
- **Schemas**: Pydantic models for validation. Never expose ORM models directly in responses.

## Router Organisation

- Create one router per resource in the `routers/` directory.
- Use `APIRouter` with a prefix and tags: `router = APIRouter(prefix="/users", tags=["users"])`.
- Include routers in the main app with `app.include_router()`.
- Group related endpoints together. Use path parameters for resource identification.

## Dependency Injection

- Use FastAPI's `Depends()` for injecting services, database sessions, and auth context.
- Define reusable dependencies in `dependencies/` (e.g., `get_db`, `get_current_user`).
- Chain dependencies — a service dependency can depend on a repository dependency.
- Use `Annotated[Service, Depends(get_service)]` for clean type annotations (Python 3.9+).

## Pydantic Schemas

- Define separate `CreateX`, `UpdateX`, and `ResponseX` schemas for each resource.
- Use `model_config = ConfigDict(from_attributes=True)` for ORM-to-schema conversion.
- Use `Field()` with descriptions and examples for OpenAPI documentation.
- Use strict validation. Set `strict=True` on fields that must not coerce types.
- Prefer `Annotated` types with reusable validators for common patterns (email, URL, UUID).

## SQLAlchemy 2.0 Async

- Use SQLAlchemy 2.0 style with `AsyncSession` and the new `select()` syntax.
- Define a session factory with `async_sessionmaker(engine, class_=AsyncSession)`.
- Use the repository pattern — each repository receives an `AsyncSession` via dependency injection.
- Always use `async with session.begin()` for transactional blocks. Never commit manually outside transactions.
- Use `selectinload()` or `joinedload()` to avoid N+1 queries on relationships.

## Alembic Migrations

- Initialise Alembic with `alembic init -t async migrations` for async support.
- Generate migrations with `alembic revision --autogenerate -m "descriptive_name"`.
- Always review auto-generated migrations before applying — check for data loss operations.
- Run `alembic upgrade head` in deployment pipelines. Never auto-migrate in production startup.

## Middleware and CORS

- Register middleware in order: CORS, request ID, structured logging, error handling.
- Configure CORS with explicit `allow_origins`. Never use `["*"]` in production.
- Use `@app.middleware("http")` for simple middleware. Use `BaseHTTPMiddleware` subclasses for complex logic.
- Add request timing middleware that sets `X-Process-Time` headers.

## Authentication

- Use OAuth2 with `OAuth2PasswordBearer` or JWT-based authentication.
- Create a `get_current_user` dependency that validates tokens and returns the user.
- Use security scopes for fine-grained authorisation.
- Never store passwords in plain text — use `passlib` with bcrypt.

## Error Handling

- Define custom exception classes that inherit from a base `AppException`.
- Register exception handlers with `@app.exception_handler(AppException)`.
- Return errors in a consistent format:
  ```json
  { "detail": { "code": "NOT_FOUND", "message": "Resource not found" } }
  ```
- Use `HTTPException` for standard HTTP errors. Use custom exceptions for domain errors.
- Log all 5xx errors with full tracebacks. Log 4xx errors at debug level.

## Configuration

- Use **pydantic-settings** with `BaseSettings` for typed, validated configuration.
- Load from environment variables and `.env` files with `model_config = SettingsConfigDict(env_file=".env")`.
- Group related settings into nested models (database, auth, redis).
- Validate all required values at startup. Use `Field(default=...)` for optional settings with defaults.

## Health Checks

- Expose `/health` and `/ready` endpoints.
- Check database connectivity, Redis availability, and downstream services.
- Return 200 for healthy, 503 for degraded. Include component status in the response body.

## Structured Logging

- Use **structlog** for structured JSON logging.
- Configure processors: add timestamp, log level, request ID, caller info.
- Bind request-scoped context (request ID, user ID) at the middleware level.
- Log at appropriate levels: `error` for failures, `warning` for recoverable issues, `info` for key events, `debug` for development detail.
