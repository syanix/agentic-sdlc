---
name: Page Layout
domain: frontend
complexity: medium
works-with: [ux-designer agent, /feature command]
---

# Page Layout Prompt

## When to Use

Use this prompt when you need to create a complete, responsive page layout with semantic structure and proper content hierarchy.

## The Prompt

```
Create a [PAGE_NAME] page layout using [FRAMEWORK] with the following specifications:

**Page sections (in order):**
[SECTIONS]

**Responsive breakpoints:**
[RESPONSIVE_BREAKPOINTS]

**Layout requirements:**
1. Use semantic HTML landmarks: <header>, <nav>, <main>, <aside>, <footer>
2. Implement a CSS Grid or Flexbox layout (no floats, no absolute positioning for structure)
3. The layout must not break between breakpoints -- use fluid scaling, not just snapping
4. Set a max-width of 1440px for content areas with auto margins for centring
5. Ensure minimum touch target sizes of 44x44px on mobile viewports
6. Include skip-to-content link as the first focusable element
7. Navigation must collapse to a hamburger menu below the tablet breakpoint
8. Sidebar (if present) must stack below main content on mobile

**Spacing and grid:**
- Use an 8px base unit for all spacing (8, 16, 24, 32, 48, 64)
- Grid columns: 12-column on desktop, 8 on tablet, 4 on mobile
- Gutter width: 24px desktop, 16px mobile

**Content loading:**
- Each section should have a skeleton loading state
- Above-the-fold content must render without JavaScript where possible
- Lazy-load below-the-fold sections using intersection observer

Generate the page component, layout styles, and a loading skeleton variant.
```

## Variations

### Dashboard Layout
Add to the prompt:
```
This is a dashboard layout with these additional requirements:
- Persistent sidebar navigation with collapsible sections
- Top bar with breadcrumbs, search, and user menu
- Main content area with a grid of [WIDGET_COUNT] draggable/resizable widgets
- Sidebar must be collapsible to icon-only mode (64px width)
- Persist sidebar collapsed state in localStorage
```

### Marketing Landing Page
Add to the prompt:
```
This is a marketing landing page. Additional requirements:
- Hero section with full-viewport height and a single CTA button
- Sections alternate background colours for visual rhythm
- Include smooth scroll anchors for in-page navigation
- Optimise for Largest Contentful Paint: inline critical CSS, preload hero image
- Add structured data (JSON-LD) for [SCHEMA_TYPE]
```

### Admin Panel Layout
Add to the prompt:
```
This is an admin panel layout. Additional requirements:
- Fixed sidebar with two-level navigation (groups and items)
- Breadcrumb trail generated from route hierarchy
- Content area with a top action bar (filters, bulk actions, create button)
- Table/list area that fills remaining viewport height (no page-level scroll)
- Toast notification container anchored to top-right
```

## Tips

- **Semantic HTML is your layout's skeleton.** Screen readers use landmarks to navigate. If your page has no `<main>` element, keyboard users cannot skip to the content. Run the page through a landmark audit before styling.
- **Design for the in-between.** Most layout bugs appear between breakpoints, not at them. Resize your browser slowly from 320px to 1440px and watch for text overflow, collapsed gaps, and orphaned elements.
- **Avoid viewport-height traps on mobile.** `100vh` does not account for browser chrome on iOS/Android. Use `100dvh` (dynamic viewport height) or the `min-height: -webkit-fill-available` workaround.
- **Grid is for page structure, Flexbox is for component alignment.** Mixing the two is fine -- use Grid for the macro layout and Flexbox for arranging items within a section.
