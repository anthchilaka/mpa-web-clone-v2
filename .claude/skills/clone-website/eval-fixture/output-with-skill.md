# Header + Hero Specification

Source reviewed directly from `target.html` (static file — no agent-browser session available). All values below are read verbatim from the `<style>` block and inline attributes, not estimated. Two components are covered per the mandatory scope (Header, Hero); the Tabs section is noted briefly at the end but not fully spec'd per instructions.

---

## Component: SiteHeader

## Overview
- **Target file:** `src/components/SiteHeader.tsx`
- **Screenshot:** N/A — no browser available; static source only
- **Interaction model:** scroll-driven (JS scroll listener toggling a class; NOT hover or click)

## DOM Structure
```
<header id="site-header">
  <nav>
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
```
- `header` is the sole sticky element; `nav` is a plain flow container (no explicit `display:flex` declared — anchors lay out via default inline flow, separated by `margin-right`).
- Three `<a>` children, no icons, no logo element present in this fixture.

## Computed Styles (exact values from source CSS — not getComputedStyle since no live DOM)

### `header` (default / unscrolled state)
- position: sticky
- top: 0
- z-index: 10
- padding: 24px 40px
- background: transparent
- box-shadow: none
- transition: `background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease`

### `header.scrolled` (scrolled state — class toggled by JS)
- background: `#14171c`
- box-shadow: `0 2px 12px rgba(0,0,0,0.25)`
- padding: 12px 40px

### `header nav a` (default)
- color: `#14171c`
- text-decoration: none
- margin-right: 24px
- font-size: 15px

### `header.scrolled nav a` (scrolled)
- color: `#ffffff`

### Global reset in effect
- `* { box-sizing: border-box; margin: 0; }`
- `body { font-family: -apple-system, sans-serif; }` — no web font/Google Font link present; header inherits system font stack.

## States & Behaviors

### Scroll-triggered header restyle
- **Trigger:** exact mechanism is a `window` `scroll` event listener (not IntersectionObserver, not CSS `position:sticky` alone). Threshold is `window.scrollY > 40` (px). Source:
  ```js
  window.addEventListener('scroll', () => {
    document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 40);
  });
  ```
- **State A (scrollY ≤ 40, unscrolled):**
  - background: transparent
  - box-shadow: none
  - padding: 24px 40px
  - nav a color: `#14171c`
- **State B (scrollY > 40, scrolled):**
  - background: `#14171c`
  - box-shadow: `0 2px 12px rgba(0,0,0,0.25)`
  - padding: 12px 40px
  - nav a color: `#ffffff`
- **Transition:** `background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease` (declared on the base `header` rule, so both directions of the toggle animate identically — no separate exit transition).
- **Implementation approach:** CSS transition on the base selector + JS scroll listener toggling a class (`classList.toggle`), threshold-based, not IntersectionObserver-based. In the rebuild, replicate with a scroll listener (e.g. `useEffect` + `window.addEventListener('scroll', ...)`, threshold `window.scrollY > 40`), not a `useInView`/IntersectionObserver hook — using IO here would be the "click vs scroll" class of mistake the skill warns against (here: wrong *mechanism* for a scroll behavior).

### Hover states
- N/A in source — no `:hover` rules exist anywhere in the stylesheet for header/nav links. Do not invent a hover treatment; ship links with no hover transition since none is specified.

## Assets
- No logo image/SVG present in the header markup.
- No icons used.

## Text Content (verbatim)
- Nav link 1: "Work" → `href="#work"`
- Nav link 2: "About" → `href="#about"`
- Nav link 3: "Contact" → `href="#contact"`

## Responsive Behavior
- **Desktop / Tablet / Mobile:** No media queries exist anywhere in the source stylesheet. The header uses fixed pixel padding (`24px 40px` / `12px 40px` scrolled) at all viewport widths — there is no documented breakpoint or responsive adjustment in this fixture. Do not fabricate a mobile hamburger menu or stacked nav; the source has none. Flag this explicitly to the user/builder as a known gap in the source rather than inventing responsive behavior.
- **Breakpoint:** N/A — none defined.

---

## Component: HeroSection

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** N/A — no browser available; static source only
- **Interaction model:** static (no scroll/click/hover/time-driven behavior on the hero itself; only the CTA link navigates via `href="#contact"`, a plain anchor jump, not a JS interaction)

