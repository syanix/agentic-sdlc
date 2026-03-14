# Jest + Supertest Testing Stack

## File Naming and Location

- Name test files `*.spec.ts` for unit tests, `*.integration.spec.ts` for integration tests.
- Co-locate unit tests alongside source files: `user.service.ts` → `user.service.spec.ts`.
- Place integration tests in a `test/` directory at the project root.
- Place test utilities, fixtures, and factories in `test/utils/`.

## Test Structure

- Use `describe` blocks to group tests by class/function, then by method/scenario.
- Use `it` (not `test`) with clear, behaviour-focused names: `it('should return 404 when user does not exist')`.
- Follow the Arrange-Act-Assert pattern within each test.
- Keep tests focused — one assertion per logical behaviour. Multiple `expect` calls are fine if they verify one outcome.

```typescript
describe('UserService', () => {
  describe('findById', () => {
    it('should return the user when found', async () => {
      // Arrange
      const expected = createMockUser({ id: '1' });
      mockRepo.findById.mockResolvedValue(expected);
      // Act
      const result = await service.findById('1');
      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

## Setup and Teardown

- Use `beforeEach` (not `beforeAll`) for test isolation — each test gets a fresh state.
- Use `afterEach` to clean up side effects (clear mocks, reset state).
- Use `beforeAll` / `afterAll` only for expensive setup shared across tests (e.g., database connection).
- Call `jest.clearAllMocks()` in `beforeEach` to reset mock call counts and implementations.

## Mocking Strategies

- **`jest.mock()`**: Mock entire modules at the top of the file. Use for external dependencies.
- **`jest.spyOn()`**: Spy on individual methods. Preserves original implementation unless overridden.
- **Manual mocks**: Create `__mocks__/` directories for complex module mocks.
- Prefer dependency injection over `jest.mock()` — inject mock implementations via constructor.
- Never mock what you don't own without an adapter layer. Wrap third-party APIs in thin services, then mock those.
- Reset mocks between tests to prevent state leakage.

## Supertest Integration Tests

- Create a test `INestApplication` instance using `Test.createTestingModule()`.
- Override providers with mocks where needed using `.overrideProvider()`.
- Use `supertest(app.getHttpServer())` to make HTTP requests.
- Test full request/response cycles: status codes, response bodies, headers.
- Validate error responses match the expected format.

```typescript
describe('POST /users', () => {
  it('should create a user and return 201', async () => {
    const dto = { name: 'Test User', email: 'test@example.com' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(201);
    expect(response.body).toMatchObject({ name: dto.name });
  });
});
```

## Database Test Utilities

- Use a dedicated test database — never run tests against production or development databases.
- Reset the database state before each test suite (`beforeAll`) or each test (`beforeEach`).
- Use factory functions to create test data: `createMockUser()`, `createMockOrder()`.
- Use Prisma transactions with rollback for test isolation when performance matters.
- Seed reference data in `beforeAll`; seed test-specific data in `beforeEach`.

## Coverage

- Configure in `jest.config.ts` with `collectCoverageFrom` targeting source files.
- Exclude test files, mocks, config files, and generated code from coverage.
- Target minimums: statements 80%, branches 70%, functions 80%, lines 80%.
- Do not chase 100% coverage — focus on critical paths and edge cases.
- Run coverage in CI with `--coverage --ci` flags.

## Snapshot Testing

- Use snapshots sparingly — only for stable, serialisable outputs (e.g., API response shapes).
- Review snapshot changes carefully during code review.
- Update snapshots intentionally with `--updateSnapshot` when the output genuinely changes.
- Prefer explicit assertions over snapshots for most cases.

## Custom Matchers

- Extend `expect` with custom matchers for domain-specific assertions.
- Use `expect.extend()` to register matchers. Provide clear failure messages.
- Example matchers: `toBeValidUUID()`, `toBeWithinDateRange()`, `toMatchApiResponse()`.
