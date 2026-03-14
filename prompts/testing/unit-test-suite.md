---
name: Unit Test Suite
domain: testing
complexity: medium
works-with: [code-refactorer agent, /review command]
---

# Unit Test Suite Generation

## When to Use

Use this prompt when you need to generate a comprehensive unit test suite for a module, class, or component, covering happy paths, edge cases, and mocked dependencies.

## The Prompt

```
Generate a unit test suite for [MODULE_NAME] using [FRAMEWORK] with [TEST_RUNNER].

Key behaviours to cover:
[KEY_BEHAVIOURS]

Requirements:
- Follow Arrange-Act-Assert for every test
- Group related tests using describe/context blocks
- Use descriptive names that read as specifications
- Test behaviour and outcomes, not implementation details
- Include edge cases: null inputs, empty collections, boundary values
- Aim for 90% branch coverage
```

## Variation 1 — Pure Function Tests

```
[MODULE_NAME] exports pure functions. For each function:
1. Test the happy path with typical inputs
2. Test boundary conditions (zero, negative, max values)
3. Test error handling for invalid arguments
Do not mock anything — focus on input/output verification.
```

## Variation 2 — Class with Dependencies (Mocking)

```
[MODULE_NAME] depends on external services: [DEPENDENCIES]
For each dependency:
- Create a mock using [FRAMEWORK]'s built-in mocking utilities
- Verify correct methods are called with expected arguments
- Simulate both success and failure scenarios
- Test retry behaviour and timeout handling
Reset mocks between tests to maintain isolation.
```

## Variation 3 — React Component Tests

```
Write unit tests for the [MODULE_NAME] component with React Testing Library.
Test: initial render, user interactions, conditional rendering,
accessibility attributes, and loading/error/empty states.
Query by role, label, or text — never by CSS class. Prioritise testing
what the user sees and interacts with.
```

## Tips

- **Test behaviour, not implementation.** If refactoring internals breaks
  tests despite identical behaviour, the tests are too tightly coupled.
- **One logical assertion per test.** Multiple `expect` calls are fine
  when verifying a single behaviour.
- **Name tests as specifications.** A failing test name should explain
  what went wrong without reading the body.
- **Organise by behaviour, not by method.** Group tests around what the
  module does, not its internal API surface.
- **Run with `/review`** to catch missing edge cases the `code-refactorer`
  agent can improve.
