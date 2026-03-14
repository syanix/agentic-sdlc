# NestJS Architecture Patterns

## Module Structure

### Feature Modules
- One module per domain feature: `UsersModule`, `OrdersModule`, `AuthModule`
- Each feature module encapsulates its controllers, services, repositories, and DTOs
- Keep modules self-contained; export only what other modules need
- Use `forRoot()` / `forRootAsync()` for modules requiring configuration

```
src/
  modules/
    users/
      users.module.ts
      users.controller.ts
      users.service.ts
      users.repository.ts
      dto/
        create-user.dto.ts
        update-user.dto.ts
        user-response.dto.ts
      entities/
        user.entity.ts
      guards/
      interceptors/
```

### Shared Module
- Place reusable utilities, decorators, and common pipes in a `SharedModule`
- Export shared providers so feature modules can import them
- Avoid circular dependencies between shared and feature modules

### Core Module
- Import once in `AppModule` for global concerns
- Global guards, interceptors, filters, and exception handlers
- Database connection setup, logging, configuration

---

## Dependency Injection

- Register all providers in their owning module's `providers` array
- Use constructor injection exclusively; avoid property injection
- Define custom injection tokens for interfaces: `@Inject('USER_REPOSITORY')`
- Use `useClass`, `useFactory`, or `useValue` for provider registration
- Scope providers appropriately: default (singleton), request-scoped, or transient

---

## Controllers, Services, Repositories

### Controllers
- Handle HTTP concerns only: request parsing, response formatting, status codes
- Delegate all business logic to services
- Use decorators for routing, validation, authentication, and documentation
- Keep controller methods thin: validate input, call service, return response

### Services
- Contain all business logic and orchestration
- Inject repositories for data access; never query the database directly
- Throw domain-specific exceptions (e.g., `UserNotFoundException`)
- Services may call other services but avoid deep call chains

### Repositories
- Encapsulate all database queries and mutations
- Return typed entities or DTOs, not raw query results
- Use Prisma Client methods with explicit `select` or `include`
- Implement soft delete filtering at the repository level

---

## Guards, Interceptors, Pipes, Filters

### Guards
- Use for authentication (`AuthGuard`) and authorisation (`RolesGuard`)
- Apply globally or per-controller/route with `@UseGuards()`
- Return `true`/`false` or throw `UnauthorizedException`/`ForbiddenException`

### Interceptors
- Use for cross-cutting concerns: logging, response transformation, caching
- Implement `NestInterceptor` with `intercept()` method
- Apply response mapping (e.g., wrapping in standard envelope)

### Pipes
- Use `ValidationPipe` globally for DTO validation
- Create custom pipes for parameter transformation (e.g., `ParseUUIDPipe`)
- Apply at parameter level for granular control: `@Param('id', ParseUUIDPipe)`

### Exception Filters
- Implement `ExceptionFilter` to standardise error responses
- Catch framework exceptions and domain exceptions separately
- Map domain exceptions to appropriate HTTP status codes
- Log unhandled exceptions with full context

---

## DTOs and Validation

### class-validator Approach
- Decorate DTO properties with validation decorators (`@IsString()`, `@IsEmail()`)
- Use `@ValidateNested()` with `@Type()` for nested objects
- Apply `whitelist: true` and `forbidNonWhitelisted: true` globally

### Zod Approach (alternative)
- Define Zod schemas and derive TypeScript types with `z.infer<>`
- Use a custom `ZodValidationPipe` to validate request bodies
- Co-locate schemas with DTOs for discoverability

---

## Prisma Integration

- Define `PrismaService` extending `PrismaClient` with `OnModuleInit`
- Register `PrismaService` in a `PrismaModule` and export it globally
- Use Prisma's generated types for type safety in repositories
- Run migrations via `prisma migrate dev` (development) and `prisma migrate deploy` (production)
- Use `prisma db seed` for development data seeding
- Enable query logging in development for N+1 detection

---

## Exception Filters and Error Handling

- Register a global `AllExceptionsFilter` in `AppModule`
- Translate Prisma errors (e.g., `P2002` unique constraint) to domain errors
- Return the standard error response shape defined in the base guidelines
- Include `requestId` from request context for traceability

---

## Configuration Management

- Use `@nestjs/config` with `ConfigModule.forRoot()` registered globally
- Define environment schemas with Joi or Zod for validation at startup
- Group related config into factory functions: `databaseConfig()`, `authConfig()`
- Access configuration via `ConfigService` injection, never `process.env` directly
- Use `.env` files for local development; environment variables in production
- Fail fast on missing required configuration values
