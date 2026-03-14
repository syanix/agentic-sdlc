---
name: Error Handling Strategy
domain: backend
complexity: medium
works-with: [code-refactorer agent, /improve command]
---

# Error Handling Strategy

## When to Use

Use this prompt when you need to establish or refactor error handling patterns across a backend application, including error classes, middleware, logging, and alerting.

## The Prompt

You are a backend engineer implementing a comprehensive error handling strategy.

Design and implement error handling patterns for a [FRAMEWORK] application.

### Context

- **Error categories**: [ERROR_CATEGORIES] (e.g. validation, authentication, authorisation, not found, conflict, external service)
- **Logging tool**: [LOGGING_TOOL] (e.g. Winston, Pino, structlog, Serilog)
- **Notification channel**: [NOTIFICATION_CHANNEL] (e.g. Slack, PagerDuty, Sentry)

### Implementation Checklist

1. Define a base `AppError` class with `code`, `message`, `statusCode`, and `isOperational` fields
2. Create specific error subclasses for each category in [ERROR_CATEGORIES]
3. Implement global error handling middleware that catches all unhandled errors
4. Map domain errors to appropriate HTTP status codes and response shapes
5. Configure structured logging with correlation IDs for request tracing
6. Set up alerting for non-operational (unexpected) errors
7. Add health check endpoints that report dependency status
8. Write tests for each error path

### Error Class Hierarchy

```
AppError (base)
  ├── ValidationError (422)
  ├── AuthenticationError (401)
  ├── AuthorisationError (403)
  ├── NotFoundError (404)
  ├── ConflictError (409)
  ├── RateLimitError (429)
  └── ExternalServiceError (502/503)
```

### Client Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested organisation could not be found.",
    "request_id": "req_abc123"
  }
}
```

### Structured Log Format

```json
{
  "timestamp": "2026-03-14T10:30:00.000Z",
  "level": "error",
  "message": "External service timeout",
  "request_id": "req_abc123",
  "user_id": "usr_456",
  "service": "payment-gateway",
  "duration_ms": 30000,
  "stack": "..."
}
```

## Variations

### API Error Responses
Standardise all error responses across the API surface. Include a machine-readable
`code` and a human-readable `message`. Return arrays of errors for batch operations.
Add a `details` field for validation errors with per-field messages.

### Domain Exception Hierarchy
Model domain-specific errors (e.g. `InsufficientBalanceError`, `SubscriptionExpiredError`)
as subclasses of `AppError`. Keep them in a central `errors/` directory.
Each domain error should carry contextual data relevant to debugging.

### Global Error Middleware
Catch all errors at the framework boundary. Distinguish operational errors
(expected, handled) from programmer errors (unexpected, bugs).
Operational errors return proper responses; programmer errors trigger alerts and return 500.

## Tips

- **Never leak internals**: Strip stack traces, SQL queries, and internal identifiers from production error responses. Only return them in development mode.
- **Correlation IDs**: Generate a unique `request_id` at the entry point and propagate it through all logs and downstream service calls.
- **Structured logging**: Always log as JSON in production. Include `timestamp`, `level`, `message`, `request_id`, and contextual fields.
- **Fail fast**: Validate inputs at the boundary. Do not let invalid data propagate deeper into the system.
- **Circuit breakers**: Wrap calls to external services with circuit breaker patterns. Return a meaningful `ExternalServiceError` when the circuit is open.
- **Alerting thresholds**: Alert on error rate spikes (e.g. >1% of requests returning 5xx). Do not alert on individual 4xx errors — those are client issues.
- Log at the right level: DEBUG for development, INFO for request lifecycle, WARN for recoverable issues, ERROR for failures requiring attention.
