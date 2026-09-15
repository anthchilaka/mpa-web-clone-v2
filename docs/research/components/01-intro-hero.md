# Component Spec: 01 — Intro / Hero

Source: https://mauriciojuba.com (desktop viewport 1440x900)

## Layout container
- Wrapper: `relative flex min-h-[calc(100svh-6.5rem)] flex-col overflow-clip bg-ink pb-8 pt-12`
- Background: `rgb(14, 14, 14)` (`bg-ink` token)
- Base typeface: `"Rubik Variable", system-ui, sans-serif` (variable font, used site-wide)

## Canvas layers (the pixel/halftone effect)
Two `<canvas>` elements, stacked, both inside `absolute inset-0` wrappers directly under the hero container above:
- Buffer resolution: 240x133px internal, stretched via CSS to 1440x796px display (confirmed earlier session) — ~1:6 buffer-to-display ratio
- Both canvases: `class="block size-full [image-rendering:pixelated]"`
- `position: static` (positioning handled by the `absolute inset-0` wrapper div, not the canvas itself)
- `mix-blend-mode: normal`, `opacity: 1`, `z-index: auto` — no blend trickery, it's pure layering by DOM order
- This matches the technique already built for this site's own `/home` portrait: low-res canvas buffer + `image-rendering: pixelated`, two independent layers (portrait + separate ambient background), not a single effect

## Heading ("MAURICIO JUBA.")
Two-line H1, each line built from **individually-wrapped letter spans**, not plain text — each letter span carries `will-change: font-variation-settings`, meaning the variable font's weight/width axis is animated per-letter (likely on hover or scroll-in, not yet confirmed which trigger — needs a behavior pass).

- Line 1 ("MAURICIO"): `text-[clamp(2.3rem,0.5rem+10.3vw,10.3rem)] text-muted tracking-[-0.01em]` → renders 156.32px at this viewport, color token `text-muted` (light neutral, near-white)
- Line 2 ("JUBA."): `text-[clamp(3.5rem,0.8rem+14.8vw,14.8rem)] text-accent tracking-[-0.02em]` → renders 225.92px at this viewport, color token `text-accent` = `rgb(255, 201, 122)` (warm gold/orange)
- Both lines: `leading-[0.86]` / `leading-[0.84]` — tight line-height, letters nearly touching top-to-bottom
- A duplicate `sr-only` span exists alongside the letter-spans for each line — accessibility fallback so screen readers get plain text instead of the animated per-letter markup

## Supporting text (top of hero, above heading)
- Eyebrow label ("STAFF DESIGN ENGINEER"): `font-light uppercase tracking-[0.06em] text-accent text-[clamp(16px,4.6vw,24px)]` — 24px at this viewport, gold accent color, uppercase
- Sub-label ("DESIGN SYSTEMS · ENTERPRISE PLATFORMS · AI PRODUCTS"): `hud-label text-muted/80` — 10px, 500 weight, wide letter-spacing (1.8px), 80% opacity muted color — reads as a small tracked "HUD" style label

## Colors identified so far
| Token | Value | Used for |
|---|---|---|
| `bg-ink` | `rgb(14, 14, 14)` | page/section background |
| `text-accent` | `rgb(255, 201, 122)` | heading line 2, eyebrow label |
| `text-muted` | near-white (oklab-based, ~93% lightness) | heading line 1, sub-label at 80% opacity |

## Confirmed behavior (this pass)

### Background canvas is animated, not static
Measured directly: sampled the first canvas's full pixel buffer twice, 2 seconds apart, no mouse interaction. ~37% of pixels changed (11,676 of 31,920), max per-channel delta 86. This is genuine continuous animation (time-driven, not click/scroll-triggered — confirmed changing with zero user interaction). Implementation mechanism (noise algorithm, frame rate, easing) not yet extracted — only the fact-of-motion is confirmed. Needs a `requestAnimationFrame` loop or CSS `animation-timeline` equivalent, not a single static draw.

### Portrait canvas: confirmed draw region
Per-column brightness sampled across the full 240px buffer width: fully zero (empty) from column 0 to ~column 115 (0%-48% of width), ramps up 115-170 (48%-71%), peaks 170-200 (71%-83%), tapers by ~225 (94%). So the actual face content is confined to roughly **48%-94% of buffer width**, not full-bleed. Grayscale, dithered edges (fades to transparent over roughly the outer 25% of that band, not a hard cutout).

### Heading typography: true variable font axis, not static weight steps
`getComputedStyle` on a letter-span: `font-family: "Rubik Variable"`, `font-variation-settings: "wght" 320`, `font-weight: 400` (the 400 is the CSS fallback value; the real rendered weight comes from the `wght` axis at 320, a fractional value between the 300/400 static steps). This must be loaded as a true variable font capable of arbitrary `wght` values via `font-variation-settings`, not as fixed static weight instances (300/400/500/700/900) — a static-instance font loader cannot reproduce 320 or animate between values.

## Open items for next pass (assets + remaining behavior)
- Confirm the per-letter `font-variation-settings` trigger: hover, scroll-in-view, or load-time animation (the axis value is confirmed at 320 in a resting/idle state; not yet confirmed whether it changes on interaction)
- Extract the "cycle accent colour" theme button's behavior (found in Phase 1 recon — confirms `text-accent` is a swappable/cycling token, not fixed) — deprioritized per Anthony's instruction, position/effect work takes precedence
- Extract company-logo strip assets (8 logos) and their exact sizing/spacing
- Extract stat line styling ("10+ YEARS SHIPPING SYSTEMS", "BASED IN SÃO PAULO, BRAZIL", "OPEN TO GLOBAL RELOCATION")

## Build task for this pass (locked scope)
1. Background canvas: implement continuous animation matching the confirmed ~37%-of-pixels-per-2s motion characteristic — a `requestAnimationFrame`-driven noise field is the right mechanism; exact algorithm not prescribed, tune until motion character is comparable.
2. Heading font: switch from static Next.js font weight steps to a true variable-font load (self-hosted Rubik Variable woff2-variations, or an equivalent variable-axis-capable loading method) so `font-variation-settings: "wght" 320` actually renders as specified, not approximated by the nearest static step.
3. Do NOT touch: portrait position/crop (already locked correct — 48%-94% width band, grayscale, dithered edges), accent color (locked as-is per Anthony's instruction, do not revisit).
4. Verify with `npx tsc --noEmit` then `npm run build` before reporting done. Screenshot the result and compare against `docs/design-references/section-01-intro.png` — do not report success from code-reasoning alone.
