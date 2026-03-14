# Vitest Testing Stack

## File Naming and Location

- Name test files `*.spec.ts` for unit tests, `*.integration.spec.ts` for integration tests.
- Co-locate unit tests alongside source files: `user.service.ts` → `user.service.spec.ts`.
- Place integration tests in a `test/` directory at the project root.
- Place test utilities, fixtures, and factories in `test/utils/`.

## Configuration

- Define configuration in `vitest.config.ts` at the project root. Extend from `vite.config.ts` when sharing Vite settings.
- Use workspace configuration (`vitest.workspace.ts`) for monorepo setups to run multiple test projects.
- Set `globals: true` in configuration to avoid explicit imports of `describe`, `it`, and `expect`.
- Configure path aliases to match `tsconfig.json` using `resolve.alias`.

## Test Structure

- Use `describe` blocks to group tests by class or function, then by method or scenario.
- Use `it` (not `test`) with clear, behaviour-focused names: `it('should return 404 when user does not exist')`.
- Follow the Arrange-Act-Assert pattern within each test.
- Keep tests focused — one assertion per logical behaviour.

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

## Mocking Strategies

- **`vi.mock()`**: Mock entire modules. Hoisted automatically to the top of the file.
- **`vi.spyOn()`**: Spy on individual methods while preserving the original implementation.
- **`vi.fn()`**: Create standalone mock functions for callbacks and injected dependencies.
- Use `vi.mocked()` to get typed mock wrappers for better TypeScript inference.
- Prefer dependency injection over `vi.mock()` where possible.
- Call `vi.clearAllMocks()` in `beforeEach` to reset mock state between tests.

## Coverage

- Enable coverage with `--coverage` flag. Use the `v8` provider for speed or `istanbul` for accuracy.
- Configure `coverage.include` and `coverage.exclude` in `vitest.config.ts`.
- Target minimums: statements 80%, branches 70%, functions 80%, lines 80%.
- Do not chase 100% coverage — focus on critical paths and edge cases.
- Use `coverage.reporter` to output `text`, `lcov`, and `html` formats for CI and local review.

## Component Testing with Testing Library

- Install `@testing-library/react` (or the appropriate framework variant) and `@testing-library/jest-dom`.
- Configure `environment: 'jsdom'` or `environment: 'happy-dom'` in the Vitest config.
- Use `render()`, `screen`, and `userEvent` for component interaction tests.
- Prefer querying by role, label, or text over test IDs for accessibility-aligned tests.

## Snapshot Testing

- Use `expect(value).toMatchSnapshot()` sparingly — only for stable, serialisable outputs.
- Prefer inline snapshots (`toMatchInlineSnapshot()`) for small values to keep context visible.
- Review snapshot changes carefully during code review.
- Update snapshots intentionally with `--update` when the output genuinely changes.

## In-Source Testing

- Vitest supports tests inside source files using `if (import.meta.vitest)` blocks.
- Use in-source testing for small utility functions where co-location reduces overhead.
- Configure `define: { 'import.meta.vitest': 'undefined' }` in production builds to tree-shake test code.
- Prefer separate test files for any non-trivial logic.

## Browser Mode

- Enable browser mode with `browser.enabled: true` for tests that require a real DOM.
- Configure a provider (`playwright` or `webdriverio`) in `vitest.config.ts`.
- Use browser mode for visual regression and interaction tests that cannot rely on `jsdom`.
- Keep browser-mode tests in a separate workspace project to avoid slowing unit test runs.
