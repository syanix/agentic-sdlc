# Theme Recipes

Complete aesthetic directions with colour tokens, typography pairings, and atmosphere guidance. Each recipe is a starting point — adapt to the project's brand identity.

---

## Midnight Terminal

Dark, technical, developer-oriented. Inspired by IDE themes like Dracula and Tokyo Night.

```css
:root {
  /* Surfaces */
  --colour-surface: #0f0f14;
  --colour-surface-raised: #1a1a24;
  --colour-surface-overlay: #24243a;
  --colour-border: #2a2a3e;

  /* Text */
  --colour-text-primary: #e4e4ef;
  --colour-text-secondary: #8888a8;
  --colour-text-muted: #55556a;

  /* Accents */
  --colour-accent: #7aa2f7;
  --colour-accent-secondary: #bb9af7;
  --colour-success: #9ece6a;
  --colour-warning: #e0af68;
  --colour-error: #f7768e;
}
```

**Typography:** Space Grotesk (headlines) + JetBrains Mono (body and code)
**Background:** Subtle blue-purple radial gradient at 5% opacity over near-black
**Motion:** Minimal, snappy transitions (150-200ms). Terminal-style text reveals.
**Best for:** Developer tools, API dashboards, technical documentation, CLI companions

---

## Warm Editorial

Refined, trustworthy, content-focused. Inspired by quality publications and literary magazines.

```css
:root {
  /* Surfaces */
  --colour-surface: #faf8f5;
  --colour-surface-raised: #ffffff;
  --colour-surface-inset: #f0ece6;
  --colour-border: #e0dbd3;

  /* Text */
  --colour-text-primary: #1a1815;
  --colour-text-secondary: #5c5650;
  --colour-text-muted: #9c948a;

  /* Accents */
  --colour-accent: #c44d2a;
  --colour-accent-secondary: #2a6bc4;
  --colour-success: #2a7d4f;
  --colour-warning: #b8860b;
  --colour-error: #c44d2a;
}
```

**Typography:** Playfair Display (headlines) + Source Serif 4 (body)
**Background:** Warm off-white (#faf8f5) with subtle paper-like noise texture
**Motion:** Gentle, slow reveals (400-600ms). Content fades in as you scroll.
**Best for:** Blogs, publications, portfolios, content platforms, luxury brands

---

## Neon Minimal

High-contrast dark theme with electric accent colours. Cyberpunk-adjacent without going full sci-fi.

```css
:root {
  /* Surfaces */
  --colour-surface: #0a0a0b;
  --colour-surface-raised: #141415;
  --colour-surface-overlay: #1e1e20;
  --colour-border: #2a2a2c;

  /* Text */
  --colour-text-primary: #fafafa;
  --colour-text-secondary: #a1a1a6;
  --colour-text-muted: #636366;

  /* Accents */
  --colour-accent: #22d3ee;
  --colour-accent-glow: #22d3ee40;
  --colour-success: #34d399;
  --colour-warning: #fbbf24;
  --colour-error: #f87171;
}
```

**Typography:** Clash Display (headlines) + Outfit (body) + Fira Code (mono)
**Background:** Multiple radial gradients — cyan at 10% bottom-left, purple at 8% top-right, over near-black
**Motion:** Snappy, energetic (100-250ms). Staggered grid reveals. Subtle glow pulses on accents.
**Best for:** SaaS landing pages, product launches, creative tools, gaming-adjacent products

---

## Nordic Calm

Cool, restrained, spacious. Inspired by Scandinavian design — form follows function with quiet confidence.

```css
:root {
  /* Surfaces */
  --colour-surface: #f8f9fb;
  --colour-surface-raised: #ffffff;
  --colour-surface-inset: #eef0f4;
  --colour-border: #d8dce6;

  /* Text */
  --colour-text-primary: #1c2433;
  --colour-text-secondary: #5a6578;
  --colour-text-muted: #8b95a8;

  /* Accents */
  --colour-accent: #2563eb;
  --colour-accent-secondary: #0891b2;
  --colour-success: #059669;
  --colour-warning: #d97706;
  --colour-error: #dc2626;
}
```

**Typography:** Plus Jakarta Sans (headlines, weight 700) + Plus Jakarta Sans (body, weight 400)
**Background:** Clean cool white with very subtle blue tint. No gradients — whitespace is the design.
**Motion:** Slow, deliberate (300-500ms). Ease-out curves. Content slides in gently.
**Best for:** Enterprise SaaS, healthcare, fintech, productivity tools, B2B platforms

---

## Brutalist Raw

Intentionally rough, high-impact, anti-design. Uses constraint as a creative tool.

```css
:root {
  /* Surfaces */
  --colour-surface: #ffffff;
  --colour-surface-raised: #f0f0f0;
  --colour-surface-inset: #000000;
  --colour-border: #000000;

  /* Text */
  --colour-text-primary: #000000;
  --colour-text-secondary: #333333;
  --colour-text-inverted: #ffffff;

  /* Accents */
  --colour-accent: #ff0000;
  --colour-accent-secondary: #0000ff;
  --colour-success: #00ff00;
  --colour-warning: #ffff00;
  --colour-error: #ff0000;
}
```

**Typography:** Space Mono (everything) or Darker Grotesque at extreme weights (300 + 900)
**Background:** Flat white or flat black. No gradients, no textures. Borders do the heavy lifting.
**Motion:** None, or intentionally jarring (instant state changes, no easing).
**Best for:** Creative portfolios, art galleries, experimental projects, agency sites

---

## Selecting a Recipe

1. **Match the audience** — Enterprise users expect Nordic Calm, not Neon Minimal. Developer audiences respond to Midnight Terminal.
2. **Adapt, don't copy** — These are starting points. Adjust tokens to match brand colours while preserving the overall temperature and contrast ratios.
3. **Check contrast** — After adapting colours, verify all text/background combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text).
4. **Test dark mode independently** — If offering both light and dark, design each as a standalone theme. Do not just invert values.
5. **Commit fully** — A half-applied theme looks worse than no theme. If using a recipe, apply it to every surface, every text style, every border. Consistency creates cohesion.
