# Font Pairings Reference

Curated font combinations organised by aesthetic direction. Each pairing includes a headline font, body font, and optional accent/mono font.

---

## Editorial / Publication

For content-rich sites, blogs, long-form reading, and luxury products.

| Headline | Body | Accent/Mono | Character |
|---|---|---|---|
| Playfair Display (700) | Source Serif 4 (400) | JetBrains Mono | Classic editorial with technical edge |
| Fraunces (900) | Libre Franklin (400) | — | Warm, expressive, approachable |
| Newsreader (600) | Lora (400) | IBM Plex Mono | Scholarly, trustworthy |
| Cormorant Garamond (700) | Nunito Sans (400) | — | Elegant, refined, high-end |

**Usage pattern:** Large serif headlines (48-72px), comfortable body size (18-20px), generous line-height (1.6-1.8).

---

## Modern SaaS / Dashboard

For applications, admin panels, data products, and developer tools.

| Headline | Body | Accent/Mono | Character |
|---|---|---|---|
| Clash Display (600) | Plus Jakarta Sans (400) | Berkeley Mono | Bold and contemporary |
| Cabinet Grotesk (800) | Outfit (400) | Fira Code | Geometric and clean |
| Space Grotesk (700) | General Sans (400) | JetBrains Mono | Technical but approachable |
| Bricolage Grotesque (800) | Inter Tight (400) | IBM Plex Mono | Distinctive geometric with familiar body |

**Usage pattern:** Oversized headlines (56-80px, weight 700-900), compact body (14-16px), tight line-height for data (1.4-1.5).

---

## Marketing / Landing Page

For product launches, campaigns, and high-impact single-page sites.

| Headline | Body | Accent/Mono | Character |
|---|---|---|---|
| Satoshi (900) | Satoshi (400) | — | Single-family impact through weight contrast |
| Clash Display (700) | DM Sans (400) | Space Mono | Statement headlines with readable body |
| Syne (800) | Work Sans (400) | — | Experimental, forward-thinking |
| Cal Sans (display) | Geist (400) | Geist Mono | Vercel-inspired, developer-marketed |

**Usage pattern:** Massive headlines (64-120px), concise body copy (16-18px), strong weight contrast (100 vs 900).

---

## Minimalist / Brutalist

For portfolios, creative agencies, and intentionally stripped-back aesthetics.

| Headline | Body | Accent/Mono | Character |
|---|---|---|---|
| Instrument Serif (400) | System UI stack | — | One distinctive font, everything else default |
| Space Mono (700) | Space Mono (400) | — | Full monospace, utilitarian |
| Darker Grotesque (900) | Darker Grotesque (300) | — | Single family, extreme weight contrast |
| Azeret Mono (800) | Azeret Mono (400) | — | Technical brutalism |

**Usage pattern:** Extreme sizing (96px+ headlines or intentionally small 12px body), monospace for everything, raw and unpolished.

---

## Loading Fonts

### Google Fonts (quick start)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
```

### Fontsource (recommended for bundled apps)
```bash
npm install @fontsource-variable/bricolage-grotesque @fontsource/plus-jakarta-sans
```

```ts
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
```

### Self-hosted (best performance)
Download `.woff2` files and serve from your own domain. Use `font-display: swap` and preload the critical weights:

```html
<link rel="preload" href="/fonts/clash-display-700.woff2" as="font" type="font/woff2" crossorigin>
```

---

## Pairing Principles

1. **Contrast, not conflict** — Pair fonts that differ in structure (serif + sans, geometric + humanist) but share similar x-heights.
2. **One star, one supporting** — One distinctive display font for headlines. One highly readable font for body. Do not compete.
3. **Weight over family** — A single well-chosen family with extreme weight contrast (100 + 900) often outperforms two mediocre families.
4. **Test with real content** — "Lorem ipsum" hides bad pairings. Test with actual headlines and body text at production sizes.
5. **Limit to three** — Headline, body, and optionally monospace/accent. More than three families creates visual noise.
