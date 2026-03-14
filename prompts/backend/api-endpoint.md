---
name: API Endpoint Creation
domain: backend
complexity: medium
works-with: [architect agent, /feature command]
---

# API Endpoint Creation

## When to Use

Use this prompt when you need to create a new RESTful API endpoint with proper validation, error handling, and documentation.

## The Prompt

You are a backend engineer creating a RESTful API endpoint.

Create a [HTTP_METHOD] endpoint for the [RESOURCE_NAME] resource using [FRAMEWORK].

### Requirements

- **Route**: `[HTTP_METHOD] /api/v1/[RESOURCE_NAME]`
- **Request body/params**: [REQUEST_BODY]
- **Response shape**: [RESPONSE_SHAPE]
- **Authentication**: Required unless otherwise noted

### Implementation Checklist

1. Define the route handler with appropriate HTTP method
2. Validate all input using a schema validation library (e.g. Zod, Joi, Pydantic)
3. Implement request authorisation checks
4. Add business logic in a dedicated service layer — keep the controller thin
5. Return consistent response envelopes: `{ data, meta, errors }`
6. Set correct HTTP status codes (see tips below)
7. Add OpenAPI/Swagger documentation annotations
8. Write integration tests covering happy path and edge cases

### Validation Rules

- Sanitise all string inputs to prevent injection
- Enforce maximum payload size
- Validate content-type headers
- Return 422 Unprocessable Entity for validation failures with field-level errors

### Error Response Format

```json
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "email",
      "message": "A valid email address is required."
    }
  ]
}
```

## Variations

### CRUD Endpoints
Generate the full set: POST (create), GET (list + single), PUT/PATCH (update), DELETE.
Include pagination on the list endpoint with `page`, `per_page`, and `sort` query params.

### Search/Filter Endpoint
`GET /api/v1/[RESOURCE_NAME]/search?q=[QUERY]&filters=[FILTER_PARAMS]`
Support compound filters, date ranges, and full-text search where appropriate.

### File Upload Endpoint
Use multipart/form-data. Validate file type, size, and scan for malware.
Store metadata in the database and files in object storage (S3-compatible).

## Tips

- **Idempotency**: POST requests should accept an `Idempotency-Key` header to prevent duplicate creation. PUT and DELETE are inherently idempotent.
- **Status codes**: 200 OK, 201 Created (POST), 204 No Content (DELETE), 400 Bad Request, 401 Unauthorised, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests.
- **Rate limiting**: Apply per-user rate limits and return `Retry-After` headers on 429 responses.
- **Caching**: Set `Cache-Control` and `ETag` headers on GET responses where data is not user-specific.
- **Naming**: Use plural nouns for resources (`/users` not `/user`), kebab-case for multi-word (`/user-profiles`).
- Keep route definitions separate from business logic — favour a service/repository pattern.
- Log all 5xx errors with full context but never expose internal details to the client.
