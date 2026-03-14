---
name: API Versioning
domain: backend
complexity: medium
works-with: [architect agent, /analyze command]
---

# API Versioning

## When to Use

Use this prompt when you need to define or implement an API versioning strategy, including version routing, deprecation policies, and migration planning.

## The Prompt

You are a backend architect designing an API versioning strategy.

Define a versioning approach for [API_NAME] currently at [CURRENT_VERSION] using [FRAMEWORK].

### Context

- **Breaking changes planned**: [BREAKING_CHANGES]
- **Consumer count**: Number of known API consumers
- **Deprecation timeline**: Minimum 6 months notice before sunsetting a version

### Implementation Checklist

1. Choose a versioning strategy (see variations below)
2. Organise route handlers and controllers by version
3. Implement version detection middleware that parses the version from the request
4. Share common logic between versions — only fork what has changed
5. Add deprecation headers to responses for old versions
6. Create a version changelog documenting what changed between versions
7. Set up monitoring to track request volume per version
8. Write contract tests for each supported version

### Version Routing Structure

```
/api/v1/[RESOURCE]  →  controllers/v1/[resource].controller
/api/v2/[RESOURCE]  →  controllers/v2/[resource].controller
                        (inherits from v1, overrides changed methods)
```

### Deprecation Response Headers

```
Deprecation: true
Sunset: Sat, 14 Sep 2026 00:00:00 GMT
Link: <https://docs.example.com/api/migration-guide>; rel="deprecation"
```

### Version Lifecycle

```
1. ACTIVE      — Fully supported, receives new features
2. MAINTAINED  — Receives bug fixes and security patches only
3. DEPRECATED  — Returns deprecation headers, sunset date set
4. SUNSET      — Returns 410 Gone with migration instructions
```

## Variations

### URL Path Versioning
`/api/v1/resources` — the most explicit and widely adopted approach.
Easy to route, cache, and document. Each version gets its own route namespace.
Use a version prefix middleware to extract and validate the version number.

### Header-Based Versioning
`Accept: application/vnd.[API_NAME].v2+json`
Keeps URLs clean but is harder to test in a browser or curl.
Requires middleware to parse the Accept header and route accordingly.
Default to the latest stable version if no version header is provided.

### Content Negotiation
Use media types to version individual resource representations.
`Accept: application/vnd.[API_NAME].user.v2+json`
Allows fine-grained versioning per resource rather than the entire API.
More flexible but significantly more complex to manage.

## Tips

- **Minimise versions**: Every supported version is maintenance overhead. Aim for no more than 2-3 active versions at any time.
- **Additive changes are not breaking**: Adding new fields to a response, new optional query parameters, or new endpoints does not require a version bump.
- **Breaking changes include**: Removing or renaming fields, changing field types, altering validation rules, modifying authentication flows, changing error response shapes.
- **Migration guides**: For every new version, publish a detailed migration guide listing every breaking change with before/after examples.
- **Consumer communication**: Notify consumers at least 6 months before sunsetting. Include the `Sunset` header in every response from deprecated versions.
- **Monitoring**: Track adoption of each version. Do not sunset a version until consumer traffic has dropped below an acceptable threshold.
- **Feature flags over versions**: For small behavioural changes, consider feature flags rather than a full version bump.
- **Contract testing**: Maintain consumer-driven contract tests to catch accidental breaking changes before they reach production.
- Share service and data layers across versions — only version the API layer (controllers, serialisers, validators).
