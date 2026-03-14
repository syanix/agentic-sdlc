---
name: frontend-dev-guidelines
description: Frontend development patterns and conventions. Use when building UI components, pages, forms, or any frontend logic. Covers component architecture, state management, data fetching, accessibility, and performance patterns.
---

# Frontend Development Guidelines

Universal frontend development patterns and conventions. These principles apply regardless of framework. See `resources/` for {{FRONTEND_FRAMEWORK}}-specific patterns.

---

## Component Architecture

### Component Hierarchy
- **Pages** - route-level components, orchestrate layout and data
- **Features** - domain-specific composite components (e.g., `UserProfile`, `OrderSummary`)
- **UI Components** - reusable, presentational building blocks (e.g., `Button`, `Card`, `Input`)
- **Layouts** - structural wrappers providing consistent page chrome

### Composition Patterns
- Prefer composition over inheritance: use children and slots, not deep class hierarchies
- Extract shared logic into custom hooks (React) or composables
- Keep components focused: one responsibility per component
- Use compound components for tightly coupled UI groups (e.g., `Tabs`, `Tabs.List`, `Tabs.Panel`)

### Prop Design
- Use explicit, well-typed props; avoid generic `any` or `object` types
- Prefer specific props over catch-all `options` objects
- Use sensible defaults to reduce required prop count
- Document complex props with JSDoc comments
- Avoid prop drilling beyond 2 levels; use context or state management instead

---

## State Management

### Local State
- Use component-level state for UI-only concerns (open/closed, hover, focus)
- Keep form state local to the form component or use a form library
- Prefer controlled components over uncontrolled where feasible

### Global State
- Use global state sparingly: authentication, theme, user preferences
- Choose a state management solution proportional to complexity
- Co-locate state with the components that consume it
- Avoid duplicating server state in client state; use data fetching caches instead

### When to Use Which
- **Local state**: toggles, modals, form inputs, UI animations
- **URL state**: filters, pagination, search queries, active tabs
- **Server cache**: API responses, entity data (use data fetching libraries)
- **Global state**: auth session, feature flags, app-wide preferences

---

## Data Fetching

### Client-Side Fetching
- Use a data fetching library with built-in caching (e.g., TanStack Query, SWR)
- Define query keys consistently for cache management
- Handle loading, error, and empty states explicitly
- Implement optimistic updates for better perceived performance

### Server-Side Fetching
- Fetch data on the server where possible to reduce client bundle and waterfalls
- Stream data to the client for large datasets
- Cache server responses with appropriate revalidation strategies

### Error Handling in Data Fetching
- Display user-friendly error messages, not technical details
- Provide retry mechanisms for transient failures
- Show partial UI when some data succeeds and some fails
- Log detailed errors for debugging

---

## Form Handling

### Form Validation
- Validate on the client for immediate feedback
- Always validate on the server as the source of truth
- Use schema-based validation (Zod, Yup) shared between client and server where possible
- Show validation errors inline next to the relevant field

### Multi-Step Forms
- Persist progress between steps (local state or URL)
- Allow navigation back to previous steps without data loss
- Validate each step independently before allowing progression
- Show a progress indicator for orientation

### Error Display
- Display field-level errors directly below the input
- Show a summary of errors at the top of the form for accessibility
- Clear errors when the user begins correcting the field
- Announce errors to screen readers with live regions

---

## Routing

### Route Structure
- Mirror the URL structure to the feature hierarchy
- Use descriptive, human-readable URL segments
- Keep nesting shallow: prefer `/users/:id/settings` over deeply nested routes
- Use query parameters for transient state (filters, search)

### Navigation Patterns
- Provide breadcrumbs for deeply nested pages
- Preserve scroll position on back navigation
- Show loading indicators during route transitions
- Prefetch likely navigation targets for faster transitions

