# React + Vite Frontend Patterns

## Routing

- Use React Router v7 with file-based or config-based route definitions
- Define lazy routes with `React.lazy()` and `Suspense` for code splitting at the route level
- Use loaders to fetch data before rendering; co-locate loader logic with the route component
- Implement error boundaries per route with `errorElement` for granular error handling
- Use `useNavigate()` for programmatic navigation and `<Link>` for declarative links
- Protect routes with wrapper components that check authentication state

---

## Server State

- Use TanStack Query (React Query) for all server state management
- Structure query keys as arrays with hierarchical namespaces: `['users', userId, 'orders']`
- Create custom hooks per query: `useUser(id)`, `useOrders(userId)`
- Configure `staleTime` and `gcTime` appropriately — avoid refetching stable data on every mount
- Use `useMutation` with `onSuccess` callbacks to invalidate related queries after writes
- Implement optimistic updates for frequently used mutations to improve perceived performance

```typescript
const useUser = (id: string) =>
  useQuery({
    queryKey: ['users', id],
    queryFn: () => api.users.getById(id),
    staleTime: 5 * 60 * 1000,
  });
```

---

## Client State

- Use Zustand for client-only state (UI preferences, filters, modal state)
- Keep stores small and focused: one store per domain concern
- Use selectors to subscribe to specific slices and avoid unnecessary re-renders
- Apply middleware for persistence (`persist`), logging (`devtools`), or computed values
- Never store server-fetched data in Zustand; that belongs in TanStack Query

---

## Component Patterns

- Prefer composition over inheritance; build complex UIs from small, focused components
- Use compound components for related elements that share implicit state (Tabs, Accordion)
- Extract render logic into custom hooks when components grow beyond ~100 lines
- Use the children prop and render props for flexible, reusable container components
- Co-locate styles, tests, and types with the component file

---

## Form Management

- Use `react-hook-form` for form state, validation, and submission handling
- Define validation schemas with Zod and integrate via `@hookform/resolvers/zod`
- Use `useFieldArray` for dynamic lists of form fields
- Display validation errors inline next to the relevant field
- Disable the submit button during submission and show loading state
- Reset form state after successful submission with `reset()`

```typescript
const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

---

## Performance

- Use `React.lazy()` with `Suspense` for route-level and heavy component code splitting
- Apply `React.memo()` selectively to components that re-render with the same props frequently
- Use `useDeferredValue` for non-urgent updates like search filtering over large lists
- Use `useCallback` and `useMemo` only when passing callbacks to memoised children or computing expensive values
- Configure Vite's `build.rollupOptions.output.manualChunks` for optimised bundle splitting
- Analyse bundle size with `rollup-plugin-visualizer` and address large dependencies

---

## API Integration

- Create a typed fetch wrapper that handles base URL, auth headers, and response parsing
- Centralise error handling: map HTTP status codes to domain-specific error types
- Use request interceptors for attaching auth tokens and response interceptors for token refresh
- Define API functions by resource: `api.users.getById()`, `api.orders.create()`
- Type all request and response payloads; share types with the backend where possible

---

## Testing Integration

- Use Vitest as the test runner (native Vite integration, Jest-compatible API)
- Test components with `@testing-library/react`: render, query, interact, assert
- Prefer `getByRole`, `getByLabelText`, and `getByText` over `getByTestId`
- Mock API calls with MSW (Mock Service Worker) for realistic network-level mocking
- Write integration tests for user flows spanning multiple components
- Co-locate test files with components: `UserProfile.test.tsx` next to `UserProfile.tsx`

```typescript
const server = setupServer(
  http.get('/api/users/:id', () =>
    HttpResponse.json({ id: '1', name: 'Test User' }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
