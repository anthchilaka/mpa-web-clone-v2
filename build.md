# Build — MPA-web-clone-v2

Reference: full session-by-session history lives in `D:\AI Tools\Claude Code\Outputs\sessions\log.txt`
(search for "MPA-web-clone-v2"). This file records only what has actually worked and shipped —
not attempts, not narrative, not in-progress state. See `troubleshoot.md` for bugs and fixes.

## Current scope

Production replacement for **anthonychilaka.com**. Originally scoped as a local design-fidelity
benchmark against alextheanalyst.com (see git history of `TARGET.md`); scope changed 2026-09-15 —
this build now supersedes the parallel Firebase Studio MPA rebuild (SPA vs MPA project), which has
been told to stop work. Static export → Firebase Hosting is the deploy target.

## Phase plan

| Phase | Scope |
|---|---|
| 0 — Housekeeping | TARGET.md scope correction, layout.tsx metadata fix, static export config |
| 1 — Scaffold | 8 remaining route folders/page.tsx |
| 2 — SEO/GEO content | Crawlable H1+JSON-LD, real alt text, no bare placeholders, real title/description per page, llms.txt last |
| 3 — Visual/interaction build | Page-specific layouts from real content already sourced |
| 3.5 — Analytics port | GTM (GTM-MQV493DM) / GA4 (G-GFK6117QNY), pushPageView, page_render_mode, scroll-depth events |
| 4 — Local dev loop | Page-by-page build, tsc --noEmit after each |
| 5 — Build & preview | Static export build, verify all routes + mobile |
| 6 — GTM/GA4 validation | Blocking gate — confirm page_render_mode and scroll events fire, before deploy |
| 7 — Deploy (staged) | Firebase Hosting preview channel → Anthony's review → promote to production |
| 8 — Re-baseline | 24h+ post-promotion, compare against existing SPA baseline (session log, SPA vs MPA blueprint) |

## Completed

### Home page (Phase 3, pre-dates the current phase plan)
- Nav, hero (Ken Burns carousel), CTA, footer built with real content: real LinkedIn/Upwork/WhatsApp
  links, real Cal.com booking CTA, glow+zoom hover on social icons, flicker hover on footer nav links,
  shine-sweep CTA hover.
- Full three-layer design token architecture (primitive → semantic → component) in `globals.css`,
  covering the black/red/white palette plus a separate teal carousel accent. All 4 home components
  reference tokens, no hardcoded hex remaining.
- `design-system` skill installed globally at `C:\Users\Emeka Chilaka\.claude\skills\design-system`
  (byte-verified copy), available to every project going forward.

### Content & design decisions locked in
- Real page content sourced for About, Services, AI Automation, Templates, Blog, Contact (from the
  Firebase backup of the live anthonychilaka.com site). Portfolio and Walkthroughs confirmed as
  honest placeholder pages — no fabricated content.
- Blog code-block style: Option C (minimal editorial panel, header bar + border), verified against a
  real Medium post for realism, kept as originally designed per Anthony's call.
- Blog/Walkthroughs page layout: Medium-article structure (masthead, bold subheads, numbered steps,
  inline code pills + code blocks, captioned images).
- Deploy target: static export (`output: 'export'`), not Firebase's Next.js Cloud Run/Functions
  integration — matches the existing Firebase Hosting config and avoids cold-start latency.

### Housekeeping (2026-09-15)
- Project-scoped log added at `logs/session-log.txt` (additive alongside the shared sessions log).
- `clone-website` skill eval built and run: 4/4 tie on trap detection between with-skill and
  baseline on a static-source-reading task; real differentiator is spec-template format discipline,
  not detection accuracy. Scorecard: `.agents/skills/clone-website/eval-fixture/scorecard.md`.
- `design-system` skill installed globally (see above) confirmed still byte-identical to the
  project-local copy — no drift.
- Tailwind v4 `@source` restriction added to `globals.css` (scans `src/` only) — closes the class of
  bug where any repo file (docs, eval output) containing bracket-syntax text could break the build.

### Phase 0 — Housekeeping (production plan), complete 2026-09-15
- `TARGET.md` corrected to reflect the production scope change.
- `layout.tsx` metadata fixed: real title/description (from the sourced About page content),
  no more mauriciojuba.com reference.
- `next.config.ts` set to static export (`output: 'export'`, `images.unoptimized: true`).
- Verified, not just written: `npx tsc --noEmit` clean, `npm run build` succeeds and produces a real
  `out/` directory with static HTML, dev server confirmed clean on a fresh browser tab (no console
  errors).

### Phase 1 — Scaffold, complete 2026-09-15
- All 8 remaining routes created (`/about`, `/services`, `/walkthroughs`, `/portfolio`,
  `/ai-automation`, `/templates`, `/blog`, `/contact`), each wired with the shared `SiteNav`/
  `SiteFooter` and a real (not placeholder-text) H1 sourced from the Firebase content pull.
  Content/SEO/visual build for each page is still Phase 2/3 — this is routing structure only.
- Verified: `npx tsc --noEmit` clean, all 8 routes return HTTP 200 in dev, and a full
  `npm run build` static-export succeeds for all 9 routes (home + 8) with zero errors.

### Phase 2 + 3 — SEO/GEO content + visual build, complete 2026-09-15
Built in order: About → Services → AI Automation → Templates → Contact → Blog → Portfolio →
Walkthroughs. Each page verified individually (`tsc --noEmit`, dev-server visual check) before
moving to the next; final full `npm run build` confirms all 9 routes compile clean together.

- **About** — real bio + 4 service pillars, `Person` JSON-LD, real title/description.
- **Services** — 5 real services with real CTAs (Cal.com/WhatsApp/`/templates`/`/walkthroughs`),
  real areas-served list, `Service`/`OfferCatalog` JSON-LD.
