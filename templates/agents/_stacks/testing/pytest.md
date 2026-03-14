# pytest Testing Stack

## File Naming and Location

- Name test files `test_*.py` or `*_test.py`. Prefer the `test_` prefix for consistency.
- Place tests in a `tests/` directory mirroring the source structure: `src/services/user.py` → `tests/services/test_user.py`.
- Place shared fixtures and plugins in `conftest.py` at the appropriate directory level.
- Place test utilities and factories in `tests/utils/` or `tests/factories/`.

## Test Structure

- Name test functions with the `test_` prefix and use clear, behaviour-focused names.
- Follow the Arrange-Act-Assert pattern within each test.
- Group related tests in classes prefixed with `Test` (e.g., `TestUserService`). Do not use `__init__` in test classes.
- Keep tests focused — one assertion per logical behaviour.

```python
class TestUserService:
    def test_find_by_id_returns_user_when_found(self, user_service, mock_repo):
        # Arrange
        expected = create_mock_user(id="1")
        mock_repo.find_by_id.return_value = expected
        # Act
        result = user_service.find_by_id("1")
        # Assert
        assert result == expected
```

## Fixtures

- Use `@pytest.fixture` to provide test dependencies. Prefer fixtures over setup/teardown methods.
- Set fixture scope appropriately: `function` (default) for isolation, `session` for expensive resources.
- Use `autouse=True` sparingly — only for setup that every test in the scope genuinely requires.
- Yield from fixtures to provide teardown logic after the `yield` statement.
- Place shared fixtures in `conftest.py`. Fixtures defined there are automatically discovered by pytest.

## Parametrise for Data-Driven Tests

- Use `@pytest.mark.parametrize` to run the same test with multiple inputs.
- Provide descriptive `ids` for each parameter set to improve test output readability.

```python
@pytest.mark.parametrize("input_val,expected", [
    (2, True),
    (3, True),
    (4, False),
], ids=["two-is-prime", "three-is-prime", "four-is-not-prime"])
def test_is_prime(input_val, expected):
    assert is_prime(input_val) == expected
```

## Test Data Factories

- Use `factory_boy` to define reusable factories for database models.
- Create a `UserFactory`, `OrderFactory`, etc., inheriting from `factory.Factory` or `factory.alchemy.SQLAlchemyModelFactory`.
- Use `factory.LazyAttribute`, `factory.Sequence`, and `factory.SubFactory` for dynamic field generation.
- Override factory defaults in individual tests for scenario-specific data.

## FastAPI / HTTP Testing

- Use `httpx.AsyncClient` with `ASGITransport` or `TestClient` from Starlette for endpoint tests.
- Override dependencies with `app.dependency_overrides` to inject mocks.
- Test full request/response cycles: status codes, response bodies, and headers.

```python
async def test_create_user(async_client, mock_user_service):
    response = await async_client.post("/users", json={"name": "Test"})
    assert response.status_code == 201
    assert response.json()["name"] == "Test"
```

## Markers and Test Selection

- Use `@pytest.mark.slow`, `@pytest.mark.integration`, or custom markers to categorise tests.
- Register custom markers in `pyproject.toml` under `[tool.pytest.ini_options]` to avoid warnings.
- Run subsets with `-m`: `pytest -m "not slow"` or `pytest -m integration`.
- Use `-k` for keyword-based selection: `pytest -k "test_user and not delete"`.

## Coverage with pytest-cov

- Run coverage with `pytest --cov=src --cov-report=term-missing`.
- Configure in `pyproject.toml` under `[tool.coverage.run]` and `[tool.coverage.report]`.
- Exclude test files, migrations, and configuration from coverage.
- Target minimums: 80% line coverage on critical modules. Do not chase 100% on boilerplate.

## Async Testing

- Install `pytest-asyncio` for testing async functions.
- Mark async tests with `@pytest.mark.asyncio` or set `asyncio_mode = "auto"` in configuration.
- Use `async def` for both test functions and fixtures when dealing with async code.
- Prefer `asyncio_mode = "auto"` to avoid decorating every async test individually.
