# Zen Theme — Design Spec

**Date:** 2026-06-06
**Status:** Approved

## Overview

Replace the current plain stylesheet with a warm, paper-textured zen theme. Changes are CSS-only (plus a Google Fonts link in `base.html`) — no structural changes to templates or models. The theme conveys a calm, handcrafted, literary feel: warm cream parchment, serif type, and subtle ink-style details.

---

## Files Changed

| File | Change |
|------|--------|
| `posts/static/posts/style.css` | Full replacement with zen theme styles |
| `posts/templates/posts/base.html` | Add Google Fonts `<link>` for Lora |

---

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| Page background | `#f2ebe0` | `body` background |
| Content card | `#faf7f2` | `.content-card` background |
| Body text | `#2c1f0e` | `body` color |
| Meta / secondary | `#8b6f47` | `.post-meta`, secondary text |
| Link default | `#6b3d14` | `a` color |
| Link hover | `#a0521a` | `a:hover` color |
| Accent / borders | `#c8a97a` | `hr`, borders, ornament |
| Tag background | `#ede4d5` | `.tags span` background |
| Tag text | `#7a5c38` | `.tags span` color |
| Card shadow | `rgba(80,50,20,0.08)` | `.content-card` box-shadow |

---

## Texture

Applied to `body` via `background-image` using an inline SVG noise filter (no external asset):

```css
background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(#n)' opacity='0.04'/></svg>");
```

The SVG uses `feTurbulence` + `feColorMatrix` to produce fine grain at `0.04` opacity — visible as paper texture at rest, invisible while reading.

---

## Typography

- **Font family:** Lora (Google Fonts), Regular (400) and Bold (700)
- **Body:** `1.125rem`, line-height `1.9`
- **h1:** Lora Bold, `2rem`, line-height `1.3`
- **h2 (post list titles):** Lora Bold, `1.35rem`, line-height `1.3`
- **Nav links:** Lora Regular, `0.85rem`, `text-transform: uppercase`, `letter-spacing: 0.08em`
- **Tag chips / meta:** `0.8rem`
- **Max reading width:** `660px`

---

## Layout & Ink Details

### Content Card
- Background: `#faf7f2`
- Padding: `2.5rem 3rem` (desktop), `1.5rem` (mobile ≤ 600px)
- Border-radius: `4px`
- Box-shadow: `0 2px 12px rgba(80,50,20,0.08)` (desktop only)

### Nav
- Centered, `padding: 1.5rem 0 1rem`
- Bottom border: `1px solid #c8a97a`
- Site name only, uppercase small-caps style

### Ornamental `<hr>` Divider
- `<hr>` hidden via `border: none`
- `::after` pseudo-element with `content: "· · ·"`, centered, color `#c8a97a`

### Featured Image (detail page)
- `width: 100%`, `border-radius: 3px`
- `border-bottom: 4px solid #c8a97a`
- `margin-bottom: 1.5rem`

### Tag Chips
- Background `#ede4d5`, color `#7a5c38`
- `border-radius: 2px` (squared, ink-stamp style)
- `letter-spacing: 0.04em`

### Link Transitions
- `transition: color 0.15s ease`
- Underline on hover only (`text-decoration: none` default, `underline` on hover)

---

## Out of Scope

- Dark mode / theme switching
- Custom web fonts beyond Lora
- Changes to template structure or Django code
- Mobile navigation redesign
