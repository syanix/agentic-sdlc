# Astro Frontend Patterns

## Islands Architecture

- Use Astro components (`.astro`) for static content by default — zero JavaScript shipped
- Add hydration directives only when interactivity is required:
  - `client:load` — hydrate immediately on page load (above-the-fold interactive elements)
  - `client:idle` — hydrate once the browser is idle (non-critical interactive elements)
  - `client:visible` — hydrate when the component scrolls into view (below-the-fold content)
  - `client:media` — hydrate when a media query matches (mobile-only components)
  - `client:only="react"` — render only on the client, skip server rendering entirely
- Prefer `client:visible` and `client:idle` over `client:load` to minimise initial JavaScript

---

## Content Collections

- Define collections in `src/content/config.ts` with Zod schemas for type-safe frontmatter
- Organise content by collection: `src/content/blog/`, `src/content/docs/`
- Use `getCollection()` and `getEntry()` to query content with full type inference
- Validate content at build time; schema errors surface as build failures
- Use `reference()` to create typed relationships between collections

```typescript
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});
```

---

## Routing

- Use file-based routing in `src/pages/` — each `.astro` or `.md` file becomes a route
- Create dynamic routes with bracket syntax: `[slug].astro`, `[...path].astro`
- Implement `getStaticPaths()` for dynamic routes in static builds
- Use rest parameters (`[...slug]`) for catch-all routes and nested paths
- Return 404 by checking data availability and using `Astro.redirect()` or returning a 404 response

---

## View Transitions

- Enable page transitions with `<ViewTransitions />` in the `<head>` layout
- Use `transition:name` to animate specific elements across page navigations
- Apply `transition:persist` to keep elements alive across navigations (audio players, navigation state)
- Use `transition:animate` with built-in animations: `fade`, `slide`, `none`
- Handle transition lifecycle events: `astro:before-preparation`, `astro:after-swap`
- Test transitions with JavaScript disabled; pages should work without them

---

## Framework Integration

- Install framework integrations via `astro add react`, `astro add svelte`, or `astro add vue`
- Use framework components only when you need client-side interactivity
- Pass data from Astro to framework components via props; avoid fetching in islands
- Share state between islands using `nanostores` for cross-framework reactivity
- Keep framework-specific components in dedicated directories: `src/components/react/`

---

## Data Fetching

- Fetch data in the frontmatter of `.astro` files — it runs at build time (SSG) or request time (SSR)
- Use `Astro.glob()` for importing local files and `getCollection()` for content collections
- Create API endpoints in `src/pages/api/` with exported `GET`, `POST` handlers
- Use `fetch()` in frontmatter for external API calls; responses are not shipped to the client
- Cache expensive fetches with appropriate headers when using SSR mode

---

## Performance

- Astro ships zero JavaScript by default; every script byte must be deliberately opted into
- Use `<Image />` from `astro:assets` for automatic image optimisation and responsive sizing
- Inline critical CSS automatically — Astro scopes styles per component
- Prefer static generation (`output: 'static'`) unless server-side rendering is genuinely needed
- Audit island hydration: each `client:*` directive adds JavaScript — justify every one
- Use `<link rel="prefetch">` or Astro's built-in prefetching for anticipated navigations

---

## SEO and Head Management

- Set page metadata in the layout's `<head>` using props passed from each page
- Create a reusable `<SEO />` component that accepts title, description, and Open Graph props
- Generate a `sitemap.xml` with `@astrojs/sitemap` integration
- Use canonical URLs to avoid duplicate content issues
- Add structured data (JSON-LD) for rich search results where appropriate
- Configure `robots.txt` to guide crawler behaviour
