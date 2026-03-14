---
description: Write or update tests for any layer of the application
---

# Test Command

Write or update tests at any layer of the application stack.

## Usage

```
/test <scope> <target> [options]
```

## Test Scopes

### Backend Unit Tests

**Routes to: be-dev agent | Framework: Jest**

Write unit tests for NestJS services, guards, pipes, and utility functions.

Steps:
1. Identify the file to test and its dependencies.
2. Create or open the corresponding `*.spec.ts` file.
3. Mock all external dependencies (repositories, other services, third-party clients).
4. Write tests covering:
   - Happy path for each public method.
   - Edge cases (empty inputs, null values, boundary conditions).
   - Error cases (thrown exceptions, invalid data).
   - Guard and pipe logic if applicable.
5. Run `npx jest <file> --verbose` to verify.
6. Check coverage with `npx jest <file> --coverage`.

Test structure:
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle the happy path', () => { /* ... */ });
    it('should throw NotFoundException when not found', () => { /* ... */ });
    it('should handle empty input gracefully', () => { /* ... */ });
  });
});
```

### Backend Integration Tests

**Routes to: be-dev agent | Framework: Jest + Supertest**

Write integration tests for API endpoints using Supertest.

Steps:
1. Create or open the corresponding `*.integration.spec.ts` file in `test/`.
2. Set up the NestJS test module with `Test.createTestingModule()`.
3. Override providers with test doubles where needed.
4. Write tests covering:
   - Each HTTP method and route (GET, POST, PUT, PATCH, DELETE).
   - Request validation (invalid DTOs return 400).
   - Authentication and authorisation (401, 403 responses).
   - Pagination, filtering, and sorting query parameters.
   - Error responses match the expected format.
5. Run `npx jest test/<file> --verbose` to verify.

### Frontend Component Tests

**Routes to: fe-dev agent | Framework: Jest + React Testing Library**

Write tests for React components with a focus on user behaviour.

Steps:
1. Create or open the corresponding `*.spec.tsx` file.
2. Render the component with necessary providers (theme, auth, router).
3. Write tests covering:
   - Component renders without errors.
   - User interactions (clicks, form inputs, navigation).
   - Conditional rendering based on props or state.
   - Loading, error, and empty states.
   - Accessibility (roles, labels, keyboard interaction).
4. Run `npx jest <file> --verbose` to verify.

Guidelines:
- Query elements by role, label, or `data-testid` — never by CSS class.
- Test behaviour, not implementation details. Avoid testing internal state directly.
- Use `userEvent` over `fireEvent` for realistic interaction simulation.

### E2E Tests

**Routes to: fe-dev agent | Framework: Playwright**

Write end-to-end tests for complete user flows.

Steps:
1. Create or open the corresponding `*.spec.ts` file in `e2e/`.
2. Create or update Page Objects for the pages involved.
3. Write tests covering:
   - Complete user journeys (e.g., sign up → create item → verify item appears).
   - Cross-page navigation and data persistence.
   - Form submission with validation errors and success.
   - Authentication flows (login, logout, protected routes).
   - Responsive behaviour at key breakpoints.
4. Run `npx playwright test <file>` to verify.
5. Review the HTML report: `npx playwright show-report`.

### Full-Stack Tests

**Routes to: be-dev then fe-dev agents**

Write tests across the full stack for a feature.

Steps:
1. **Backend unit tests**: Cover service logic for the feature.
2. **Backend integration tests**: Cover API endpoints with Supertest.
3. **Frontend component tests**: Cover UI components with React Testing Library.
4. **E2E tests**: Cover the user flow end-to-end with Playwright.
5. Run the full test suite to verify nothing is broken.

## Coverage Targets

| Layer | Statements | Branches | Functions | Lines |
|-------|-----------|----------|-----------|-------|
| Backend services | 85% | 75% | 85% | 85% |
| Backend controllers | 80% | 70% | 80% | 80% |
| Frontend components | 75% | 65% | 75% | 75% |
| E2E (flow coverage) | Key user journeys covered | — | — | — |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--coverage` | Run with coverage report | `false` |
| `--watch` | Run in watch mode | `false` |
| `--update-snapshots` | Update snapshot files | `false` |

## Examples

```
/test unit src/modules/users/users.service.ts
/test integration src/modules/users/users.controller.ts
/test component src/components/features/UserProfile.tsx
/test e2e user-registration
/test full-stack notifications
```
