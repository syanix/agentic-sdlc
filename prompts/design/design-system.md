---
name: Design System Creation
domain: design
complexity: high
works-with: [ux-designer agent, /feature command]
---

# Design System Creation

## When to Use

Use this prompt when creating a design system from scratch or extending an existing one with tokens, primitive components, and composite patterns.

## The Prompt

Create a design system for **[PROJECT_NAME]** using **[FRAMEWORK]**.

### Brand Tokens

[BRAND_TOKENS]

### Components Required

[COMPONENT_LIST]

### Visual Identity Direction

[AESTHETIC_DIRECTION] — e.g., "Midnight Terminal", "Warm Editorial", "Nordic Calm",
or describe the desired aesthetic. See the `frontend-aesthetics` skill for curated
theme recipes and font pairings. Avoid defaulting to generic palettes and safe font
choices — commit to a distinctive visual direction before defining tokens.

Build the design system in layers:

1. **Token Foundation** - Define design tokens for colours, spacing, typography,
   border-radius, shadows, and motion timing. Use semantic naming (e.g.
   `colour-action-primary` not `blue-500`).

2. **Primitive Components** - Build atomic elements (Button, Input, Text, Icon,
   Badge) that consume tokens directly. Each must support:
   - Multiple variants (primary, secondary, ghost, destructive)
   - Size scale (sm, md, lg)
   - Disabled and loading states
   - Proper ARIA attributes

3. **Composite Components** - Assemble primitives into patterns from
   [COMPONENT_LIST]. Document the composition rules and slot patterns.

4. **Documentation** - For each component provide:
   - Purpose and when to use / when not to use
   - Props table with types and defaults
   - Interactive examples showing all variants
   - Accessibility notes

### Naming Conventions

- Tokens: `{category}-{property}-{variant}-{state}` (e.g. `colour-bg-primary-hover`)
- Components: PascalCase, no abbreviations (e.g. `NavigationBar` not `NavBar`)
- Files: kebab-case matching component name

## Variations

### Token Foundation Only

Focus exclusively on defining a complete token set. Output as CSS custom
properties, JSON, and [FRAMEWORK]-compatible format. Include dark mode
token mappings. Provide a visual reference sheet.

### Component Library Extension

Given an existing design system, add [COMPONENT_LIST] following established
patterns. Audit existing tokens for gaps. Ensure new components reuse
existing primitives rather than introducing parallel implementations.

### Documentation Site

Generate a living documentation site structure using Storybook or similar.
Organise by atomic design layers. Include a changelog workflow for
versioning component updates.

## Tips

- Start with tokens, not components - a solid token layer prevents drift
- Version your design system independently from the consuming application
- Use `colour` not `color` in token names for consistency with project conventions
- Audit contrast ratios during token definition, not after component build
- Set up visual regression tests from day one
- Keep the component API surface small - fewer props means fewer bugs
- Document "don't" examples alongside "do" examples
