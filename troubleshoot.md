# Troubleshooting — MPA-web-clone-v2

Bugs found during this build and how they were actually fixed. Newest first.
Full narrative context for any entry is in `D:\AI Tools\Claude Code\Outputs\sessions\log.txt`.

---

## "More" nav dropdown couldn't be clicked — hover dead zone between trigger and menu

**Symptom:** Anthony reported the "More" dropdown in `SiteNav.tsx` opened on hover but closed again
before any item could be clicked — items were completely unreachable by mouse.

**Cause:** The dropdown open/close state was driven by `onMouseEnter`/`onMouseLeave` on a `relative`
wrapper `<div>`, but the dropdown panel itself was positioned `top-full mt-2` — an 8px **margin**,
which sits outside the wrapper's own box. Moving the cursor from the "More" button down into the
menu crossed that 8px gap, which is not covered by any element, so the pointer briefly left the
wrapper's DOM subtree and fired `onMouseLeave`, collapsing the menu mid-traversal.

**Fix:** Replaced the margin gap with `pt-2` **padding** on a bridging wrapper — padding is part of
the element's own box, so the hoverable region now extends unbroken from the button through the
menu. Also replaced the generic `hover:bg-gray-50` item state (not token-based) with a real
brand-accent hover (`--link-hover` red + subtle tint). Verified via Claude in Chrome: hover, move
down through the former gap, and click all resolved correctly afterward.

**Takeaway:** A hover-driven dropdown's open/close handlers must live on an element whose *box*
(not just its visually-rendered children) actually spans the full hoverable area, gap included.
Any `margin`-based spacing between a hover trigger and its target breaks this — use `padding` on
a wrapper instead whenever hover state must survive crossing that gap.

---

## Footer nav labels went stale after the header nav restructure

**Symptom:** Header nav (`SiteNav.tsx`) was updated to promote AI Automation to primary and rename
`Templates`/`Walkthroughs` in the "More" dropdown, but the footer (`SiteFooter.tsx`) kept its own
separate `NAV_LINKS` array and still showed the old labels — "Walkthroughs" and "Templates" — even
though both routes' content and purpose had changed.

**Cause:** Nav link data isn't shared between `SiteNav.tsx` and `SiteFooter.tsx` — each hardcodes
its own copy. Same root issue as the duplicated `SOCIALS` array (three separate copies across
`SiteNav.tsx`, `ContactPage.tsx`, `SiteFooter.tsx`) — editing one doesn't touch the others.

