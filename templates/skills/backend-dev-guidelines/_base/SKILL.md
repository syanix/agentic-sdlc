---
name: backend-dev-guidelines
description: Backend development patterns and conventions. Use when implementing API endpoints, services, database operations, or any backend logic. Covers architecture, error handling, validation, testing, and security patterns.
---

# Backend Development Guidelines

Universal backend development patterns and conventions. These principles apply regardless of framework or language. See `resources/` for {{BACKEND_FRAMEWORK}}-specific patterns.

---

## Layered Architecture

Organise backend code into distinct layers with clear responsibilities and unidirectional dependency flow.

### Domain Layer (innermost)
- Pure business logic and domain entities
- No framework dependencies, no I/O
- Domain models, value objects, enums, and business rules
- Domain-level interfaces/contracts (e.g., repository interfaces)

### Application Layer
- Orchestrates domain logic via use cases / services
- Defines DTOs for data transfer between layers
- Handles transactions and cross-cutting concerns
- Contains application-level interfaces (e.g., notification ports)

### Infrastructure Layer
- Implements interfaces defined in domain/application layers
- Database repositories, external API clients, message queues
- Framework-specific adapters and configurations
- Third-party integrations (email, storage, payment)

### API Layer (outermost)
- HTTP controllers, GraphQL resolvers, gRPC handlers
- Request/response serialisation and deserialisation
- Authentication and authorisation enforcement
- Input validation and response formatting

### Key Rules
- Dependencies point inward only: API -> Application -> Domain
- Infrastructure implements domain/application interfaces
- Never leak infrastructure details into domain logic
- Use dependency injection to wire layers together

---

## API Design Principles

### RESTful Conventions
- Use nouns for resources: `/users`, `/orders`, `/products`
- Use HTTP verbs correctly: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove)
- Nest resources to express relationships: `/users/:id/orders`
- Return appropriate status codes: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorised), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity), 500 (Internal Server Error)

### Versioning
- Prefer URL path versioning: `/api/v1/users`
- Maintain backward compatibility within a major version
- Document breaking changes and migration guides

### Pagination
- Use cursor-based pagination for large datasets (preferred)
- Support offset-based pagination where cursor-based is impractical
- Return pagination metadata: `{ data, meta: { total, page, pageSize, hasMore } }`
- Default page size: 20, maximum page size: 100

### Filtering and Sorting
- Use query parameters for filtering: `?status=active&role=admin`
- Use `sort` parameter with direction: `?sort=createdAt:desc`
- Support multiple sort fields: `?sort=priority:desc,createdAt:asc`
- Validate all filter and sort fields against an allowlist

---

## Error Handling