## DOM Structure
```
<section class="hero">
  <div class="bg-texture"></div>
  <div class="fg-mockup"></div>
  <h1>Aurora Studio builds interfaces that feel inevitable.</h1>
  <a class="cta" href="#contact">Start a project</a>
</section>
```
- Four direct children of `.hero`, stacked via `position: absolute` / `position: relative` + `z-index`, NOT a single background image. This is a **layered composition — 2 image layers, not 1**:
  1. `.bg-texture` — full-bleed background image layer
  2. `.fg-mockup` — a smaller, absolutely-positioned foreground overlay image, offset from the container edges (not centered, not full-bleed)
  - The `<h1>` and `.cta` anchor sit above both image layers via `z-index: 3` (h1) — `.cta` has no explicit z-index/position but follows in normal stacking order after the two `position:absolute` layers, so it renders above them by DOM order.

## Computed Styles (exact values from source CSS)

### `.hero` (container)
- position: relative
- height: 640px
- overflow: hidden
- (no explicit width/max-width/background — background is entirely delegated to the two child layers)

### `.hero .bg-texture` (Layer 1 — background)
- position: absolute
- inset: 0 (i.e. top/right/bottom/left: 0 — fills `.hero` entirely)
- background-image: `url('texture.jpg')`
- background-size: cover
- z-index: 1

### `.hero .fg-mockup` (Layer 2 — foreground overlay)
- position: absolute
- right: 60px
- top: 80px
- width: 420px
- height: 460px
- background-image: `url('mockup-overlay.png')`
- background-size: contain
- background-repeat: no-repeat
- z-index: 2

### `.hero h1`
- position: relative
- z-index: 3
- font-size: 56px
- font-weight: 700
- line-height: 60px
- letter-spacing: -0.02em
- color: `#14171c`
- padding: 120px 0 0 60px
- max-width: 560px

### `.cta` (button/link)
- display: inline-block
- padding: **13px 27px** (exact — not 12px/24px, not a round value; do not approximate to a Tailwind default)
- border-radius: **9px** (exact — not 8px or 10px)
- background: `var(--accent)` = `#ff5a36`
- color: `#fff`
- font-size: 15px
- font-weight: 600
- margin-left: 60px
- margin-top: 32px

## States & Behaviors
- N/A — no hover, scroll, click, or time-driven behavior is defined anywhere in the CSS or JS for `.hero`, `.bg-texture`, `.fg-mockup`, `.hero h1`, or `.cta`. The only script on the page targets `#site-header` (scroll) and `#tabs` (click) — neither touches the hero. Confirmed by reading the full `<script>` block; no hero-related event listeners exist. This is a genuinely static section, not an under-extracted one.

## Assets
- Layer 1 background image: `texture.jpg` (referenced as `url('texture.jpg')`, relative path — resolve/download from wherever the live page serves it; `background-size: cover`, fills entire 640px-tall hero)
- Layer 2 overlay image: `mockup-overlay.png` (referenced as `url('mockup-overlay.png')`, relative path; `background-size: contain`, fixed 420×460px box positioned 60px from right / 80px from top of `.hero`)
- No icons, no SVGs, no `<img>` tags — both images are CSS `background-image` on `<div>` layers, not `<img>` elements. A builder scanning only for `<img>` tags will miss both — this is exactly the "layered assets" trap the skill warns about.
- No video/canvas/Lottie present.

## Text Content (verbatim)
- H1: "Aurora Studio builds interfaces that feel inevitable."
- CTA button label: "Start a project" (`href="#contact"`)

## Responsive Behavior
- **Desktop / Tablet / Mobile:** No media queries exist in the source. `.hero` height is a fixed `640px` and `.fg-mockup` is fixed at `420×460px` positioned with fixed pixel offsets at every viewport width — there is no documented responsive collapse (e.g., no stacking, no hiding the mockup on mobile). This is a known gap in the source fixture, not an extraction omission; flag to the user rather than inventing a mobile layout (e.g., don't assume the mockup should hide under 768px — nothing in source says so).
- **Breakpoint:** N/A — none defined.

---

## Note: Tabs Section (out of mandatory scope — brief flag only)
- **Interaction model:** click-driven (explicit `#tabs` click listener; `.tab-btn` toggles `.active` on itself and the matching `.panel[data-panel]`; contrast this deliberately with the header's scroll-driven model — do not build these two sections with the same mechanism). Full spec (per-state content, exact tab-button styles, panel styles) intentionally omitted here per scope instructions; a full spec file would still be required before dispatching a builder for this section per the skill's Pre-Dispatch Checklist.