**Fix:** Relabeled the footer's two stale entries to match: `Walkthroughs` → `Data Challenge
Walkthrough`, `Templates` → `WebSite Template`. Not refactored into a shared source of truth this
pass — noted as a real risk (silent drift on the next nav change) but out of scope for a copy edit.

**Takeaway:** Any future nav-label or route-purpose change must be checked against all 3 places
`SOCIALS` and both places nav link lists are duplicated, until/unless they're consolidated into one
shared `src/lib/nav.ts`-style source of truth.

---

## Blog/Walkthroughs code blocks shipped without the approved syntax highlighting

**Symptom:** Anthony reported the code snippet on `/walkthroughs` didn't match the colored example
he'd approved (Option C mockup). Same true on `/blog` — not spotted at the time because the visual
check only confirmed the panel chrome (gray background, header bar, border) rendered, not that the
actual approved token colors were present.

**Cause:** When translating the 3-iteration comparison artifact into real page code, only the panel
container styling was carried over. The artifact's `.kw`/`.fn`/`.str`/`.num`/`.pu` token-color spans
around the `pushPageView` snippet were dropped — the real pages rendered the snippet as one plain
string with no highlighting spans at all.

**Fix:** Added the token color classes to `globals.css` (`.tok-kw`, `.tok-fn`, `.tok-str`,
`.tok-num`, `.tok-pu`, same hex values as the original artifact) and extracted a shared
`PushPageViewSnippet` component with the highlighted spans, used identically on both `/blog` and
`/walkthroughs` instead of duplicating a plain string in each page. Verified visually on both pages
after the fix, not just re-read the code.

**Takeaway:** When a mockup/comparison artifact gets approved, re-check the *shipped* implementation
against the *exact* approved version property-by-property (container chrome AND content styling),
not just "does it look roughly like that option." A visual check that only screenshots the outer
container can miss missing detail inside it.

---

## Turbopack dev server didn't pick up new Tailwind classes from a newly-created page

**Symptom:** A new page's `img` used `h-5 w-5 scale-[2]` (following the existing footer/nav icon
pattern, which uses `h-4 w-4 scale-[2]` successfully). Rendered at ~523×523px instead of ~40×40px —
enormous, breaking the page layout. No console error, no build error.

**Cause:** `.h-5`/`.w-5` weren't in the compiled stylesheet at all (confirmed via
`document.styleSheets` inspection) — not a wrong-class bug, a missing-class bug. The Turbopack dev
server (already running from earlier in the session, through several unrelated file edits and one
`@source` config change) hadn't regenerated its Tailwind utility set to include classes first used
in a page created after the server's last cache-clearing restart.

**Fix:** Killed the dev server process and `rm -rf .next` again, restarted clean. Classes compiled
correctly on the next request. No code change was needed — the source was correct the whole time.

**Takeaway:** This project's dev server has now needed a hard restart (kill process + clear `.next`)
three separate times this build for three different reasons (a stale error overlay, a `next.config`
change, and now a missing utility class after a long-running session). When something renders wrong
with no corresponding error message, suspect server/cache staleness before suspecting the code —
verify by restarting clean before spending time debugging the source.

---

## Tailwind v4 auto-scan compiled a non-source markdown file, broke the whole build

**Symptom:** Dev server returned a 500 on every route; Next's error overlay showed
`./src/app/globals.css` (a generated file) failing with `Module not found: Can't resolve '...'` at
a `.bg-\[url\(\.\.\.\)\]` rule that was never written by hand anywhere in `src/`.

**Cause:** `.agents/skills/clone-website/eval-fixture/output-baseline.md` — a plain-text eval
artifact, not application source — contained the literal string `bg-[url(...)]` as a Tailwind-class
example in prose. Tailwind v4 has no content-glob config in this project restricting its scan to
`src/`; by default it scans the whole repo for class-like text, including markdown, and tried to
compile that literal example as a real utility class. `url(...)` isn't valid CSS, so the build broke
project-wide from a file that isn't even imported by any component.

**Fix:** Rewrote the line in prose so it contains no bracket-syntax Tailwind class text at all (a
first attempt that just swapped the placeholder text — `bg-[url(PATH)]` — still matched the same
scan pattern and made it worse, two broken classes instead of one). Then `rm -rf .next` — Turbopack
had already baked the broken class into its incremental build cache, so the source fix alone wasn't
enough; the existing dev server process also had to be killed and restarted, not just hot-reloaded,
to pick up the cleared cache. Verified on a fresh browser tab with an empty console, not the same
tab (which still showed stale cached error messages from before the fix).

**Takeaway:** Any plain-text file placed anywhere inside a Tailwind v4 project — docs, eval output,
scratch notes — is scanned as a class-name source unless explicitly excluded. Never write literal
Tailwind bracket-syntax examples (`bg-[...]`, `w-[...]`, etc.) in prose/markdown inside the repo;
describe them in words instead. If a build breaks from a "phantom" class not found anywhere in
`src/`, check non-source files in the repo before assuming a config or dependency issue.

---

## Token collision with Tailwind/shadcn's own `@theme inline` keys

**Symptom:** CTA button, nav link hover, and footer headings all rendered white instead of the
intended red brand accent, despite the token being defined correctly.

**Cause:** A custom CSS variable was named `--color-accent` inside Tailwind v4's `@theme inline`
block in `globals.css`. shadcn's own scaffold already declares a `--color-accent` key later in the
same block (mapped to its near-white `--accent` theme color), which silently won — last declaration
in the block wins, no build error or warning.

**Fix:** Renamed the custom tokens to non-colliding names (`--color-brand-accent`,
`--color-brand-accent-secondary`). Verified by reading back the live page's computed CSS custom
property values via the browser tool, not just re-reading the source.

**Takeaway:** Before naming any new token in a Tailwind v4 `@theme inline` block, check the existing
keys in that same block first — a same-named key later in the block overrides silently.
