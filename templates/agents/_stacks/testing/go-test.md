# Go Testing Stack

## File Naming and Location

- Name test files `*_test.go` in the same package as the code under test.
- Place test fixtures and golden files in a `testdata/` directory — Go tooling ignores this directory during builds.
- Use the `_test` package suffix (e.g., `package user_test`) for black-box testing of exported APIs.
- Use the same package name for white-box tests that need access to unexported functions.

## Table-Driven Tests

- Use table-driven tests as the default pattern for functions with multiple input/output combinations.
- Define test cases as a slice of structs with descriptive `name` fields.
- Run each case as a subtest with `t.Run(tc.name, ...)` for clear failure reporting.

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {name: "positive numbers", a: 2, b: 3, expected: 5},
        {name: "negative numbers", a: -1, b: -2, expected: -3},
        {name: "zero values", a: 0, b: 0, expected: 0},
    }
    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            result := Add(tc.a, tc.b)
            assert.Equal(t, tc.expected, result)
        })
    }
}
```

## Testify Assertions and Suites

- Use `github.com/stretchr/testify/assert` for non-fatal assertions and `require` for fatal ones.
- Prefer `assert.Equal`, `assert.NoError`, `assert.Contains` over manual `if` checks with `t.Errorf`.
- Use `testify/suite` for test suites that need shared setup and teardown methods.
- Call `suite.Run(t, new(MySuite))` to execute a suite.

## HTTP Handler Testing

- Use `net/http/httptest` to create test servers and record responses.
- Build requests with `httptest.NewRequest()` and capture responses with `httptest.NewRecorder()`.
- Test middleware and handlers in isolation by calling `ServeHTTP` directly.

```go
func TestGetUserHandler(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/users/1", nil)
    rec := httptest.NewRecorder()
    handler := NewUserHandler(mockService)
    handler.ServeHTTP(rec, req)
    assert.Equal(t, http.StatusOK, rec.Code)
}
```

## Test Helpers

- Mark helper functions with `t.Helper()` so failures report the caller's line number.
- Return cleanup functions or use `t.Cleanup()` to register teardown logic.
- Create factory helpers like `newTestUser(t, opts...)` for reusable test data.

## Benchmarks

- Name benchmark functions `BenchmarkXxx(b *testing.B)`.
- Use the `b.N` loop for the code under measurement. Call `b.ResetTimer()` after expensive setup.
- Run benchmarks with `go test -bench=. -benchmem` to include memory allocation statistics.
- Use `b.RunParallel()` for benchmarking concurrent workloads.

## Race Detector

- Run tests with `-race` flag in CI: `go test -race ./...`.
- Fix all data races before merging — the race detector is non-negotiable.
- Use mutexes, channels, or atomic operations to resolve detected races.

## Coverage

- Generate coverage profiles with `go test -coverprofile=coverage.out ./...`.
- Use `-covermode=atomic` for accurate coverage in concurrent code.
- View coverage in the browser with `go tool cover -html=coverage.out`.
- Target minimum 80% coverage on critical packages. Do not chase 100% on generated code.

## Integration Test Build Tags

- Guard integration tests with a build tag: `//go:build integration` at the top of the file.
- Run integration tests explicitly: `go test -tags=integration ./...`.
- Keep integration tests in the same package but in separate files (e.g., `user_integration_test.go`).
- Use environment variables for external service configuration in integration tests.
