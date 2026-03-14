---
name: Performance Audit
domain: frontend
complexity: medium
works-with: [code-refactorer agent, /analyze command]
---

# Performance Audit Prompt

## When to Use

Use this prompt when you need to analyse a page or application for Core Web Vitals compliance and identify concrete optimisation opportunities.

## The Prompt

```
Perform a frontend performance audit on [PAGE_URL] built with [FRAMEWORK].

**Performance budget:**
[PERFORMANCE_BUDGET]

**Audit scope:**

1. **Core Web Vitals assessment:**
   - Largest Contentful Paint (LCP): identify the LCP element and measure its load time
   - Cumulative Layout Shift (CLS): find all layout shifts and their sources
   - Interaction to Next Paint (INP): identify the slowest interactions

2. **Resource loading analysis:**
   - List all JavaScript bundles with their sizes (raw and gzipped)
   - Identify render-blocking resources in the critical path
   - Check for unused CSS and JavaScript (coverage analysis)
   - Verify images use modern formats (WebP/AVIF) and responsive srcset
   - Check font loading strategy (display swap, preload, subsetting)

3. **Runtime performance:**
   - Identify components that re-render unnecessarily
   - Check for long tasks (>50ms) on the main thread
   - Verify list virtualisation for collections with 100+ items
   - Look for memory leaks in event listeners, intervals, and subscriptions

4. **Network optimisation:**
   - Verify HTTP caching headers on static assets
   - Check if API responses are cached appropriately on the client
   - Identify waterfall request chains that could be parallelised
   - Confirm CDN usage for static assets

**Output format:**
For each finding, provide:
- Severity: critical | high | medium | low
- Current metric value vs target
- Root cause explanation
- Specific fix with code example
- Expected improvement estimate

Prioritise findings by impact. Start with critical issues that affect Core Web Vitals.
```

## Variations

### Initial Load Audit
Add to the prompt:
```
Focus specifically on first-load performance:
- Measure Time to First Byte (TTFB) and identify server-side bottlenecks
- Analyse the critical rendering path step by step
- Check if above-the-fold content can render without JavaScript (SSR/SSG)
- Verify preload/prefetch hints for critical resources
- Measure First Contentful Paint and time to interactive
- Check document size and whether HTML is streamed
```

### Runtime Performance Audit
Add to the prompt:
```
Focus on runtime and interaction performance:
- Profile a typical user journey: [USER_JOURNEY_STEPS]
- Measure frame rate during scrolling and animations
- Identify forced synchronous layouts (layout thrashing)
- Check Web Worker usage for CPU-intensive operations
- Profile garbage collection frequency and duration
- Verify requestAnimationFrame usage for visual updates
```

### Bundle Analysis
Add to the prompt:
```
Focus specifically on JavaScript bundle optimisation:
- Generate a bundle treemap visualisation (webpack-bundle-analyzer or equivalent)
- Identify the top 10 largest dependencies by size
- Check for duplicate packages (multiple versions of the same library)
- Verify tree-shaking is working (no dead code in production bundle)
- Recommend code-splitting boundaries based on route and feature usage
- Calculate potential savings from replacing heavy dependencies with lighter alternatives
```

## Tips

- **Measure before optimising.** Run Lighthouse, WebPageTest, and Chrome DevTools Performance tab before changing anything. Without a baseline, you cannot prove your changes helped.
- **Lab data is not field data.** Lighthouse scores in DevTools run on your fast machine. Use the Chrome UX Report (CrUX) or a RUM tool to see what real users experience on real devices and networks.
- **Optimise the critical path first.** A 200KB library loaded lazily after page render matters far less than a 20KB render-blocking script in the `<head>`. Focus on what blocks the user from seeing and interacting with content.
- **Bundle size is a proxy, not the goal.** A 500KB bundle that loads in one chunk during idle time may perform better than a 200KB bundle split into 40 waterfalled chunks. Measure actual user-perceived performance, not just file sizes.
