---
name: Responsive Design
domain: design
complexity: medium
works-with: [ux-designer agent, /feature command]
---

# Responsive Design

## When to Use

Use this prompt when implementing responsive layouts that need to work across multiple breakpoints, following mobile-first and content-first principles.

## The Prompt

Implement a responsive layout for **[COMPONENT_OR_PAGE]** using **[FRAMEWORK]**.

### Breakpoints

[BREAKPOINTS]

### Device Priorities

[DEVICE_PRIORITIES]

Follow these principles:

1. **Content-first breakpoints** - Let the content determine where breakpoints
   fall rather than targeting specific devices. Add breakpoints where the
   layout breaks, not at arbitrary widths.

2. **Mobile-first CSS** - Write base styles for the smallest viewport, then
   layer on complexity with `min-width` media queries. This ensures the
   core experience loads with minimal CSS.

3. **Fluid scaling** - Use `clamp()` for typography and spacing to create
   smooth transitions between breakpoints rather than jarring jumps.

4. **Touch targets** - Ensure all interactive elements are at least 44x44px
   on touch devices. Increase spacing between adjacent tap targets.

5. **Responsive images** - Use `srcset` and `sizes` attributes. Provide
   appropriately sized assets for each breakpoint. Consider `loading="lazy"`
   for below-fold images.

For [COMPONENT_OR_PAGE], produce:

- Layout specifications for each breakpoint in [BREAKPOINTS]
- CSS/component code implementing the responsive behaviour
- A list of elements that hide, reflow, or transform at each breakpoint
- Performance notes for any layout shifts or repaints

## Variations

### Mobile-First Implementation

Start with a single-column layout optimised for [DEVICE_PRIORITIES].
Progressively enhance for larger screens. Focus on thumb-zone ergonomics,
bottom navigation patterns, and swipe gestures. Test with actual device
dimensions, not just browser resize.

### Adaptive Layout

Serve fundamentally different layouts per device class rather than fluid
scaling. Define component variants for mobile, tablet, and desktop.
Use server hints or `matchMedia` to select the appropriate variant.
Useful when mobile and desktop experiences diverge significantly.

### Container Queries

Use CSS container queries to make [COMPONENT_OR_PAGE] responsive to its
parent container rather than the viewport. This enables truly reusable
components that adapt to any layout context. Define container types and
size thresholds for each adaptation.

## Tips

- Test on real devices, not just browser DevTools - touch behaviour differs
- Use `dvh` (dynamic viewport height) instead of `vh` for mobile browser chrome
- Avoid horizontal scrolling at any breakpoint
- Check that focus order remains logical after reflow
- Profile paint and layout costs at each breakpoint using browser DevTools
- Content should never be hidden on mobile purely to simplify layout
- Test with browser zoom at 200% for accessibility compliance
