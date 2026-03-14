# Playwright E2E Testing Stack

## Page Object Model

- Create a Page Object for each distinct page or major UI section.
- Page Objects encapsulate selectors and actions — tests read like user stories.
- Store Page Objects in `e2e/pages/` or `e2e/models/`.
- Methods should return the Page Object (`this`) or the next Page Object for fluent chaining.

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
    return this;
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('login-button').click();
    return new DashboardPage(this.page);
  }
}
```

## Test Fixtures

- Extend Playwright's `test` with custom fixtures for common setup (authenticated user, seeded data).
- Define fixtures in `e2e/fixtures/` and export a custom `test` object.
- Use `storageState` for authentication — log in once, reuse session across tests.
- Create a global setup script (`global-setup.ts`) for one-time authentication and data seeding.

```typescript
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'e2e/.auth/user.json' });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
```

## Selector Strategy

- **Prefer `data-testid` attributes** for all interactive and assertable elements.
- Use `page.getByTestId()` as the primary selector method.
- Use `page.getByRole()` for accessibility-aligned selectors (buttons, links, headings).
- Use `page.getByText()` or `page.getByLabel()` for user-visible content.
- Never use CSS class selectors or XPath — they are brittle and break on refactors.
- Add `data-testid` attributes during development, not as an afterthought.

## Visual Regression Testing

- Use `expect(page).toHaveScreenshot()` for visual comparisons.
- Store baseline screenshots in version control under `e2e/screenshots/`.
- Set `maxDiffPixelRatio` or `maxDiffPixels` thresholds to tolerate minor rendering differences.
- Run visual tests in a consistent environment (CI with a fixed viewport and OS).
- Update baselines deliberately with `--update-snapshots` when UI intentionally changes.

## Network Interception

- Use `page.route()` to intercept and mock API responses for isolated UI testing.
- Mock slow or unreliable third-party APIs to keep tests fast and deterministic.
- Use `page.waitForResponse()` to assert on specific API calls.
- Record and replay network traffic with HAR files for complex flows.

## Multi-Browser Testing

- Configure `playwright.config.ts` with projects for Chromium, Firefox, and WebKit.
- Run all browsers in CI. Use a single browser locally for speed during development.
- Use `test.describe.configure({ mode: 'parallel' })` for independent tests.
- Be aware of browser-specific behaviours (e.g., date pickers, file dialogs).

## Accessibility Testing

- Integrate `@axe-core/playwright` for automated accessibility checks.
- Run `checkA11y()` on every page during E2E flows.
- Assert WCAG 2.1 AA compliance as a minimum.
- Test keyboard navigation flows explicitly — tab order, focus management, escape to close.

```typescript
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/dashboard');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## CI Configuration

- Run Playwright in CI with `npx playwright test --reporter=html,github`.
- Use `playwright install --with-deps` in CI to install browser binaries.
- Upload the HTML report and trace files as CI artefacts on failure.
- Set reasonable timeouts: `timeout: 30000` per test, `expect.timeout: 5000` for assertions.
- Use sharding (`--shard=1/4`) for parallel execution across CI runners.

## Trace and Screenshot Capture

- Enable tracing on first retry: `use: { trace: 'on-first-retry' }`.
- Capture screenshots on failure: `use: { screenshot: 'only-on-failure' }`.
- Use `test.info().attach()` to add custom artefacts (logs, API responses) to test reports.
- View traces locally with `npx playwright show-trace trace.zip`.

## Performance Metrics

- Use `page.evaluate(() => performance.getEntriesByType('navigation'))` for page load metrics.
- Measure Core Web Vitals (LCP, FID, CLS) in key user flows.
- Set performance budgets and fail tests that exceed thresholds.
- Track metrics over time — do not rely on single-run measurements.
