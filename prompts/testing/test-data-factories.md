---
name: Test Data Factories
domain: testing
complexity: medium
works-with: [code-refactorer agent, /improve command]
---

# Test Data Factory Generation

## When to Use

Use this prompt when you need to create reusable factory functions or builders that generate realistic, valid test data for your models and API payloads.

## The Prompt

```
Create a test data factory for [MODEL_NAME] using [FACTORY_LIBRARY].

Fields: [FIELDS]
Relationships: [RELATIONSHIPS]

Requirements:
- Generated instances must pass model validation by default
- Use realistic defaults (proper names, valid emails, sensible dates)
- Allow any field to be overridden via a parameter object
- Support traits for common variants (e.g. "admin", "inactive")
- Generate unique values for uniqueness-constrained fields
- Build associated models automatically when needed
```

## Variation 1 — ORM-Based Factories

```
Create [MODEL_NAME] factories with two modes:
- `build` — in-memory instance without saving
- `create` — persists to the database and returns the record
Auto-create associated records from [RELATIONSHIPS] on `create`.
Allow passing existing associations to avoid duplicates. Support
collections: "create a user with 3 orders". Use sequences for
unique fields: email (n) => `user-${n}@example.org`
```

## Variation 2 — Plain Object Builders

```
Create a builder-pattern factory for [MODEL_NAME] returning plain objects.
Support method chaining: build().withRole('admin').withAge(25).value()
Include buildList(count, overrides) for arrays and partial() for subset
fields (useful for PATCH payloads). Return frozen objects by default.
Generate valid nested structures for [RELATIONSHIPS].
```

## Variation 3 — API Fixture Generators

```
Create [MODEL_NAME] fixtures matching API response format (camelCase keys,
ISO dates, serialised relationships). Support both request payloads
(input) and response payloads (output). Include an invalid() variant
with common validation errors. Support paginated list responses with
correct metadata (total count, page size, cursor tokens).
```

## Tips

- **Realistic defaults matter.** Tests with proper data catch encoding
  issues, length limits, and localisation problems that "test123" misses.
- **Keep factories close to the model.** Update the factory first when
  the model changes. Store in `test/factories` or alongside tests.
- **Use traits for common scenarios.** Define an `admin` trait rather than
  overriding five fields each time. Keeps test code readable.
- **Generate edge-case variants.** Include maximum-length strings, Unicode
  characters, zero-value numerics, and empty optional fields.
- **Use `/improve`** with the `code-refactorer` agent if a factory grows
  too large — the underlying model may need refactoring.
