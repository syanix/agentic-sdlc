# Astro Frontend Stack

## Islands Architecture and Partial Hydration

- Astro renders all components to static HTML by default. No JavaScript is shipped unless explicitly requested.
- Use hydration directives to make individual components interactive (islands):
  - `client:load` — Hydrate immediately on page load. Use for above-the-fold interactive elements.
  - `client:idle` — Hydrate once the browser is idle. Use for lower-priority interactive components.
  - `client:visible` — Hydrate when the component scrolls into view. Use for below-the-fold content.
  - `client:media` — Hydrate when a CSS media query matches. Use for mobile/desktop-specific interactions.
  - `client:only="react"` — Skip server rendering entirely. Use only when the component cannot render on the server.
- Keep islands small and isolated. Push interactivity to leaf components rather than wrapping large trees.
- Never hydrate a component that does not need client-side interactivity.

## Content Collections

- Define collections in `src/content/config.ts` using `defineCollection()` with Zod schemas.
- Store collection entries as Markdown or MDX files in `src/content/<collection>/`.
- Use `getCollection()` and `getEntry()` for type-safe content queries.
- Validate frontmatter at build time — schema mismatches produce clear error messages.
- Use `reference()` in schemas to create type-safe relations between collections.
- Prefer content collections over `Astro.glob()` for structured content. Use `Astro.glob()` only for unstructured file imports.

## File-Based Routing and Dynamic Routes

- Place pages in `src/pages/`. File names map directly to URL paths.
- Use `[param].astro` for dynamic segments and `[...slug].astro` for catch-all routes.
- Export `getStaticPaths()` from dynamic route pages to define all valid paths at build time.
- Use route groups with directories: `src/pages/blog/[slug].astro` creates `/blog/:slug`.
- Return `params` and optional `props` from `getStaticPaths()` to pass data to the page without refetching.

## View Transitions

- Add `<ViewTransitions />` to your `<head>` in the base layout to enable SPA-style page transitions.
- Use `transition:name` to pair elements across pages for morphing animations.
- Use `transition:animate` with built-in presets: `fade`, `slide`, `none`.
- Apply `transition:persist` to keep component state (e.g., audio players, video) across navigations.
- Respect `prefers-reduced-motion` — Astro falls back to no animation automatically.

## UI Framework Integration

- Install framework integrations via `npx astro add react`, `npx astro add svelte`, or `npx astro add vue`.
- Place framework components in `src/components/` alongside Astro components.
- Use Astro components (`.astro`) for static layout and structure. Use framework components only when you need interactivity.
- Mix frameworks on the same page — each island hydrates independently.
- Pass data from Astro to framework components via props. Never import Astro components inside framework components.

## Image Optimisation with astro:assets

- Import images from `src/assets/` and pass them to the `<Image />` component from `astro:assets`.
- Always use `<Image />` over raw `<img>` tags — it optimises format, size, and generates proper attributes.
- Set `width` and `height` explicitly, or use `widths` and `sizes` for responsive images.
- Use `<Picture />` for art direction with multiple formats and breakpoints.
- Store content images in `src/assets/` for build-time optimisation. Use `public/` only for files that must not be processed.

## SEO and Metadata

- Manage `<head>` content in layout components. Pass `title`, `description`, and `og:image` as props from each page.
- Create a reusable `<SEO />` component that renders all standard meta tags, Open Graph, and Twitter card markup.
- Use canonical URLs to avoid duplicate content issues across paginated or filtered views.
- Generate a `sitemap.xml` using `@astrojs/sitemap`. Add the integration and set `site` in `astro.config.mjs`.
- Use `<link rel="preload">` for critical assets and fonts in the base layout.

## Performance

- Ship zero JavaScript by default. Every hydrated island adds to the bundle — justify each one.
- Prefer `client:visible` and `client:idle` over `client:load` to defer non-critical JavaScript.
- Analyse build output with `astro build` — review the generated page sizes and asset counts.
- Use static site generation (SSG) for content-heavy sites. Enable SSR only for pages that require request-time data.
- Prefetch links with `<ViewTransitions />` or the `prefetch` integration for faster navigations.
- Minimise third-party scripts. Load analytics and trackers with `is:inline` and `defer` where possible.

## Error Handling

- Create a custom `src/pages/404.astro` for not-found responses.
- Create `src/pages/500.astro` for server error responses (SSR mode).
- Use try/catch in component scripts for data fetching that may fail.
- Display user-friendly error messages with clear recovery actions.

## Project Structure

```
src/
  assets/           # Images and static files for build-time optimisation
  components/       # Astro and framework components
  content/
    config.ts       # Collection schemas
    blog/           # Blog collection entries (Markdown/MDX)
    docs/           # Documentation collection entries
  layouts/          # Base and section layouts
  pages/            # File-based routes
  styles/           # Global CSS and Tailwind config
  utils/            # Helper functions and shared logic
public/             # Static files served as-is (favicons, robots.txt)
astro.config.mjs    # Astro configuration and integrations
```

- Co-locate collection-specific components near their content when practical.
- Keep layouts minimal — delegate complex sections to dedicated components.
- Separate static utilities in `src/utils/` from framework-specific hooks or stores.
