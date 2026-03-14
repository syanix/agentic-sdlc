# Cypress E2E Testing Stack

## File Naming and Organisation

- Name spec files `*.cy.ts` and place them in `cypress/e2e/`.
- Organise specs by feature or page: `cypress/e2e/auth/login.cy.ts`, `cypress/e2e/dashboard/overview.cy.ts`.
- Place reusable commands in `cypress/support/commands.ts`.
- Place fixtures (static test data) in `cypress/fixtures/`.
- Place component tests alongside source files: `Button.cy.tsx` next to `Button.tsx`.

## Test Structure

- Use `describe` blocks to group tests by feature or user flow.
- Use `it` with clear, behaviour-focused names: `it('should display an error when credentials are invalid')`.
- Keep tests independent — each `it` block must not depend on the state from another test.
- Use `beforeEach` to navigate and set up preconditions. Prefer API calls or `cy.session()` over UI-based login.

```typescript
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should redirect to dashboard on valid credentials', () => {
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Selectors Strategy

- Use `data-cy` attributes as the primary selector strategy: `[data-cy="submit-button"]`.
- Never rely on CSS classes, element IDs, or DOM structure for selectors — these are brittle.
- Add `data-cy` attributes to all interactive and assertable elements during development.
- Create selector helpers in `cypress/support/` for commonly referenced elements.

## Custom Commands

- Define custom commands in `cypress/support/commands.ts` using `Cypress.Commands.add()`.
- Use custom commands for repeated workflows: `cy.login()`, `cy.createUser()`, `cy.resetDatabase()`.
- Prefer API-based commands over UI interactions for setup tasks (faster and more reliable).
- Add TypeScript declarations in `cypress/support/index.d.ts` for type safety.

```typescript
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email], () => {
    cy.request('POST', '/api/auth/login', { email, password });
  });
});
```

## Network Intercepts

- Use `cy.intercept()` to stub, spy on, or modify network requests.
- Stub API responses for deterministic tests: `cy.intercept('GET', '/api/users', { fixture: 'users.json' })`.
- Use `cy.wait('@alias')` to wait for specific requests before asserting.
- Alias intercepts with `.as('requestName')` for readable waits and assertions.

```typescript
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');
cy.get('[data-cy="user-list"]').children().should('have.length', 3);
```

## Waiting and Retry-ability

- Never use `cy.wait(milliseconds)` for arbitrary delays — rely on Cypress's built-in retry-ability.
- Use assertions that automatically retry: `.should('be.visible')`, `.should('have.text', 'Done')`.
- Use `cy.wait('@alias')` to wait for network requests instead of fixed timeouts.
- Configure `defaultCommandTimeout` in `cypress.config.ts` for slower environments (CI).

## Fixtures and Test Data

- Store static response data as JSON files in `cypress/fixtures/`.
- Reference fixtures in intercepts: `{ fixture: 'users.json' }`.
- Use factory functions in `cypress/support/` for dynamic test data generation.
- Seed the database via API calls in `before` or `beforeEach` hooks for integration-level tests.

## Component Testing

- Configure component testing in `cypress.config.ts` with the appropriate framework bundler (`vite` or `webpack`).
- Mount components with `cy.mount(<Component />)` in `*.cy.tsx` files.
- Use the same `cy.get()`, `cy.click()`, and assertion patterns as E2E tests.
- Prefer component tests for isolated UI logic; use E2E tests for full user flows.

## CI Configuration

- Run Cypress in headless mode: `cypress run --browser chrome`.
- Use `cypress run --record` with a project key to send results to Cypress Cloud.
- Start the application server before Cypress using `start-server-and-test` or a CI script.
- Configure video recording (`video: true`) and screenshot capture on failure in `cypress.config.ts`.
- Parallelise test runs across CI machines with `--parallel` when using Cypress Cloud.

## Visual Testing

- Use `cy.screenshot()` to capture visual snapshots at key points.
- Integrate with visual regression tools (Percy, Applitools, or `cypress-image-snapshot`) for diff-based checks.
- Capture screenshots after the page stabilises — wait for animations and network requests to complete.
- Store baseline images in version control and review visual diffs in pull requests.
