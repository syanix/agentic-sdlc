---
name: frontend-aesthetics
description: Use this skill when building or designing frontend interfaces, landing pages, dashboards, or any user-facing UI. Provides concrete guidance to avoid generic AI aesthetics and create visually distinctive designs with intentional typography, colour, motion, and depth.
---

# Frontend Aesthetics — Anti-Convergence Design Guide

AI-generated frontends converge toward a predictable aesthetic: Inter font, purple-to-blue gradients, uniform card grids, and timid colour palettes. This skill provides **concrete alternatives** to break out of that pattern and produce designs that feel intentional and distinctive.

> This skill focuses on visual distinctiveness. For accessibility, responsive layout, and component architecture, see `frontend-dev-guidelines`. For UX philosophy and interaction design, see the `ux-designer` agent.

---

## 1. Typography

Typography is the single fastest signal of design quality. Generic font choices instantly mark a design as template-derived.

### Fonts to Avoid

These are the most common AI-default fonts. Never reach for them first:

- Inter, Roboto, Open Sans, Lato, Montserrat, Poppins
- System defaults (Arial, Helvetica) used without intention
- Any Google Font that appears in the top 10 by usage

### Concrete Alternatives

| Category | Fonts | When to use |
|---|---|---|
| **Editorial / Serif** | Playfair Display, Fraunces, Lora, Newsreader | Content-heavy sites, blogs, publications, luxury products |
| **Geometric Sans** | Bricolage Grotesque, Plus Jakarta Sans, Outfit, General Sans | SaaS, dashboards, modern applications |
| **Monospace / Technical** | JetBrains Mono, IBM Plex Mono, Berkeley Mono, Fira Code | Developer tools, technical products, data-heavy interfaces |
| **Display / Statement** | Clash Display, Satoshi, Cabinet Grotesk, Space Grotesk | Hero sections, marketing pages, bold headlines |

### Typography Contrast

Distinctive typography uses **extremes**, not middle-of-the-road weights:

- **Weight contrast**: Pair thin (100-300) with black (800-900). Avoid using only 400/500/600.
- **Size jumps**: Headlines should be 3x+ the body size, not 1.5x. A 16px body with a 48-64px headline creates visual impact.
- **Mixed families**: Pair a serif headline with a sans-serif body, or a display font with a monospace caption. Two similar sans-serifs is a wasted opportunity.

### Font Loading

Always use `font-display: swap` and preload critical fonts. Load from Google Fonts, Fontsource, or self-host — never rely on system fonts as the primary choice unless the design intentionally calls for it.

---

## 2. Colour & Theme

Generic designs use timid, non-committal colour palettes — a light grey background with one muted blue accent. Distinctive designs **commit fully** to a cohesive aesthetic.

### Anti-Patterns

- Light grey (#f5f5f5) background with a single blue accent
- Rainbow of colours with no hierarchy or cohesion
- Colours chosen from a default palette picker without semantic intent
- Purple-to-blue gradients as the primary visual identity

### Commit to a Colour Strategy

Define your palette using CSS custom properties and commit to it throughout:

```css
:root {
  --colour-surface: #0a0a0b;
  --colour-surface-raised: #141416;
  --colour-text-primary: #fafaf9;
  --colour-text-secondary: #a1a1aa;
  --colour-accent: #22d3ee;
  --colour-accent-muted: #22d3ee33;
}
```

### Colour Principles

- **Dominant + accent**: One dominant colour direction (warm neutrals, cool darks, paper whites) with one or two sharp accents. Not five equally-weighted colours.
- **Semantic consistency**: The same colour always means the same thing. Do not reuse your accent for both "success" and "navigation highlight".
- **Dark mode as a first-class theme**: Dark themes are not inverted light themes. Design them independently with adjusted contrast, reduced saturation, and considered elevation.
- **Draw from real aesthetics**: IDE themes (Dracula, Nord, Catppuccin), editorial design (newsprint, magazine), cultural palettes (Japanese wabi-sabi, Scandinavian minimalism), industrial design (concrete, copper, matte black). These provide coherent, tested palettes.

### Theme Recipes

For curated theme directions with complete token sets, see `resources/theme-recipes.md`.

---

## 3. Motion & Orchestration

Motion should be **orchestrated**, not scattered. A few well-timed, coordinated animations on page load create far more impact than hover effects on every element.

### Orchestration Over Decoration

- **Page-load reveals**: Stagger content entry with 30-60ms delays between elements. Fade + translate (20-30px upward) is effective and lightweight.
- **Hero sequences**: Animate headline, then subtext, then CTA — not all simultaneously. Sequential reveals create narrative flow.
- **List staggering**: When rendering lists or grids, stagger item entry. Each item appears 30-50ms after the previous one.

### Technology Choice

| Context | Use | Why |
|---|---|---|
| Static HTML / server-rendered | CSS `@keyframes` + `animation-delay` | Zero JS overhead, works without hydration |
| React / interactive apps | Framer Motion (`motion` library) | Declarative API, layout animations, exit animations |
| Simple hover/focus effects | CSS `transition` | Always CSS for single-property transitions |

### CSS-Only Page Reveal Pattern

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  animation: fadeSlideUp 0.6s ease-out both;
}

