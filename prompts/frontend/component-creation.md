---
name: Component Creation
domain: frontend
complexity: medium
works-with: [ux-designer agent, /feature command]
---

# Component Creation Prompt

## When to Use

Use this prompt when you need to build a production-ready, accessible UI component with proper structure, styling, and test coverage.

## The Prompt

```
Create a [COMPONENT_NAME] component using [FRAMEWORK] that meets these requirements:

**Design requirements:**
[DESIGN_REQUIREMENTS]

**Props / Inputs:**
[PROPS_OR_INPUTS]

**Behaviour specifications:**
- The component must be fully keyboard-navigable
- All interactive elements must have visible focus indicators
- Transitions and animations must respect prefers-reduced-motion
- The component must work at viewport widths from 320px to 2560px

**Implementation rules:**
1. Use semantic HTML elements (not div soup)
2. Include appropriate ARIA attributes where native semantics are insufficient
3. Expose a clean public API -- keep internal state private
4. Follow the single-responsibility principle; split into sub-components if complexity grows
5. Use CSS custom properties for theming (colours, spacing, typography)
6. Include TypeScript types / prop validation for all inputs
7. Write unit tests covering: default render, prop variations, user interactions, edge cases
8. Add a Storybook story (or equivalent) showing all meaningful states

**File structure:**
- [COMPONENT_NAME]/index.ts (barrel export)
- [COMPONENT_NAME]/[COMPONENT_NAME].tsx (main component)
- [COMPONENT_NAME]/[COMPONENT_NAME].styles.ts (styles)
- [COMPONENT_NAME]/[COMPONENT_NAME].test.tsx (tests)
- [COMPONENT_NAME]/[COMPONENT_NAME].stories.tsx (stories)

Start with the component implementation, then tests, then stories.
```

## Variations

### Design-System Component
Add to the prompt:
```
This component is part of a design system. It must:
- Accept a `variant` prop with values: [VARIANTS]
- Accept a `size` prop with values: small | medium | large
- Use design tokens from [TOKEN_SOURCE] for all visual properties
- Export its prop types for consumers to extend
```

### Data Display Component
Add to the prompt:
```
This component displays data and must handle:
- Loading state with skeleton placeholder matching the layout dimensions
- Empty state with a helpful message and optional action
- Error state with retry capability
- Pagination or virtualised scrolling for large datasets ([ROW_COUNT]+ items)
```

### Interactive Widget
Add to the prompt:
```
This is a complex interactive widget. Additional requirements:
- Manage internal state for: [INTERNAL_STATE_ITEMS]
- Emit events / call callbacks for: [EVENT_LIST]
- Support controlled and uncontrolled usage patterns
- Debounce rapid user input by [DEBOUNCE_MS]ms
```

## Tips

- **Composability over configuration.** Prefer compound components (e.g. `<Select>`, `<Select.Option>`) over massive prop objects. This keeps each piece testable and replaceable.
- **Test behaviour, not implementation.** Use Testing Library queries like `getByRole` and `getByLabelText` rather than test IDs or class names. If you cannot query by role, your HTML semantics likely need fixing.
- **Start without styling.** Get the HTML structure and interactions right first, then layer in styles. Accessible markup is easier to build before CSS complicates the picture.
- **Measure render performance early.** Wrap the component in React Profiler (or framework equivalent) during development. Catching unnecessary re-renders now saves painful optimisation later.
