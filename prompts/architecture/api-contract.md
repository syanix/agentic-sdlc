---
name: API Contract Design
domain: architecture
complexity: medium
works-with: [architect agent, /feature command]
---

# API Contract Design Prompt

## When to Use

Use this prompt when you need to define a formal API contract for a service, whether REST, GraphQL, or event-driven, including endpoints, schemas, and versioning strategy.

## The Prompt

```
Design an API contract for [API_NAME].

## Resources / Domain Objects
[RESOURCES]

## Authentication & Authorisation Scheme
[AUTH_SCHEME]

## Versioning Strategy
[VERSIONING_STRATEGY]

For each resource, define:
1. Endpoints with HTTP methods and URL patterns
2. Request and response schemas with field types and validation rules
3. Error response format (use RFC 7807 Problem Details)
4. Pagination strategy for collection endpoints
5. Rate limiting and throttling behaviour
6. Required headers and content negotiation

Ensure the contract is backwards-compatible by default. Flag any breaking
changes explicitly and provide a migration path.
```

## Variations

### REST OpenAPI Spec
Append to the base prompt:
```
Output the contract as a valid OpenAPI 3.1 specification in YAML format.
Include:
- Reusable component schemas for shared types
- Security scheme definitions
- Example request/response pairs for every endpoint
- Descriptive operation IDs following the pattern: verbNoun (e.g., listUsers)
- Tags for logical grouping of endpoints
```

### GraphQL Schema
Append to the base prompt:
```
Output the contract as a GraphQL schema definition language (SDL) file.
Include:
- Query and Mutation types with descriptive field names
- Input types for mutations
- Custom scalar types where appropriate
- Relay-style connection types for pagination
- Directive annotations for authorisation (@auth)
- Descriptions for all types and fields
```

### Event-Driven Contract
Append to the base prompt:
```
Output the contract as an AsyncAPI 3.0 specification for event-driven communication.
Include:
- Channel definitions with publish/subscribe operations
- Message schemas with CloudEvents envelope
- Correlation ID strategy for tracing
- Retry and dead-letter queue behaviour
- Schema evolution and compatibility rules (forward/backward)
```

## Tips

- Design APIs from the consumer's perspective, not the database schema
- Use consumer-driven contract testing to validate against real usage
- Never remove or rename fields in a published API — deprecate and add new ones
- Version in the URL path (e.g., /v1/) for REST; use schema directives for GraphQL
- Pair with the /feature command to generate implementation scaffolding from contracts
- Include rate limit headers (X-RateLimit-Remaining, Retry-After) in every response
- Document idempotency behaviour for all write operations
