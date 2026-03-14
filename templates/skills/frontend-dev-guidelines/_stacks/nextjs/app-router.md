# Next.js App Router Patterns

## File-Based Routing Conventions

- Routes are defined by the folder structure under `app/`
- Each route segment maps to a URL segment: `app/dashboard/settings/page.tsx` -> `/dashboard/settings`
- Use `(groups)` for route organisation without affecting URLs: `app/(auth)/login/page.tsx` -> `/login`
- Use `[param]` for dynamic segments: `app/users/[id]/page.tsx`
- Use `[...slug]` for catch-all segments, `[[...slug]]` for optional catch-all
- Co-locate related files within route folders (components, utils, hooks)

---

## Special Files

### Core Files
- `layout.tsx` - shared UI wrapping child routes, persists across navigations
- `page.tsx` - unique UI for a route, makes the route publicly accessible
- `template.tsx` - like layout but remounts on navigation (useful for animations)
- `loading.tsx` - loading UI shown while route content loads (wraps page in Suspense)
- `error.tsx` - error UI shown when a route segment throws (must be a Client Component)
- `not-found.tsx` - UI shown when `notFound()` is called or no route matches

### Nesting Rules
- Layouts nest automatically: root layout wraps all pages
- Each route segment can define its own layout, loading, and error boundaries
- Error boundaries catch errors from the page and all child segments
- Loading boundaries wrap the page in a Suspense boundary automatically

---

## Server Components vs Client Components

### Decision Framework
Use **Server Components** (default) when:
- Fetching data from databases or APIs
- Accessing backend resources directly
- Keeping sensitive logic on the server (tokens, API keys)
- Rendering static or mostly static content
- Reducing client JavaScript bundle size

Use **Client Components** (`'use client'`) when:
- Using browser APIs (window, document, localStorage)
- Adding event listeners (onClick, onChange, onSubmit)
- Using React hooks (useState, useEffect, useReducer)
- Requiring real-time interactivity (forms, toggles, animations)
- Integrating third-party libraries that use browser APIs

### Composition Rules
- Push `'use client'` as far down the tree as possible
- Server Components can import and render Client Components
- Client Components cannot import Server Components (pass them as children instead)
- Share data between Server and Client via props serialisation (no functions, no classes)

---

## Data Fetching in Server Components

- Fetch data directly in Server Components using `async/await`
- Use `fetch()` with Next.js extensions for caching and revalidation
- Deduplicate requests automatically with React's request memoisation
- Configure revalidation: `{ next: { revalidate: 3600 } }` or `{ cache: 'no-store' }`
- Prefer fetching data in layouts for shared data, in pages for route-specific data
- Use parallel data fetching with `Promise.all()` to avoid request waterfalls

---

## Server Actions for Mutations

- Define Server Actions with `'use server'` directive
- Use for form submissions, data mutations, and revalidation triggers
- Call `revalidatePath()` or `revalidateTag()` after mutations to update cached data
- Handle validation errors and return them to the client
- Use `useActionState` (React 19) for form state management with Server Actions
- Implement optimistic updates with `useOptimistic` for responsive UI

---

## Route Handlers

- Define API routes in `app/api/*/route.ts` files
- Export named functions matching HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use Route Handlers for webhooks, third-party API proxying, and non-UI responses
- Prefer Server Actions over Route Handlers for form mutations
- Access request data via the `Request` Web API
- Return responses using the `Response` or `NextResponse` API

---

## Metadata and SEO

- Export `metadata` object or `generateMetadata()` function from layouts and pages
- Define default metadata in the root layout; override in child segments
- Include `title`, `description`, `openGraph`, and `twitter` metadata
- Use `generateMetadata()` for dynamic metadata based on route parameters
- Configure `robots.ts` and `sitemap.ts` for search engine crawling
- Use `<Link>` prefetching for faster perceived navigation

---

## Image and Font Optimisation

### Images
- Use `next/image` for all images: automatic optimisation, lazy loading, and sizing
- Set explicit `width` and `height` or use `fill` with a sized container
- Configure remote image domains in `next.config.ts`
- Use `priority` prop for above-the-fold hero images (disables lazy loading)

### Fonts
- Use `next/font` for automatic font optimisation and self-hosting
- Load fonts in the root layout and apply via CSS variable
- Prefer variable fonts for flexibility and smaller bundle size
- Set `display: 'swap'` to prevent invisible text during font loading

---

## Streaming and Suspense

- Use `loading.tsx` for automatic route-level Suspense boundaries
- Wrap slow components in `<Suspense>` with meaningful fallbacks
- Stream long-running data fetches to show progressive UI
- Use `React.lazy()` sparingly in App Router (prefer Server Component streaming)
- Place Suspense boundaries strategically to show useful partial content early

---

## Middleware

- Define middleware in `middleware.ts` at the project root
- Use for authentication checks, redirects, header modifications, and geolocation
- Configure `matcher` to limit middleware to specific routes
- Keep middleware lightweight; avoid heavy computation or database calls
- Chain middleware logic with early returns for clarity
- Access and modify request/response headers via `NextRequest`/`NextResponse`
