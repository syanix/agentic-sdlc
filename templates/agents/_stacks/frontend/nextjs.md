# Next.js Frontend Stack (App Router)

## App Router Fundamentals

- Use the `app/` directory exclusively. Do not mix with the Pages Router.
- Structure routes as `app/(group)/feature/page.tsx` using route groups for logical organisation.
- Every route segment can have: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Use `layout.tsx` for shared UI that persists across navigations. Layouts do not re-render on navigation.
- Use `template.tsx` when you need a fresh instance on every navigation (e.g., enter/exit animations).

## Server Components vs Client Components

- **Default to Server Components.** Only add `'use client'` when you need interactivity, browser APIs, or React hooks.
- Server Components can: fetch data, access backend resources, keep secrets server-side, reduce client bundle.
- Client Components are required for: `useState`, `useEffect`, event handlers, browser APIs, third-party client libraries.
- Push `'use client'` boundaries as low as possible in the component tree.
- Never import a Server Component into a Client Component — pass it as `children` or a prop instead.

## Data Fetching

- **Server Actions**: Use for mutations (form submissions, data writes). Define with `'use server'` directive.
- **Route Handlers**: Use `app/api/` routes for webhook endpoints, third-party integrations, or when you need full HTTP control.
- **RSC Data Fetching**: Fetch data directly in Server Components using `async/await`. Use `fetch` with caching options.
- Deduplicate requests automatically via React's `fetch` cache — identical requests in the same render are batched.
- Use `revalidatePath()` or `revalidateTag()` for on-demand cache invalidation after mutations.
- Prefer server actions over client-side API calls for data mutations.

## Shadcn/ui Integration

- Install components individually via `npx shadcn@latest add <component>`.
- Components are copied into `src/components/ui/` — they are your code, customise freely.
- Compose complex UI from primitive Shadcn components rather than building from scratch.
- Use the `cn()` utility from `lib/utils` for conditional class merging.
- Follow Shadcn patterns for consistent theming: CSS variables in `globals.css`, `tailwind.config.ts` references.

## Tailwind CSS

- Use Tailwind utility classes directly. Avoid custom CSS unless absolutely necessary.
- Use `@apply` sparingly — only for highly reused patterns that cannot be extracted to components.
- Follow mobile-first responsive design: `base` → `sm` → `md` → `lg` → `xl`.
- Use CSS variables for theme colours (integrates with Shadcn theming).
- Prefer `gap` over margin for spacing between flex/grid children.
- Use `clsx` or `cn()` for conditional classes — never string concatenation.

## Form Handling

- Use `react-hook-form` with `@hookform/resolvers/zod` for form state and validation.
- Define Zod schemas for all forms. Share schemas between client validation and server actions.
- Use Shadcn `<Form>` components that integrate with `react-hook-form`.
- Display field-level errors immediately. Show form-level errors in a summary.
- Disable submit buttons during submission. Show loading states.
- Handle server-side validation errors by mapping them back to form fields.

## Authentication

- Use NextAuth.js (Auth.js) with the App Router adapter.
- Protect routes using middleware in `middleware.ts` — check session before rendering.
- Use `auth()` helper in Server Components for session access.
- Use `useSession()` in Client Components (wrap app in `<SessionProvider>`).
- Store session in a database for server-side session management.
- Implement role-based access control by extending the session type.

## Image Optimisation

- Always use `next/image` for images. Never use raw `<img>` tags.
- Set explicit `width` and `height` or use `fill` with a sized container.
- Use `priority` for above-the-fold images (LCP candidates).
- Configure `remotePatterns` in `next.config.js` for external image domains.
- Use `placeholder="blur"` with `blurDataURL` for progressive loading.

## Fonts and Metadata

- Use `next/font` for font loading — eliminates layout shift and self-hosts fonts.
- Define metadata using the `metadata` export or `generateMetadata()` for dynamic pages.
- Include `title`, `description`, `openGraph`, and `twitter` metadata on all pages.
- Use `metadata.metadataBase` for absolute URL resolution.

## Streaming and Suspense

- Wrap slow data-fetching components in `<Suspense>` with meaningful fallbacks.
- Use `loading.tsx` for route-level loading states (wraps the page in Suspense automatically).
- Use `useTransition` for non-urgent UI updates that should not block the interface.
- Stream long responses with `ReadableStream` in route handlers where appropriate.

## Performance

- Analyse bundles with `@next/bundle-analyzer` to identify heavy dependencies.
- Use `next/dynamic` with `{ ssr: false }` for components that should only render on the client.
- Lazy-load below-the-fold components and heavy libraries.
- Prefer Server Components for data display — they add zero bytes to the client bundle.
- Minimise `'use client'` surface area to reduce JavaScript shipped to the browser.
- Use `React.memo`, `useMemo`, and `useCallback` judiciously — only when profiling confirms a bottleneck.

## Error Handling

- Create `error.tsx` boundaries at appropriate route segments. They must be Client Components.
- Implement `global-error.tsx` for root layout errors.
- Use `not-found.tsx` for 404 states. Trigger with `notFound()` from `next/navigation`.
- Log errors to an external service (e.g., Sentry) in error boundaries.
- Show user-friendly error messages with retry options.

## Project Structure

```
src/
  app/              # Routes, layouts, pages
  components/
    ui/             # Shadcn/ui primitives
    features/       # Feature-specific composed components
    shared/         # Shared components (headers, footers)
  lib/              # Utilities, API clients, helpers
  hooks/            # Custom React hooks
  types/            # Shared TypeScript types
  styles/           # Global styles, Tailwind config
```

- Co-locate feature-specific components near their routes when practical.
- Extract reusable logic into custom hooks in `src/hooks/`.
- Keep `lib/` for pure utility functions with no React dependency.