### Protected Routes
- Redirect unauthenticated users to login
- Redirect unauthorised users to a 403 page or the nearest permitted route
- Check authentication and authorisation at the routing layer, not within components
- Preserve the intended destination for post-login redirect

---

## Styling

### CSS Methodology
- Use a utility-first approach (Tailwind CSS) for rapid, consistent styling
- Extract repeated utility combinations into component-level classes or components
- Follow a consistent ordering convention for utility classes
- Avoid inline styles except for truly dynamic values (e.g., computed positions)

### Design Tokens
- Define colours, spacing, typography, and breakpoints as design tokens
- Reference tokens via CSS variables or theme configuration
- Maintain a single source of truth for the design system
- Support dark mode via token swapping, not conditional classes

### Responsive Design
- Design mobile-first, then enhance for larger screens
- Use responsive breakpoints consistently across the application
- Test at all defined breakpoints plus common device sizes
- Avoid fixed widths; use flexible layouts (grid, flexbox)

---

## Accessibility

### WCAG 2.1 AA Compliance
- All interactive elements must be keyboard accessible
- Maintain a minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text
- Provide visible focus indicators on all focusable elements
- Support reduced motion preferences with `prefers-reduced-motion`

### ARIA Patterns
- Use semantic HTML elements first; add ARIA only when semantics are insufficient
- Apply correct ARIA roles, states, and properties for custom widgets
- Label all form inputs with `<label>`, `aria-label`, or `aria-labelledby`
- Use live regions (`aria-live`) for dynamic content updates

### Keyboard Navigation
- Ensure logical tab order matching visual layout
- Support Escape to close modals, dropdowns, and popovers
- Implement arrow key navigation within composite widgets (menus, tabs, listboxes)
- Trap focus within modal dialogs until dismissed

---

## Performance

### Code Splitting
- Split routes into separate bundles for on-demand loading
- Lazy-load heavy components (charts, editors, maps)
- Avoid importing entire libraries when only specific functions are needed
- Monitor bundle sizes in CI to prevent regressions

### Lazy Loading
- Lazy-load images below the fold
- Use intersection observers for deferred rendering of off-screen content
- Defer loading of non-critical third-party scripts

### Image Optimisation
- Use modern formats (WebP, AVIF) with fallbacks
- Serve responsive images with `srcset` and `sizes`
- Set explicit `width` and `height` to prevent layout shift
- Use a CDN or image optimisation service for dynamic resizing

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Target < 2.5s. Optimise hero images and critical rendering path.
- **FID / INP (Interaction to Next Paint)**: Target < 200ms. Minimise main thread blocking.
- **CLS (Cumulative Layout Shift)**: Target < 0.1. Reserve space for dynamic content, set image dimensions.

---

## Error Handling

### Error Boundaries
- Wrap major sections in error boundaries to prevent full-page crashes
- Show a helpful fallback UI with a retry option
- Log caught errors to an error reporting service
- Reset error boundary state on navigation

### Fallback UI
- Show meaningful fallback content, not blank screens
- Provide actionable guidance (e.g., "Try refreshing the page")
- Maintain layout structure in error states to avoid visual jarring

### Toast Notifications
- Use toasts for transient success/error messages from user actions
- Auto-dismiss success toasts after 3-5 seconds
- Keep error toasts visible until dismissed by the user
- Stack multiple toasts without overlapping content

---

## Testing

### Component Testing
- Test components in isolation with a testing library (e.g., Testing Library)
- Test user interactions, not implementation details
- Verify accessible roles and labels in component tests
- Test loading, error, and empty states

### End-to-End Testing
- Cover critical user journeys: sign up, log in, core workflows
- Use a framework like Playwright or Cypress
- Run E2E tests against a realistic environment (seeded database, mocked external APIs)
- Keep E2E tests focused and fast; avoid duplicating unit test coverage

---

> **Stack-specific patterns**: See `resources/` for {{FRONTEND_FRAMEWORK}}-specific implementation details, code examples, and framework conventions.