.reveal:nth-child(1) { animation-delay: 0ms; }
.reveal:nth-child(2) { animation-delay: 60ms; }
.reveal:nth-child(3) { animation-delay: 120ms; }
.reveal:nth-child(4) { animation-delay: 180ms; }

@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

### Motion Principles

- **Respect `prefers-reduced-motion`** — Always. Remove animations entirely, do not just reduce duration.
- **Budget your motion** — 2-3 orchestrated moments per page, not 20 individual hover effects.
- **Exit animations matter** — Content leaving the screen deserves as much thought as content entering. Use Framer Motion's `AnimatePresence` for React.
- **Never animate layout properties** — Stick to `transform` and `opacity`. See `micro-interactions` prompt for detailed performance guidance.

---

## 4. Backgrounds & Depth

Flat, single-colour backgrounds are the most common AI design default. Layered backgrounds create atmosphere and visual richness without adding UI complexity.

### Techniques

**Gradient layering:**
```css
.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.10) 0%, transparent 50%),
    var(--colour-surface);
}
```

**Subtle geometric patterns:**
- Dot grids (`radial-gradient` repeated) at low opacity (0.03-0.08)
- Fine line grids using `repeating-linear-gradient`
- Noise textures via SVG filters or tiny tiled images

**Depth through elevation:**
- Use layered surfaces with subtle box-shadows or border separation
- Cards should feel lifted, not just outlined — `box-shadow` with large blur and low opacity
- Consider `backdrop-filter: blur()` for glassmorphism effects on overlays (check browser support)

### Background Principles

- **Atmosphere, not distraction** — Backgrounds should set mood without competing with content. Keep effects subtle (opacity 0.05-0.15).
- **Multiple gradient layers** — Stack 2-3 radial gradients at different positions for organic, non-uniform depth.
- **Dark surfaces need texture** — Pure `#000` is harsh. Use near-black (`#0a0a0b`) with subtle gradient variation to create warmth.
- **Light surfaces need contrast** — Pure white backgrounds work but feel clinical. Consider warm whites (`#fafaf8`), subtle warm gradients, or paper-like textures.

---

## Applying This Skill

When building any frontend interface:

1. **Start with typography** — Choose fonts before writing any CSS. The font pairing sets the entire tone.
2. **Define colour tokens** — Build a complete token set (surface, text, accent, semantic) before colouring individual components.
3. **Design the background first** — Set the atmospheric foundation before placing UI elements on top.
4. **Add motion last** — Orchestrate 2-3 reveals after the static design is complete. Motion enhances a good design; it cannot save a bad one.
5. **Audit against defaults** — Before finalising, ask: "Would this look the same if I gave a generic prompt to any AI?" If yes, push further.

For font pairing suggestions, see `resources/font-pairings.md`.
For complete theme directions, see `resources/theme-recipes.md`.
