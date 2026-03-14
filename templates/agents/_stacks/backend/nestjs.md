# NestJS Backend Stack

## Architecture

Follow a strict layered architecture. Each layer has a single responsibility and dependencies flow inward only.

```
Controllers → Services → Repositories → Domain → Database
```

- **Controllers**: Handle HTTP concerns only — request parsing, response shaping, status codes. Delegate all logic to services.
- **Services**: Contain business logic. Orchestrate repository calls, apply domain rules, emit events.
- **Repositories**: Abstract database access. Return domain entities, never raw Prisma types in public APIs.
- **Domain**: Pure TypeScript classes/interfaces. No framework imports, no database dependencies.

## TypeScript Configuration

- Enable `strict: true` in `tsconfig.json` — no exceptions.
- Use `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`.
- Prefer `unknown` over `any`. If `any` is unavoidable, add a `// eslint-disable` comment with justification.

## DTOs and Validation

- Use `class-validator` decorators on DTOs for runtime validation.
- Use `class-transformer` for plain-to-class transformation.
- Alternatively, use Zod schemas with `@anatine/zod-nestjs` for Zod-first validation.
- Always define separate `CreateXDto`, `UpdateXDto`, and `ResponseXDto` classes.
- Use `PartialType`, `PickType`, `OmitType`, `IntersectionType` from `@nestjs/mapped-types` to reduce duplication.

## Prisma ORM

- Keep `schema.prisma` as the single source of truth for the database schema.
- Run `npx prisma generate` after every schema change.
- Use `npx prisma migrate dev --name <descriptive_name>` for development migrations.
- Use `npx prisma migrate deploy` in CI/CD pipelines.
- Wrap Prisma Client in a `PrismaService` that extends `PrismaClient` and implements `OnModuleInit`.
- Use Prisma transactions (`$transaction`) for multi-step writes.
- Never expose raw Prisma types in API responses — map to DTOs.

## Module Structure

- One feature per module. Each module contains its own controller, service, repository, DTOs, and entities.
- Register modules in the root `AppModule` using `imports`.
- Use `forRoot` / `forRootAsync` for configuration-dependent modules.
- Use `@Global()` sparingly — only for truly cross-cutting modules (e.g., `PrismaModule`, `ConfigModule`).

## Dependency Injection

- Use constructor injection exclusively.
- Prefer interface-based injection with custom tokens for testability.
- Use `@Inject()` with string or symbol tokens when injecting non-class providers.

## Guards, Interceptors, Pipes, Filters

- **Guards**: Authorisation logic (role checks, ownership). Apply via `@UseGuards()` or globally.
- **Interceptors**: Cross-cutting concerns (logging, response transformation, caching). Apply via `@UseInterceptors()`.
- **Pipes**: Input transformation and validation. Use `ValidationPipe` globally with `whitelist: true` and `transform: true`.
- **Filters**: Exception handling. Create custom `@Catch()` filters for domain-specific errors.
- Execution order: Middleware → Guards → Interceptors (pre) → Pipes → Handler → Interceptors (post) → Filters (on error).

## OpenAPI / Swagger

- Decorate all controllers with `@ApiTags()`.
- Decorate endpoints with `@ApiOperation()`, `@ApiResponse()`, `@ApiParam()`, `@ApiQuery()`.
- Use `@ApiProperty()` on DTO fields for schema generation.
- Enable the Swagger UI at `/api/docs` in non-production environments.

## Caching

- Use `@nestjs/cache-manager` with a Redis or in-memory store.
- Apply `@CacheInterceptor()` at the controller or handler level.
- Set appropriate TTLs per endpoint. Invalidate on writes.

## Pagination, Sorting, Filtering

- Accept `page`, `limit`, `sort`, `order`, and filter parameters via query DTOs.
- Return paginated responses in a consistent envelope: `{ data, meta: { total, page, limit, totalPages } }`.
- Apply default limits (e.g., `limit=20`, `maxLimit=100`).
- Use Prisma `skip`, `take`, `orderBy`, and `where` for database-level pagination.

## Error Handling

- Throw NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, etc.) from services.
- Create custom domain exceptions that extend `HttpException` for business-specific errors.
- Use a global exception filter to standardise error response format:
  ```json
  { "statusCode": 404, "message": "Resource not found", "error": "Not Found", "timestamp": "..." }
  ```
- Log all 5xx errors with full stack traces. Log 4xx errors at debug level.

## Environment Configuration

- Use `@nestjs/config` with `.env` files and `Joi` or `Zod` for validation.
- Define a `configuration.ts` factory function for typed config access.
- Never hardcode secrets, URLs, or environment-specific values.
- Use `ConfigService.get<T>()` with type parameters for type-safe access.

## Database Patterns

- Add `createdAt` and `updatedAt` timestamps to all tables via Prisma `@default(now())` and `@updatedAt`.
- Implement soft deletes with a `deletedAt DateTime?` field. Filter soft-deleted records by default in repositories.
- Add database indexes for frequently queried columns and foreign keys.
- Use `@unique` constraints for business-key uniqueness.
- Prefer UUIDs (`@default(uuid())`) for primary keys exposed in APIs.

## Health Checks

- Implement a `/health` endpoint using `@nestjs/terminus`.
- Check database connectivity, memory, and disk as a minimum.
- Return HTTP 200 for healthy, 503 for degraded.

## Logging

- Use the built-in `Logger` service or a structured logger (e.g., `pino`, `winston`).
- Include correlation IDs in all log entries for request tracing.
- Log at appropriate levels: `error` for failures, `warn` for recoverable issues, `log` for key events, `debug` for development detail.
