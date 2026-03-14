# NestJS Testing Patterns

## Jest Configuration

- Use the default NestJS Jest configuration from `package.json` or `jest.config.ts`
- Configure module name mapping to match `tsconfig` path aliases
- Set `testRegex` to match `*.spec.ts` (unit) and `*.e2e-spec.ts` (end-to-end)
- Enable coverage collection with `--coverage` flag
- Configure coverage thresholds in Jest config to enforce minimums

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 75,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## Testing Module Setup

- Use `Test.createTestingModule()` to create an isolated module for each test suite
- Override providers with mocks using `.overrideProvider().useValue()`
- Compile the module with `.compile()` before each test or once per suite
- Retrieve service instances with `module.get<ServiceName>(ServiceName)`

```typescript
const module = await Test.createTestingModule({
  providers: [
    UsersService,
    { provide: 'USER_REPOSITORY', useValue: mockUserRepository },
    { provide: ConfigService, useValue: mockConfigService },
  ],
}).compile();

const service = module.get<UsersService>(UsersService);
```

---

## Mocking Providers and Dependencies

- Create mock factories for commonly mocked providers (repositories, config, external APIs)
- Use `jest.fn()` for individual method mocks with typed return values
- Reset mocks in `beforeEach` to prevent test pollution
- Mock only what is necessary; avoid over-mocking internal implementation details
- For Prisma, mock the `PrismaService` with method-level stubs

```typescript
const mockUserRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
```

---

## Controller Integration Tests with Supertest

- Use `@nestjs/testing` with `supertest` for HTTP-level testing
- Create the NestJS application instance with `module.createNestApplication()`
- Apply the same global pipes, filters, and interceptors as production
- Test request validation, authentication, status codes, and response shapes

```typescript
const app = module.createNestApplication();
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
await app.init();

await request(app.getHttpServer())
  .post('/users')
  .send({ email: 'test@example.com', name: 'Test' })
  .expect(201)
  .expect((res) => {
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
  });
```

---

## End-to-End Test Setup

- Place E2E tests in a `test/` directory at the project root
- Use a dedicated test database (containerised or in-memory)
- Run migrations and seed data before the test suite
- Clean up data between tests to ensure isolation
- Use a separate `.env.test` configuration file
- Run E2E tests separately from unit tests: `jest --config jest-e2e.config.ts`

---

## Database Testing

### Test Containers
- Use `testcontainers` to spin up a real PostgreSQL instance per test suite
- Configure Prisma to connect to the container's dynamic port
- Run `prisma migrate deploy` against the test container before tests

### Fixtures and Factories
- Create factory functions for each entity: `createTestUser()`, `createTestOrder()`
- Use sensible defaults with optional overrides for test-specific data
- Clean up created records in `afterEach` or use transactions that roll back

```typescript
function createTestUser(overrides?: Partial<CreateUserDto>): CreateUserDto {
  return {
    email: `test-${randomUUID()}@example.com`,
    name: 'Test User',
    ...overrides,
  };
}
```

---

## Coverage Configuration

- Enforce coverage thresholds in CI to prevent regressions
- Exclude non-business files from coverage: modules, DTOs, entities, main.ts
- Focus coverage requirements on services and repositories
- Generate HTML coverage reports for local review
- Track coverage trends over time in CI dashboards

```json
{
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.module.ts",
    "!src/**/*.dto.ts",
    "!src/**/*.entity.ts",
    "!src/main.ts"
  ]
}
```
