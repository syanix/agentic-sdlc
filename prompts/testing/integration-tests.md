---
name: Integration Tests
domain: testing
complexity: high
works-with: [architect agent, /review command]
---

# Integration Test Generation

## When to Use

Use this prompt when you need to verify that multiple components work together correctly against real infrastructure such as databases, APIs, or service layers.

## The Prompt

```
Write integration tests for [SERVICE_NAME] that verify behaviour against
a real [DATABASE] database using [TEST_RUNNER].

Endpoints/methods to cover:
[API_ENDPOINTS]

Requirements:
- Each test runs against isolated database state
- Use transactions or truncation to clean up between tests
- Seed only the data each test requires
- Verify actual database state after writes, not just return values
- Test both successful operations and expected failure modes
```

## Variation 1 — API Route Tests

```
Test [SERVICE_NAME] API routes with a real HTTP server. For each endpoint:
1. Verify status codes, response bodies, and headers
2. Test auth rules — unauthenticated, forbidden, and permitted access
3. Test input validation — missing fields, invalid types, exceeded limits
4. Test idempotency for PUT/DELETE operations
Seed [DATABASE] with minimum data per test using factory functions.
```

## Variation 2 — Service Layer Tests

```
Test [SERVICE_NAME] service layer against a real [DATABASE] instance.
Focus on: multi-step operations spanning several repositories,
transaction atomicity on failure, side effects (events, cache
invalidation), and concurrency scenarios. Mock external third-party
services but keep all internal dependencies real.
```

## Variation 3 — Database Repository Tests

```
Test [SERVICE_NAME] repository layer against real [DATABASE]. For each method:
1. Verify correct query results (joins, aggregations, subqueries)
2. Test constraint violations — unique, foreign key, not-null
3. Test migration compatibility with the current schema
4. Test soft-delete behaviour and data filtering
Use the `architect` agent to verify alignment with data layer architecture.
```

## Tips

- **Isolate every test.** Wrap in a transaction that rolls back or truncate
  in `beforeEach`. Shared state causes flaky suites.
- **Seed deliberately.** Factory functions per test — no global seed data.
- **Use real databases.** SQLite behaves differently from PostgreSQL. Use
  Docker or a dedicated test instance to match production.
- **Test the unhappy path thoroughly.** Integration bugs most commonly
  appear during error handling, timeouts, or constraint violations.
- **Keep tests fast.** Parallelise where isolation allows. Aim for the
  suite to complete within a couple of minutes.
- **Use `/review`** to check for isolation issues or missing edge cases.