### Structured Error Responses
Return consistent error shapes across all endpoints:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields failed validation.",
    "details": [
      { "field": "email", "message": "Must be a valid email address." }
    ],
    "requestId": "req_abc123"
  }
}
```

### Error Code Hierarchy
- `VALIDATION_ERROR` - input validation failures (400)
- `AUTHENTICATION_ERROR` - missing or invalid credentials (401)
- `AUTHORISATION_ERROR` - insufficient permissions (403)
- `NOT_FOUND` - resource does not exist (404)
- `CONFLICT` - resource state conflict (409)
- `RATE_LIMITED` - too many requests (429)
- `INTERNAL_ERROR` - unexpected server errors (500)

### Error Handling Rules
- Never expose stack traces or internal details in production
- Log full error details server-side with correlation IDs
- Use custom exception classes that map to error codes
- Catch errors at the boundary (controller/handler level)
- Let domain errors bubble up; translate at the API layer

---

## Validation

### Input Validation Patterns
- Validate at the API boundary before processing
- Use schema validation libraries (Zod, class-validator, Joi)
- Fail fast: return all validation errors at once, not one at a time
- Validate data types, ranges, formats, and business constraints

### DTO Conventions
- Define separate DTOs for create, update, and response
- Never expose internal entity fields directly (e.g., password hashes)
- Use explicit field allowlists, not blocklists
- Transform and sanitise inputs in the DTO layer

---

## Authentication and Authorisation

### Authentication Patterns
- Use JWT or session-based authentication
- Implement token refresh flows for long-lived sessions
- Store tokens securely (httpOnly cookies preferred over localStorage)
- Validate tokens on every request via guards/middleware

### Authorisation Patterns
- Implement role-based access control (RBAC) as the baseline
- Consider attribute-based access control (ABAC) for complex rules
- Define permissions at the resource + action level
- Use guards/middleware to enforce authorisation before handlers execute
- Implement resource-level ownership checks where applicable

---

## Database Patterns

### Repository Pattern
- Encapsulate all data access behind repository interfaces
- Keep query logic in repositories, not in services
- Return domain entities from repositories, not raw database rows

### Migrations
- Use incremental, versioned migrations
- Migrations must be reversible (include both up and down)
- Never modify data in schema migrations; use separate data migrations
- Test migrations against production-like data volumes

### Standard Fields
- `id` - UUID or CUID primary key (avoid auto-incrementing integers for public IDs)
- `createdAt` - timestamp, set on creation, never modified
- `updatedAt` - timestamp, updated on every modification
- `deletedAt` - nullable timestamp for soft deletes

### Soft Deletes
- Prefer soft deletes over hard deletes for auditable data
- Filter soft-deleted records by default in all queries
- Provide explicit methods to include or target soft-deleted records

### Indexing Strategies
- Index all foreign key columns
- Index columns used in WHERE, ORDER BY, and JOIN clauses
- Use composite indexes for common multi-column queries
- Monitor slow queries and add indexes based on actual usage

---

## Testing Requirements

### Unit Tests
- Test all service/use-case methods
- Mock external dependencies (repositories, APIs, queues)
- Cover happy paths, edge cases, and error scenarios
- Aim for 80%+ code coverage on business logic

### Integration Tests
- Test API endpoints end-to-end with a real (or containerised) database
- Verify request validation, authentication, and authorisation
- Test response shapes and status codes
- Use factories/fixtures for test data setup

### Coverage Targets
- Business logic (services): 80%+
- API controllers: 70%+
- Utilities and helpers: 90%+
- Overall project: 75%+

---

## Security

### Input Sanitisation
- Sanitise all user inputs to prevent XSS
- Use parameterised queries exclusively to prevent SQL injection
- Validate and sanitise file uploads (type, size, content)
- Escape output when rendering user-provided content

### Rate Limiting
- Apply rate limiting to all public endpoints
- Use stricter limits for authentication endpoints
- Return `429 Too Many Requests` with `Retry-After` header
- Consider per-user and per-IP rate limiting

### Additional Measures
- Enable CORS with explicit origin allowlists
- Set security headers (HSTS, X-Content-Type-Options, X-Frame-Options)
- Rotate secrets and credentials regularly
- Audit and log all access to sensitive resources

---

## Documentation

### API Documentation
- Generate OpenAPI/Swagger specs from code annotations
- Document all endpoints, parameters, request bodies, and responses
- Include authentication requirements for each endpoint
- Provide example requests and responses
- Keep documentation in sync with implementation (prefer auto-generation)

---

## Performance

### Caching Strategies
- Cache frequently read, rarely changing data (e.g., configuration, lookups)
- Use appropriate TTLs based on data freshness requirements
- Implement cache invalidation on write operations
- Consider multi-level caching: in-memory -> distributed cache -> database

### Query Optimisation
- Select only required columns, not `SELECT *`
- Use pagination for all list endpoints
- Batch related queries where possible
- Monitor and optimise queries exceeding 100ms

### N+1 Prevention
- Eager-load related entities for known access patterns
- Use data loaders or batch queries for dynamic relationships
- Monitor ORM query logs during development
- Write integration tests that assert query counts for critical paths

---

> **Stack-specific patterns**: See `resources/` for {{BACKEND_FRAMEWORK}}-specific implementation details, code examples, and framework conventions.