- **AI Automation** — 3 real case studies (Credit Analyst automation, Claude Workspace Audit, Kachi
  AI Assistant) with real GitHub links and real stack/outcome detail, `ItemList` JSON-LD.
- **Templates** — 6 real template cards with real external/WhatsApp CTAs, `ItemList` JSON-LD.
- **Contact** — real Cal.com CTA card + social icons. X/Twitter icon added 2026-09-15 once Anthony
  confirmed the handle (`https://x.com/anthonychilaka`) — no raster asset existed for it, so a new
  `public/icons/x.svg` was created (black badge, white glyph, matches the existing icon sizing).
  Wired into all 3 places the socials list is duplicated: `SiteNav.tsx`, `ContactPage.tsx`,
  `SiteFooter.tsx` (not a shared component — found during this pass, not refactored, just kept in
  sync three times).
- **Blog** — full Medium-style article (masthead, bold subheads, real code block using the Option C
  style + real `pushPageView` snippet, `BlogPosting` JSON-LD). Only one route exists (`/blog`, no
  `/blog/[slug]`) since that's what the actual scoped 8-page plan called for.
- **Portfolio / Walkthroughs** — honest placeholder pages, exact real "coming soon" copy from the
  Firebase content pull, no fabricated dashboards/guides. Walkthroughs additionally shows a real
  code preview (same `pushPageView` snippet) as a legitimate teaser, per the source content's own
  structure.
- New global CSS added for the blog's Option C code-block style (`.code-panel`, `.code-inline`).

### Phase 2 audit — gaps found, 2026-09-15
Re-checked the Phase 2 SEO/GEO plan against what actually shipped, at Anthony's request. Not
fabricated as complete — recorded as open gaps:
- **JSON-LD** present on only 5/9 routes (About, Services, AI Automation, Templates, Blog). Home and
  Contact have none — both are real content pages, not placeholders, so this is a genuine gap
  (Portfolio/Walkthroughs correctly have none, being placeholders).
- **`llms.txt`** not yet created. Per blueprint this is deliberately last, once all routes are final
  — still true given the nav/content restructure below, so remains open.
- **No FAQ or Terms & Conditions page anywhere in the build.** Grepped `src/` — zero matches. Not a
  regression; never existed in this build.
- **No dedicated tool-stack section.** Power BI/Excel/SQL/Python/n8n/etc. only appear inline inside
  bios (About) and case-study `stack:` fields (AI Automation) — no standalone "Tools I use" section
  on any page.
All four logged as open follow-up work, not yet scheduled to a phase.

### Nav restructure + Portfolio/Walkthroughs content swap, 2026-09-15
- `SiteNav.tsx` primary bar: `Walkthroughs` → `AI Automation` (promoted out of the "More" dropdown).
- `SiteNav.tsx` "More" dropdown: `AI Automation` removed (now primary); `Walkthroughs` re-added,
  relabeled `Data Challenge Walkthrough`.
- **Bug found and fixed in the "More" dropdown:** hover-open/close used a `mt-2` margin gap between
  the trigger and the panel. Margin sits outside the hoverable box, so moving the pointer from
  "More" down into the menu crossed a dead zone and closed the menu before any item could be
  clicked. Fixed by converting the gap to `pt-2` padding (kept inside the hoverable box) on a
  bridging wrapper. Also replaced the generic `hover:bg-gray-50` item state with a real brand-accent
  hover (`--link-hover` red + subtle tint), since the old state didn't reference the token system.
  Verified via Claude in Chrome: hover-traverse-and-click now works end to end.
- **Content swap:** `/portfolio` now hosts what was the Walkthroughs page content — heading changed
  to "Portfolio Project Walkthroughs," subheading to "Curated, step-by-step guides for optimizing
  your business from build to production. Coming soon!", code-preview teaser section kept, and its
  SPA/MPA snippet caption expanded to spell out the acronyms (SPA = single-page application, MPA =
  multi-page application) per Anthony's writing-style pass.
- `/walkthroughs` repurposed as the future home for FP20/Data Challenge step-by-step build guides
  (source content to come from `D:\AI Tools\Claude Cowork\OUTPUTS\Data Challenge`). New honest
  placeholder: `walkthroughloadingv2.webp` + "Data Challenge Walkthroughs" heading + caption "Full
  build breakdowns from Power BI, Excel, and Fabric analytics challenges — coming soon."
- Verified: `npx tsc --noEmit` clean after every edit in this batch.

### Templates page overhaul, 2026-09-15
- Nav dropdown label: `Templates` → `WebSite Template`.
- Subheading rewritten to WordPress-specific copy directing visitors to the per-card CTA button.
- All 6 template cards now show a real screenshot image (from `public/images/`) and a real external
  URL, replacing the placeholder `wpastra.com` link every card previously shared:
  - Business Template → `BusinessTemplate.webp` → love-nature-02 demo
  - Finance Template → `FinanaceTemplate.webp` → financial-accounting-04 demo
  - Restaurant Template → `FastFood.webp` → fast-food-04 demo
  - Beauty and Fashion → `BeautyFashion.webp` → black-friday-bonanza-04 demo
  - NGO/Services → `NGO.webp` → pet-care-04 demo
  - Enterprise Solution → `CoperateTemplate.webp` (swapped in after an initial
    `businessanalyticsv2.webp` pass), CTA restyled to match the home page's shine-sweep
    "Book a discovery call" button instead of a plain text link.
- Verified: `npx tsc --noEmit` clean, confirmed live in Claude in Chrome (all 6 cards render
  correctly, nav dropdown label confirmed via `find`).
