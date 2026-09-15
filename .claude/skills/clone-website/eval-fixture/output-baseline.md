# Component Spec — Header & Hero (Aurora Studio fixture)

Source: `target.html`. Global reset: `* { box-sizing: border-box; margin: 0; }`. Body font: `-apple-system, sans-serif`. CSS custom properties: `--ink: #14171c`, `--accent: #ff5a36`.

## 1. Header (`<header id="site-header">`)

### Structure
```
<header id="site-header">
  <nav>
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
```
Three text links only — no logo, no button, no hamburger/mobile menu markup present in the fixture.

### Layout / box model
- `position: sticky; top: 0; z-index: 10;`
- Default (unscrolled) state: `padding: 24px 40px; background: transparent; box-shadow: none;`
- `nav a`: `margin-right: 24px; font-size: 15px; text-decoration: none;` (last link still gets the 24px right margin since no `:last-child` override exists)

### Scrolled state — **dynamic, JS-driven, not CSS `:hover`/scroll-snap**
A `scroll` listener on `window` toggles a `.scrolled` class on `#site-header` when `window.scrollY > 40`:
```js
window.addEventListener('scroll', () => {
  document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 40);
});
```
`header.scrolled` overrides:
- `background: #14171c` (was transparent)
- `box-shadow: 0 2px 12px rgba(0,0,0,0.25)` (was none)
- `padding: 12px 40px` (was `24px 40px` — vertical padding shrinks, horizontal stays 40px)
- `nav a` color flips from `#14171c` (default) to `#ffffff` (scrolled)

All three properties (`background`, `box-shadow`, `padding`) animate via:
```css
transition: background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease;
```
Threshold is a hard 40px scrollY cutoff, not a gradient/interpolated effect — the class either is or isn't applied.

### React/Tailwind implementation notes
- Needs a `useEffect` scroll listener (`scrollY > 40`) toggling boolean state, not a CSS-only `:hover` or `sticky` trick.
- Tailwind: base classes `sticky top-0 z-10 bg-transparent shadow-none px-10 py-6 transition-[background,box-shadow,padding] duration-250 ease-in-out`; conditionally apply `bg-[#14171c] shadow-[0_2px_12px_rgba(0,0,0,0.25)] px-10 py-3` and switch link color `text-[#14171c]` → `text-white` when scrolled. Custom values (`px-10`≈40px, `py-6`=24px, `py-3`=12px) match exactly; shadow needs an arbitrary value since it isn't a stock Tailwind shadow.
- Debounce/throttle is not present in the source — reproduce as a plain unthrottled listener for pixel/behavior fidelity unless performance is explicitly a concern.

## 2. Hero (`<section class="hero">`)

### Structure
```
<section class="hero">
  <div class="bg-texture"></div>
  <div class="fg-mockup"></div>
  <h1>Aurora Studio builds interfaces that feel inevitable.</h1>
  <a class="cta" href="#contact">Start a project</a>
</section>
```

### Container
- `.hero`: `position: relative; height: 640px; overflow: hidden;` (fixed height, not viewport-relative; content taller than 640px is clipped)

### Layer stack — **two separate stacked images, not one background**
This is easy to miss: the hero has **no background image of its own**. Two absolutely-positioned `<div>`s supply two independent images, stacked by `z-index`:

1. **`.bg-texture`** (z-index 1) — full-bleed background layer
   - `position: absolute; inset: 0;`
   - `background-image: url('texture.jpg')`
   - `background-size: cover;`
   - Fills the entire 640px-tall hero.

2. **`.fg-mockup`** (z-index 2) — foreground image overlay, NOT full-bleed
   - `position: absolute; right: 60px; top: 80px;`
   - Fixed box: `width: 420px; height: 460px;`
   - `background-image: url('mockup-overlay.png')`
   - `background-size: contain; background-repeat: no-repeat;` (image scales to fit inside the box, preserving aspect ratio, single copy)
   - Positioned in the upper-right area of the hero, floating above the texture.

3. **`h1`** (z-index 3, on top of both images)
   - `position: relative;` (so z-index applies against the absolutely-positioned siblings)
   - Typography: `font-size: 56px; font-weight: 700; line-height: 60px; letter-spacing: -0.02em; color: #14171c;`
   - `padding: 120px 0 0 60px;` — this padding is how the heading is positioned inside the hero (120px from top of section, 60px from left); it is not centered.
   - `max-width: 560px;` — text wraps within this width, does NOT span the full hero width (important since `.fg-mockup` occupies the right side starting ~60px from the right edge).
   - Copy: "Aurora Studio builds interfaces that feel inevitable."

4. **`.cta`** (anchor, sits after `h1` in normal flow but is NOT absolutely positioned — flows below the h1 within the hero)
   - `display: inline-block;`
   - `padding: 13px 27px;` — **exact, non-round values** (not 12/24, not a stock Tailwind spacing token)
   - `border-radius: 9px;` — **exact, non-round** (not 8px or 10px)
   - `background: var(--accent)` = `#ff5a36`
   - `color: #fff; font-size: 15px; font-weight: 600;`
   - `margin-left: 60px; margin-top: 32px;` — left-aligns with the h1's left padding (60px) and sits 32px below it in normal document flow.
   - Copy: "Start a project", `href="#contact"`.
   - No hover/active state defined in the CSS — static single state only.

### React/Tailwind implementation notes
- Reproduce as a `relative h-[640px] overflow-hidden` container with two `absolute inset-0`/positioned `div`s for the images (do not collapse into a single `bg-*` on the section — the eval specifically checks for two distinct image layers with different `background-size` behavior: `cover` vs `contain`).
- `.fg-mockup`: `absolute right-[60px] top-[80px] w-[420px] h-[460px] bg-contain bg-no-repeat`, plus an arbitrary-value background-image utility class built from the real asset path at build time (deliberately not spelled out in Tailwind's bracket syntax here — Tailwind auto-scans this whole repo for class-like text, including markdown, and a literal example previously broke the dev build).
- `h1`: `relative z-[3] max-w-[560px] pt-[120px] pl-[60px] text-[56px] font-bold leading-[60px] tracking-[-0.02em] text-[#14171c]`.
- `.cta`: `inline-block ml-[60px] mt-8 px-[27px] py-[13px] rounded-[9px] bg-[#ff5a36] text-white text-[15px] font-semibold` — note `mt-8` = 32px matches exactly, but padding/border-radius need arbitrary values since 13/27/9 aren't stock Tailwind scale numbers.
- Exact px values throughout must NOT be rounded to nearest Tailwind token (4/8/12/16/24px spacing scale, 4/6/8/12/16/24 rounded corners) — several values are deliberately off-scale (13px, 27px, 9px padding/radius on the CTA) as a fidelity check.

## 3. Assets referenced (not included in this HTML, must be sourced/placeholder'd)
- `texture.jpg` — hero background texture, covers full 640×(hero width) area.
- `mockup-overlay.png` — foreground device/UI mockup image, 420×460 box, `contain` fit, transparent background expected (PNG) so the texture shows around it.

## 4. Out of scope for this doc (present in file, not header/hero)
The tabs/panels section (`#tabs`, `.panel`) below the hero is click-driven (event delegation on `#tabs`, toggling `.active` classes) — included in the source for contrast with the header's scroll-driven behavior, but not part of this header/hero spec.
