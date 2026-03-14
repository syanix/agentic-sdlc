# React SPA with Vite

## Vite Configuration and Environment Variables

- Configure Vite in `vite.config.ts`. Use the `@vitejs/plugin-react` plugin for JSX and Fast Refresh.
- Prefix all client-exposed environment variables with `VITE_`. Access them via `import.meta.env.VITE_*`.
- Never expose secrets in `VITE_` variables — they are embedded in the client bundle.
- Use `.env.local` for local overrides (gitignored). Use `.env` for shared defaults.
- Define path aliases in `vite.config.ts` under `resolve.alias` (e.g., `@/` maps to `src/`). Mirror them in `tsconfig.json`.

## React Router v7

- Use `createBrowserRouter` with `RouterProvider` for data-aware routing.
- Define routes in a centralised `src/routes.tsx` file using `createBrowserRouter([...])`.
- Use `loader` functions for pre-fetching route data and `action` functions for mutations.
- Use `<Outlet />` in layout routes for nested rendering.
- Use `useNavigate()` for programmatic navigation. Use `<Link>` and `<NavLink>` for declarative links.
- Handle 404s with a catch-all `path: "*"` route at the end of your route configuration.
- Use `useParams()`, `useSearchParams()`, and `useLoaderData()` to access route context.

## TanStack Query for Server State

- Wrap the app in `<QueryClientProvider>` with a configured `QueryClient`.
- Use `useQuery` for all read operations. Define query keys as structured arrays: `['todos', { status }]`.
- Use `useMutation` for all write operations. Invalidate related queries in `onSuccess`.
- Set sensible defaults: `staleTime: 5 * 60 * 1000` to avoid unnecessary refetches.
- Extract queries into custom hooks: `useTodos()`, `useUser(id)`. Co-locate them with the feature they serve.
- Use `queryClient.prefetchQuery()` in route loaders for instant page transitions.

## Zustand for Client State

- Create small, focused stores — one per domain (e.g., `useAuthStore`, `useUIStore`).
- Define stores with `create<StateType>()` and expose actions alongside state.
- Never store server-fetched data in Zustand — that belongs in TanStack Query.
- Use Zustand selectors to subscribe to specific slices and avoid unnecessary re-renders.
- Use `persist` middleware for state that must survive page reloads (e.g., user preferences).

## Lazy Loading with React.lazy and Suspense

- Use `React.lazy()` for route-level code splitting. Wrap lazy routes in `<Suspense>`.
- Provide meaningful loading fallbacks — skeleton screens over empty spinners.
- Preload critical lazy components on hover or intent using dynamic `import()`.
- Avoid lazy-loading small components — the overhead outweighs the benefit.
- Group related components into the same chunk using magic comments: `import(/* webpackChunkName: "dashboard" */ ...)`.

## Form Handling with react-hook-form and Zod

- Use `react-hook-form` with `@hookform/resolvers/zod` for all forms.
- Define Zod schemas for every form. Share schemas with backend validation where possible.
- Use `useForm<SchemaType>()` with `zodResolver(schema)` for type-safe form state.
- Display field-level errors inline. Disable submit buttons during submission.
- Handle server validation errors by mapping them to fields via `setError()`.
- Use `useFieldArray` for dynamic lists of form fields.

## Tailwind CSS Integration

- Install Tailwind with `@tailwindcss/vite` plugin. Configure in `tailwind.config.ts`.
- Use utility classes directly. Avoid custom CSS unless absolutely necessary.
- Follow mobile-first responsive design: `base` then `sm` then `md` then `lg` then `xl`.
- Use `clsx` or a `cn()` utility for conditional class merging — never string concatenation.
- Prefer `gap` over margin for spacing between flex and grid children.
- Use CSS variables for theme colours to support dark mode and runtime theming.

## API Client Setup

- Create a centralised API client in `src/lib/api.ts` using `fetch` or `axios`.
- Configure a base URL from `import.meta.env.VITE_API_URL`. Set default headers (auth tokens, content type).
- Attach authentication tokens via an interceptor or wrapper function.
- Type all API responses with TypeScript interfaces. Never use `any` for API data.
- Handle common HTTP errors (401, 403, 500) in the client layer — redirect to login on 401.

## Error Boundaries

- Create a reusable `<ErrorBoundary>` component using `react-error-boundary`.
- Wrap the app root in a top-level error boundary with a full-page fallback.
- Add granular error boundaries around feature sections to isolate failures.
- Use `useErrorBoundary()` to programmatically trigger error boundaries from event handlers.
- Log errors to an external service (e.g., Sentry) in the `onError` callback.
- Provide "Try again" buttons that call `resetErrorBoundary` in fallback components.

## HMR and Development Workflow

- Vite provides instant Hot Module Replacement out of the box — do not disable it.
- Use `vite --open` to launch the browser automatically on dev server start.
- Use `vite preview` to test production builds locally before deployment.
- Configure proxy rules in `vite.config.ts` under `server.proxy` to avoid CORS issues during development.

## Project Structure

```
src/
  components/
    ui/             # Reusable primitives (buttons, inputs, modals)
    features/       # Feature-specific composed components
    shared/         # App-wide components (headers, footers, layouts)
  hooks/            # Custom React hooks
  lib/              # API client, utilities, helpers
  pages/            # Top-level page components (one per route)
  routes.tsx        # Centralised route definitions
  stores/           # Zustand stores
  types/            # Shared TypeScript types and API interfaces
  styles/           # Global CSS and Tailwind configuration
```

- Co-locate feature components, hooks, and queries together when they are tightly coupled.
- Keep `lib/` for pure utility functions with no React dependency.
- Extract reusable logic into custom hooks in `src/hooks/`.
