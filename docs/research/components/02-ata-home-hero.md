# Component Spec: Home Hero — alextheanalyst.com

Source: https://www.alextheanalyst.com (desktop viewport 1440x900)

## Site platform
Built on Wix (confirmed via class name patterns: `wixui-*`, `StylableButton*`). No canvas/pixel effects — standard DOM/image-based hero, much simpler than the previous mauriciojuba.com target.

## Heading ("DATA IS EVERYWHERE")
- `font-size: 89px`, `font-weight: 700`, `color: rgb(68, 162, 194)` (teal/blue), no letter-spacing, no text-transform
- Font family: `avenir-lt-w01_85-heavy1475544, sans-serif` — this is a **Wix-hosted licensed font file**, not something to copy directly. Use a visually comparable open-source alternative instead: **Poppins (700)** or **Montserrat (700)** — both are geometric sans-serifs with a similar heavy/bold character, freely available via Google Fonts.
- Positioned at x:327, y:178 in the 1440-wide viewport — roughly left-of-center, not full-width

## Book cover image
- `<img>`, 176x281px rendered size
- This is Alex's own book cover — a real copyrighted product image, not something to reproduce. For the clone, use a **placeholder rectangle/generic book-mockup shape** in the same position/size instead of copying the actual cover art.
- Accompanying copy: promotional text about a book on advancing a data career (paraphrase for the clone, don't reproduce verbatim)

## CTA button ("Check it out!")
- `background-color: rgb(40, 26, 57)` (dark purple/plum), 247x40px
- Font: same Arial/Helvetica fallback as body text (10px is the unscaled base — Wix buttons often use internal scaling, verify actual rendered text size visually before building)

## Nav (from structure snapshot)
Home / About / Courses (expandable, "More Courses pages") / Certifications / Interview Prep / More — standard horizontal top nav, plus a social bar (YouTube, LinkedIn, Twitter/X icons) near the logo/wordmark ("ALEX THE ANALYST").

## Build task (v1, superseded by v2 below — kept for history)
1. Build the Hero section layout: heading (using Poppins or Montserrat 700 as the open-source stand-in font, same size/color/position), a placeholder book-mockup graphic (not the real cover), promotional paragraph (paraphrased, not copied), and the CTA button (same color/size).
2. Build the top nav bar matching the structure above (labels only, real links not required for this proof-of-work stage).
3. No canvas/animation work needed — this is a static DOM layout, much simpler than the previous target.
4. Verify with `npx tsc --noEmit` then `npm run build`. Screenshot the result and visually compare against `docs/design-references/ata-hero-viewport.png` before reporting done.

## Build task v2 — real hero images + nav fix + Ken Burns transition (current pass)

**Book promo block: REMOVED from scope entirely** per Anthony's instruction — do not build it, do not reference a book image/paragraph/CTA for it.

**Real hero background images now available**, replacing the reference's mountain-climber photo with Anthony's own photos. Use in this exact order, cycling:
1. `/hero/anthonychilakahero1.webp`
2. `/hero/hero2.webp`
3. `/hero/hero3.webp`

**Ken Burns transition, Anthony's chosen option:** each image displays for ~5-6 seconds, crossfading into the next (`transition: opacity`) while also slowly scaling from `scale(1.0)` to roughly `scale(1.08-1.12)` over its display duration (`transition: transform`, slow ease, e.g. `ease-out` over the same duration as the display window). Implement as a small client component: array of 3 image paths, `useState` for active index, `setInterval` (or a CSS-animation-driven approach) to cycle. Each image layer gets its own zoom animation that resets when it becomes active again (so the zoom-in doesn't carry over stale state between cycles — retrigger via key change or animation restart). No external carousel library needed for 3 images.

**Nav bar fix:** solid background `rgb(32, 97, 183)`, 76px tall, white text/logo, positioned above/over the hero images (nav sits on top of the image stack, not pushed below it — matches reference's layout where the photo starts immediately under the nav band, edge to edge).

**Heading stays overlaid on the photo** (not on plain white as the v1 build had it) — centered or left-of-center per the original position data, teal color `rgb(68,162,194)`, Poppins/Montserrat 700, readable against the photo (check contrast against all 3 images since they'll differ; add a subtle text-shadow or semi-transparent backing if needed for legibility across all three, but don't add a full dark overlay unless a specific image needs it — the reference itself has no overlay, just relies on the photo's own tonal range).

**CTA button, nav links, social icons:** keep as already built in v1 (text/color/labels were already confirmed matching).

**Still not needed:** any book-related content, brand-exact social icon logos (generic placeholders remain correct per the "don't copy brand assets" rule).

Verify with `npx tsc --noEmit` then `npm run build`. Screenshot the result — critically, take at least 2 screenshots a few seconds apart to actually verify the Ken Burns motion is happening (not just present in code), same method already used successfully earlier this session (2-frame pixel comparison). Report the intensity of change found, not just whether the code compiles.
