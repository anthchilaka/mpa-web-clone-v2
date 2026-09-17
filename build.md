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
| 3.5 — Analytics port | GTM (GTM-MQV493DM) / GA4 (G-GFK6117QNY), pushPageView, page_render_mode, scroll-depth events. Use the `gtm-datalayer` skill for any dataLayer wiring/debugging in this phase |
| 4 — Local dev loop | Page-by-page build, tsc --noEmit after each |
| 5 — Build & preview | Static export build, verify all routes + mobile |
| 6 — GTM/GA4 validation | Blocking gate — confirm page_render_mode and scroll events fire, before deploy. Use the `gtm-datalayer` skill for GTM Preview validation |
| **6.5 — SEO/GEO closeout** | **New phase, added 2026-09-17. Closes the four gaps logged in the 2026-09-15 Phase 2 audit plus two new findings surfaced via the `seo-geo` skill and a skills.sh second opinion. See breakdown below — gate-vs-deploy decision still pending Anthony's confirmation once this phase completes** |
| 7 — Deploy (staged) | Firebase Hosting preview channel → Anthony's review → promote to production |
| 8 — Re-baseline | 24h+ post-promotion, compare against existing SPA baseline (session log, SPA vs MPA blueprint). Use the `bigquery-gold` skill if/when GA4 BigQuery Export is queried for this comparison |

### Phase 6.5, step 1 — robots.txt + sitemap.xml, complete 2026-09-17
- Built as Next.js MetadataRoute files (`src/app/robots.ts`, `src/app/sitemap.ts`), not static
  `public/` files — programmatically lists all 9 real routes, avoiding a manually-maintained
  duplicate list. Both required `export const dynamic = "force-static"` to build under
  `output: "export"` (first build attempt failed without it — Next.js requires this explicitly for
  MetadataRoute files in a static export).
- `robots.txt` explicitly allows: Googlebot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  Claude-SearchBot, Claude-User, plus a wildcard `*` fallback for other crawlers. References
  `sitemap.xml`.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, both `out/robots.txt` and
  `out/sitemap.xml` inspected directly — correct crawler list and all 9 routes present.

### Phase 6.5, step 2 — areaServed: added USA, complete 2026-09-17
- Added `"USA"` to both `AREAS` (`src/app/services/page.tsx`) and Home's inline `areaServed` array
  (`src/app/page.tsx`) — same real, resolvable-place standard as the existing 11 Nigerian cities.
- Since `AREAS` also drives the visible "Areas I Work With" chip list on the Services page (not
  just the JSON-LD), USA now shows there too — same array, single source, no drift.
- "FCT" not added separately — it's the same place as "Abuja," already on the list. "EMEA" stays
  prose-only positioning copy (meta descriptions, "Areas I Work With" intro sentence); never added
  to either `areaServed` array, per the `seo-geo` skill rule.
- Verified: `npx tsc --noEmit` clean.

### Phase 6.5, step 3 — Tools I Use section, complete 2026-09-17
- Placed as a new standalone section on About (`src/app/about/page.tsx`), after the existing
  4-pillar grid — not a new route, per Anthony's confirmation. Closes the "no dedicated tool-stack
  section" gap from the 2026-09-15 audit.
- 8 tools: Power BI, Excel, MySQL, Python, Microsoft Fabric, n8n, OpenCode, Claude Code. "SQL"
  renamed to "MySQL" (real specific tool, not generic label) and Microsoft Fabric added, both per
  Anthony's direction this session.
- **Icon sourcing (real assets, not fabricated):**
  - Excel, MySQL — copied from `D:\AI Tools\Claude Cowork\OUTPUTS\Portfolio-Thumbnail-Icons\`
    (already simple-icons.org format, confirmed by inspecting the existing mysql.svg).
  - Power BI, Python, n8n, OpenCode, Claude — sourced fresh from simple-icons.org (MIT-licensed),
    same library the existing icons came from. Verified each via direct CDN fetch before use.
  - Microsoft Fabric — no simple-icons entry exists (confirmed 404). Sourced from Microsoft's own
    official icon set (`@fabric-msft/svg-icons` / github.com/microsoft/fabric-samples,
    `fabric_48_color.svg`), confirmed as the real official multi-color Fabric logo. Flagged to
    Anthony first: Microsoft's stated terms restrict use to "architectural diagrams, training
    materials, or documentation," which a marketing portfolio site doesn't cleanly fall under.
    Anthony chose to use it anyway (2026-09-17), same class of use as the Excel/Power BI icons
    already on the site.
  - All 6 new/copied icons added to this project's `public/icons/` (not just the Cowork shared
    folder), so the project stays self-contained.
- Verified: `npx tsc --noEmit` clean, confirmed live via dev server + browser (all 8 tools render
  with correct icons, no console errors), dev server stopped after.

### Phase 6.5, step 5 — Terms & Conditions, complete 2026-09-17
- New route `/terms` (`src/app/terms/page.tsx`), 11 sections: Scope of Work, Payment Terms,
  Currency & Transfer Costs (includes Wise as an available payment method, per Anthony),
  Revisions, Intellectual Property, Cancellation, Confidentiality, Limitation of Liability,
  Independent Contractor Status, Termination, Governing Law.
- Content sourced from: (1) real figures Anthony confirmed directly this session — payment
  structure (deposit + size-dependent milestones), revision counts (3 dashboards, 3 templates, 5
  automation builds), governing law choice (client's jurisdiction, case-by-case); (2) external
  research on real contract-clause practice for Nigerian/African freelancers with foreign clients
  (thecareerbuddy.com, remitly.com) for clause structure, not invented boilerplate.
- **Ran the `policy-doc-skeptic-gate` skill** (cross-vendor audit, GPT + Gemini via OpenRouter) on
  the drafted page before treating it as final. Results: `eval-results/terms-page/`. Gemini flagged
  a real inconsistency (services list omitted BI Training/Walkthroughs vs. Section 4) — fixed. GPT
  flagged 3 items needing Anthony's judgment (cancellation-forfeiture default, mutual-termination
  default, IP-warranty enforceability) — Anthony reviewed each and chose: leave cancellation
  open to renegotiation per-SOW, accept GPT's recommended fix on termination, accept GPT's
  recommended fix on the warranty (qualified to "best of its knowledge"). All 3 applied.
  `[MANUAL STEP REQUIRED]` qualified-legal-review line surfaced in the scorecard, not dropped.
- Checked against `my-writing-style`'s global non-negotiable rules (no em-dash confirmed to apply
  even to formal/legal documents per the log's own precedent) — found and fixed one em-dash. Noted
  the log's narrower rules (Unicode bold, sign-offs, greeting patterns) don't apply — this is
  third-party contractual language, a different genre from the log's client-facing-voice scope.
- Linked in `SiteFooter.tsx`'s NAV_LINKS and added to `sitemap.ts`.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds (13 routes), confirmed live via dev
  server + browser, no console errors, dev server stopped after.

### Phase 6.5, step 4 — FAQ page, complete 2026-09-17
- New route `/faq` (`src/app/faq/page.tsx`), built with `FAQPage` JSON-LD from the start (per the
  `seo-geo` research: FAQPage schema is a documented AI-citation-visibility lever).
- 10 Q&As, every answer sourced from facts already confirmed elsewhere on the site or directly by
  Anthony this session — none invented: services list (Services page), payment/revisions/IP/
  cancellation (Terms & Conditions, built same session), areas served (Services/Home/Footer AREAS
  arrays, including the USA addition from step 2), tools stack (About's Tools I Use section, step
  3), booking (Contact page). Last item (remote-delivery infrastructure: dedicated home office,
  Starlink, 269 Mbps down / 19 Mbps up / 23ms latency) added per Anthony's screenshot — phrased as
  "tested at" rather than a permanent guarantee, since a speed test is a single snapshot.
- Linked in `SiteFooter.tsx`'s NAV_LINKS and added to `sitemap.ts`.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds (13 routes total: home + 8 original
  + terms + faq + robots.txt + sitemap.xml as their own static routes), confirmed live via dev
  server + browser (all Q&As render, footer link confirmed), no console errors, dev server stopped.
- Reordered 2026-09-17 per Anthony: infrastructure Q&A (home office/Starlink) moved to the top,
  with a new "Is the discovery call free?" Q&A directly under it (yes, per cal.com booking link —
  matches the existing "Schedule 1-on-1" CTA on Contact, no new claim). tsc re-verified clean.

### Cal.com link correction, 2026-09-17
- Wrong link (`cal.com/anthonychilaka`) had been used in 6 places (Contact x2, FAQ x2, Services x2)
  — real link is `cal.com/anthonychukwuemekachilaka/30min`. `HomeCta.tsx` already had the correct
  link, so it was the only correct instance before this fix, not a template to copy from
  elsewhere — worth noting since it means the wrong link had been silently propagating from the
  Services/Contact pages built earlier, not from a single shared source. All 7 references
  (`HomeCta.tsx`, `contact/page.tsx` x2, `faq/page.tsx` x2, `services/page.tsx` x2) now consistent.
  Verified via grep across `src/` — zero remaining instances of the old link. `npx tsc --noEmit`
  clean.

### Phase 6.5, step 6 — llms.txt, complete 2026-09-17
- Added as a static file (`public/llms.txt`), not a generated route — no dynamic content needed.
- Content pulled entirely from real `metadata.title`/`metadata.description` already shipped on
  each page (About, Services, AI Automation, Templates, Blog, Portfolio, Walkthroughs, Contact,
  FAQ, Terms), not new copy. Key facts section reuses the same tools list (About) and areas-served
  list (Services/Home/Footer, including the USA addition) already established this session.
- Last of the original Phase 2 blueprint's SEO/GEO items, deliberately sequenced last per the
  blueprint and reconfirmed low-priority by two independent sources earlier this session (local
  `seo-geo` skill + skills.sh's agricidaniel/claude-seo, citing Google's May-June 2026 guidance
  that it doesn't affect Google Search ranking or citation).
- Verified: `npm run build` succeeds, `out/llms.txt` inspected directly and confirmed correct.

**All 6 Phase 6.5 steps now complete: robots.txt+sitemap.xml, areaServed/USA, Tools I Use, FAQ,
Terms & Conditions, llms.txt.** Gate-vs-deploy decision still open, to revisit with Anthony next.

### Spacing consistency audit + fix, 2026-09-17
Ran a spacing audit across all inner pages using the `design-review` methodology (skills.sh,
plugin87/ux-ui-agent-skills — 6-dimension rubric). Report-only pass first, per Anthony's request,
using computed layout (`getBoundingClientRect`) rather than relying on screenshots alone (one
screenshot round hit a stale-paint rendering glitch in the browser pane — cross-checked against
computed layout and confirmed it was a capture artifact, not a real bug).

**Found and fixed (low-risk, mechanical):**
- H1-to-intro-paragraph gap was split two ways: `mt-6` on About vs. `mt-4` on AI Automation, FAQ,
  Terms, Templates. Standardized About to `mt-4` (majority convention).
- Intro-to-main-content-block gap was split two ways: `mt-16` on About & AI Automation vs. `mt-14`
  on Services, FAQ, Terms, Templates. Standardized both outliers to `mt-14`.
- FAQ/Terms list-item spacing differed (`space-y-8` vs `space-y-10`) for structurally equivalent
  content. Standardized Terms to `space-y-8` to match FAQ.
- Files touched: `src/app/about/page.tsx`, `src/app/ai-automation/page.tsx`, `src/app/terms/page.tsx`.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds (13 routes).

**Found, left alone per Anthony's call:**
- Home hero (`HeroCarousel.tsx`) uses a fixed `calc(100svh - 76px)` container with the tagline
  baked into the background image (`bg-cover`) — leaves a large dead-white gap on tall/wide
  viewports since the image's aspect ratio doesn't scale with container height. Real finding,
  higher-risk fix (touches the approved hero visual), deliberately deferred, not forgotten.

### Footer nav ragged-gap fix, 2026-09-17
Anthony spotted an oversized gap between "Services" and "Portfolio" in the footer's Navigate list.
Root cause: `NAV_LINKS` rendered as one CSS Grid (`grid-cols-2`), which forces shared row heights
across both columns — "Data Challenge Walkthrough" wraps to 2 lines, stretching that whole row and
visually displacing "Portfolio" below it, even though nothing was actually missing.
- Fix: split into two independent `<ul>` columns (flex container, `NAV_LINKS.filter` by even/odd
  index) instead of one shared grid — same left/right pairing as before, but each column's row
  heights are now independent so a long label on one side can't distort spacing on the other.
- `src/components/SiteFooter.tsx`. Verified: `npx tsc --noEmit` clean, confirmed live (gap now
  even), no console errors on a fresh tab.
- **Process note:** hit two stale-cache artifacts while verifying this fix, both resolved, neither
  a real bug: (1) a screenshot tool glitch (blank white capture) that computed-layout inspection
  showed wasn't real; (2) a "duplicate key" React console error that persisted across dev-server
  restarts because the *browser tab's* HMR WebSocket connection was still bound to a killed server
  process — resolved by opening a fresh tab, not by touching any code. Confirms the file's `FAQS`
  array never actually had a duplicate.

### Logo links + footer copy fix, 2026-09-17
- Footer intro paragraph ("Business Analyst and AI Automation Consultant, serving clients across
  Nigeria and EMEA") updated to include the USA, matching every other areaServed reference fixed
  this session.
- Both the header nav logo (`SiteNav.tsx`) and footer logo (`SiteFooter.tsx`) changed from linking
  to `/` (Home) to `https://github.com/anthchilaka`, per Anthony's explicit request. "Anthony
  Chilaka" text next to the footer copyright line is now also a link to the same GitHub URL
  (previously plain text).
- **Flagged to Anthony directly, not silently applied:** with both logos now pointing to GitHub,
  there is no logo-based path back to Home anywhere on the site — breaks the standard "logo links
  to home" convention site-wide, not just in the footer. "Home" remains available as its own
  separate link in both nav menus regardless.
- Verified: `npx tsc --noEmit` clean, confirmed live (all 3 links resolve to the GitHub URL — header
  logo, footer logo, footer copyright name), no console errors on a fresh tab.

### Templates page subheading rewrite, 2026-09-17
- `src/app/templates/page.tsx` intro paragraph replaced with Anthony's dictated text verbatim:
  "...click on the desired thumbnail to submit your pick, or use the View Template Live to
  navigate the template."
- **Flagged, then reconciled:** 5 of 6 template cards use "View Template Live" as their CTA button
  label (`TEMPLATES` array), but the Enterprise Solution card's button reads "Contact to Discuss"
  instead (deliberately routes to WhatsApp, not a live demo). Subheading's closing clause
  generalized to "...use the button below each template to view it live or get in touch" so it
  stays accurate for both button types without naming either specifically.
- Verified: `npx tsc --noEmit` clean.

**Adjacent finding, not spacing, noted for later:** Home's hero tagline and `HomeCta.tsx` copy
still read "Nigeria and EMEA" — doesn't include USA, unlike every other areaServed reference
updated earlier this session (Services/Home JSON-LD/Footer/FAQ). Not fixed as part of this pass
since it's content, not spacing, and wasn't the scope of Anthony's request.

**`HomeCta.tsx` fixed, 2026-09-17** — "Nigeria and EMEA" → "Nigeria, the USA, and EMEA". `npx tsc
--noEmit` clean.

**Hero tagline ("15+ Years Experience | 2+ Years AI Automation | Nigeria & EMEA") NOT fixed —
cannot be fixed via code.** Confirmed by reading `HeroCarousel.tsx` in full: the tagline is baked
into the source image `/hero/anthonychilakahero1.webp` itself, not live HTML/CSS anywhere in the
component. Needs the source image re-exported with updated copy (a design task, likely originally
built in Figma/Canva), not a code change. Flagged to Anthony, not silently skipped.

### Phase 6.5 — SEO/GEO closeout, breakdown (agreed order, 2026-09-17)
1. `robots.txt` + `sitemap.xml` — technical crawl-gate layer, built together (same Next.js static-export
   mechanism). Explicit allow list per the `seo-geo` skill + skills.sh second opinion (agricidaniel/claude-seo):
   Googlebot, GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot (ChatGPT-User/Claude-User are
   user-triggered and ignore robots.txt regardless, but list them for clarity). Training-bot access
   (GPTBot/ClaudeBot) and search-citability-bot access (OAI-SearchBot/Claude-SearchBot) are separate
   claims — report them separately, never conflated.
2. `areaServed` correction — add USA to the real named-location list already used in Services/Home
   JSON-LD (Lagos, Ibadan, Port Harcourt, Kaduna, Abuja, Bauchi, Kano, Plateau, Jos, Owerri, Awka, USA).
   "EMEA"/"FCT" stay prose-only (FCT = Abuja, already listed; EMEA is a region acronym, never a schema
   `areaServed` value).
3. Tools I Use — new standalone section, consolidating Power BI/Excel/SQL/Python/n8n/OpenCode/Claude
   Code mentions currently scattered across About's bios and AI Automation's `stack:` fields. Location
   (own route vs. section on an existing page) still open.
4. FAQ page — build `FAQPage` JSON-LD from the start, not bolted on after (Princeton GEO research cited
   via skills.sh: FAQPage schema is a documented +40% AI-citation-visibility lever). Needs Anthony's
   real Q&A content.
5. Terms & Conditions page — needs Anthony's input on actual terms; not drafted from invented detail.
6. `llms.txt` — last, per the original blueprint and reconfirmed by two independent sources (local
   `seo-geo` skill + skills.sh's agricidaniel/claude-seo, citing Google's own May–June 2026 guidance):
   genuinely low-priority, Google explicitly says it doesn't affect Google Search ranking/citation.

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

### Template-request email feature — backend scaffold + form UI, 2026-09-15
Built ahead of Phase 6/7, gated behind manual setup Anthony still needs to complete (Firebase
project connection, Resend domain DNS still propagating at time of writing). Nothing here is
deployed or live yet.

**Backend (`functions/`):**
- `requestOtp` / `verifyOtpAndSend` — 2nd-gen `onCall` Firebase Functions, `enforceAppCheck: true`
  on both (public-facing, no login, so App Check is the abuse gate). Region `europe-west1`,
  matching the Resend sending domain's region.
- OTP codes are 6-digit, SHA-256 hashed before storage (never plaintext), single-use (deleted on
  successful verify), 10-minute TTL via a Firestore `expiresAt` field, 60s resend cooldown per
  email, 5-attempt cap before a code is invalidated. Firestore doc IDs are a hash of the email too
  — no plaintext address sits in the console/logs at rest.
- `firestore.rules` — `otpRequests` collection fully denied to client reads/writes; only the
  Admin SDK inside Functions can touch it.
- `firebase.json` — static Hosting (`out/`) + `/api/request-otp` and `/api/verify-and-send`
  rewrites to the two functions.
- Sends via Resend, from a dedicated `mail.anthonychilaka.com` subdomain — a separate Resend
  *team* from Kachi's (not just a separate domain), so API keys, domains, and send logs are fully
  isolated between the two projects.

**Frontend (`/templates`):**
- `TemplatesInteractive.tsx` — hover overlay (Lucide's `MousePointerClick` icon + "Click to
  email" caption on a dark scrim) over each of the 6 template screenshots; click scrolls smoothly
  to a shared request form at the page bottom and carries the selected template's name into form
  state.
- `TemplateRequestForm.tsx` — two-step flow (email → OTP entry), prefilled body preview
  substituting the selected template name, shine-sweep send button matching the home page's
  "Book a discovery call" CTA. Renders a "not live yet" fallback instead of a broken form when
  Firebase isn't configured (`isFirebaseConfigured()` check) — safe to ship before the backend is
  connected.
- WhatsApp side card next to the form (`callv2.webp`, gradient scrim, "Need it urgently? Chat on
  WhatsApp for a faster response.") using the existing WhatsApp CTA link.
- Added `firebase` (client SDK) as a new dependency; `src/lib/firebaseClient.ts` guards all
  Firebase init behind env-var presence checks so a missing config never crashes the build.

Verified: `functions/` typechecks clean (`npx tsc --noEmit` inside `functions/`), root project
typechecks clean, full `npm run build` static export succeeds (10 routes, zero errors), form
hover/click/scroll behavior confirmed live in Claude in Chrome.

### Template-request feature — Resend domain + Firebase Functions live, 2026-09-15
- **Resend domain (`mail.anthonychilaka.com`)** set up on a dedicated Resend *team*, fully
  isolated from Kachi's own Resend team/domain. DKIM and SPF (both CNAMEs) verified. DMARC record
  (`_dmarc.mail.anthonychilaka.com`, `p=none`) added directly in Squarespace DNS — confirmed live
  via direct `nslookup`, even though Resend's own dashboard doesn't track/display DMARC for this
  account. Domain's own top-level badge sits at "Partially verified" rather than "Domain verified"
  despite every required record (DKIM + SPF) showing green — per Resend's own docs, DMARC and
  click-tracking are both optional and non-blocking for sending, so this is treated as a cosmetic
  status quirk, not a real gap. Real capability to be confirmed with an actual test send once the
  frontend env vars are wired up.
- **Firebase project connected:** `anthonychilaka-web` (GCP project ID; console "Name" field shows
  "demo" — same project, just two different label fields). Upgraded to the Blaze
  (pay-as-you-go) plan — required for Secret Manager/2nd-gen Functions, expected real cost ~$0/mo
  at this traffic level given Firebase's free-tier allowances.
- **`RESEND_API_KEY`** created as a Firebase secret (`firebase functions:secrets:set`), scoped
  sending-only + domain-restricted on the Resend side. Never committed, never pasted into chat.
- **Cloud Build permission gap hit and fixed** on the first deploy attempt — see `troubleshoot.md`
  for the full root cause (new-GCP-project default service account policy change, not specific to
  this project).
- **Both Functions deployed successfully** to `europe-west1`: `requestOtp` and `verifyOtpAndSend`,
  confirmed via `firebase deploy --only functions` → "Deploy complete!".

**Still open before this feature is fully live:**
1. ✅ Firestore rules deployed, TTL policy on `expiresAt` set and "Serving"
2. ✅ Web App registered, `NEXT_PUBLIC_FIREBASE_*` values in `.env.local`
3. ✅ App Check (reCAPTCHA Enterprise) configured, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` set
4. ✅ Local rebuild confirms the frontend's live form (not the "not live yet" fallback) renders correctly

### Live end-to-end test — WORKING, confirmed 2026-09-17
Full flow confirmed live: template selected → email entered → OTP requested → OTP verified →
template-request email actually sent via Resend → success state shown in the UI ("Request sent —
you'll hear back at [email] soon."). The feature is functionally complete.

Three separate, real bugs stood between "deployed" and "actually works" — each only became
visible once the previous one was fixed and the request got one step further into the code path.
Full diagnostic chain is in `troubleshoot.md`; summary:

1. Cloud Run's Invoker IAM check silently blocked all requests (Domain Restricted Sharing org
   policy) — fixed via `gcloud run services update <fn> --no-invoker-iam-check`.
2. Default compute service account lacked the Firestore/Datastore role — fixed via IAM grant of
   **"Cloud Datastore User"**.
3. The `RESEND_API_KEY` secret's value was corrupted from a bad paste into PowerShell's masked
   input prompt — fixed by generating a fresh Resend key and setting it via `--data-file` instead
   of the interactive prompt, then redeploying.

**Process note for future secret-setting on this machine:** never use the interactive masked
`firebase functions:secrets:set <NAME>` prompt in PowerShell again — it gave no error and no
visual feedback while silently storing a corrupted value. Always write the value to a local
`.txt` file first (Notepad, normal paste), use `--data-file`, then delete the file immediately.
Full steps in `troubleshoot.md`.

**Still open, unrelated to this feature working:** the four items from the original Phase 2 audit
(JSON-LD on Home/Contact, `llms.txt`, FAQ/Terms & Conditions, dedicated tool-stack section) remain
unaddressed.

### Phase 2 audit follow-up — JSON-LD, 2026-09-17
- Added JSON-LD to Home and Contact (`ContactPage` with `mainEntity: Person`, sameAs pulled from
  the existing `SOCIALS` array, in `src/app/contact/page.tsx`). Closes the Home/Contact gap from
  the 2026-09-15 audit.
- Home's JSON-LD initially shipped as `ProfessionalService` with `areaServed: ["Nigeria", "EMEA"]`.
  Corrected after loading the `seo-geo` skill: `ProfessionalService` is deprecated (use `Service`),
  and `"EMEA"` is a region acronym, not a resolvable place — invalid as an `areaServed` value per
  schema.org. Fixed to `Service` type with the same real named-location list already used on
  Services (`src/app/services/page.tsx`'s `AREAS` array: Lagos, Ibadan, Port Harcourt, Kaduna,
  Abuja, Bauchi, Kano, Plateau, Jos, Owerri, Awka).
- Verified: `npx tsc --noEmit` clean.
- **New gap found via `seo-geo` skill's gate, not in the original 2026-09-15 audit: no
  `robots.txt` exists anywhere in `public/`.** Gate requires explicit listing of Googlebot,
  ClaudeBot, Claude-User, Claude-SearchBot, GPTBot, OAI-SearchBot, and ChatGPT-User — not just a
  wildcard `Allow: /`. Flagged to Anthony 2026-09-17, not yet actioned.
- **Open item, noted not fixed:** Portfolio and Walkthroughs still carry no JSON-LD. The
  2026-09-15 audit called this correct (both are honest placeholder pages). Recording it here as
  an explicit open item per Anthony's 2026-09-17 request — to be revisited once either page has
  real content, not before.
- Remaining open from the original four: `llms.txt`, FAQ/Terms & Conditions page, dedicated
  tool-stack section.

### Contact page thumbnail, 2026-09-17
- `src/app/contact/page.tsx`'s "Schedule 1-on-1" card now shows `public/images/contactme.webp` as
  a thumbnail on top, with the "Schedule 1-on-1" label and cal.com link at the bottom of it -
  whole card stays one clickable link to the cal.com booking page (`overflow-hidden` wrapper,
  image `h-48 w-full object-cover`, no change to the destination URL).
- Verified: `npx tsc --noEmit` clean, confirmed live (thumbnail + link render correctly, whole card
  clickable), no console errors.

## Open-build recommendation, logged 2026-09-17

Full audit of what's actually pending against this project's own phase plan, requested by Anthony.
Recorded here as the standing plan until superseded by a newer entry.

### Must happen before staging (Phase 7) — blocking
1. **Phase 6 — GTM/GA4 validation gate.** Code is wired (`src/lib/analytics.ts`: real container ID
   `GTM-MQV493DM`, measurement ID `G-GFK6117QNY`, `pushPageView()` setting `page_render_mode: "mpa"`,
   scroll-depth events at 25/50/75/90%), but this phase's own definition (a **blocking gate**, per
   the Phase Plan table) has never actually been run — no GTM Preview mode or GA4 DebugView check
   is logged anywhere in this file or `troubleshoot.md`. Not done until it's actually driven and
   confirmed, not just code-reviewed.
2. **Phase 5 — Build & preview, as its own dedicated pass.** `npm run build` has passed repeatedly
   as a side-effect of other work this session, but the phase itself (verify all 13 routes + mobile
   responsiveness on the real static output, not just a successful compile) has never been run as
   its own checkpoint.

### Should happen, doesn't block staging — parallel track
3. **BigQuery Export link** (GA4 property → BigQuery). No evidence anywhere in this project's
   history that this has been configured — it's a manual step in the GA4 Admin console (Admin →
   BigQuery Links), not a code change. Only actually needed for Phase 8 (re-baseline); doesn't
   block the site going live. Use the `bigquery-gold` skill once this is queried.
4. **Hero tagline image fix.** `/hero/anthonychilakahero1.webp`'s baked-in tagline ("15+ Years
   Experience | 2+ Years AI Automation | Nigeria & EMEA") is missing the USA, unlike every other
   areaServed reference fixed this session. Cannot be fixed via code — the tagline is part of the
   image asset itself, not live HTML (confirmed by reading `HeroCarousel.tsx` in full). Needs the
   source design file re-exported (Figma/Canva, wherever it was originally built) and the new
   `.webp` swapped in.
5. **Firebase production-workflow report.** Anthony's original 2026-09-17 session brief (item 5)
   asked for a report on how the production workflow will be handled for the Firebase setup done
   for the template-request email feature (OTP/App Check/Secrets). Never delivered as its own
   answer — still owed, informational only, doesn't block deploy.

### Deliberately deferred, not oversights — no action planned unless Anthony asks
- Hero's fixed-height (`calc(100svh - 76px)`) whitespace on tall viewports — real finding from the
  2026-09-17 spacing audit, higher-risk fix (touches the approved hero visual), deferred on
  Anthony's explicit call ("leave 4").
- Portfolio/Walkthroughs JSON-LD — correctly absent; both are honest placeholder pages per the
  `seo-geo` skill's Decision Tree. Revisit only once either page has real content.

## Phase 6 — GTM/GA4 validation gate, run 2026-09-17

Used the `gtm-datalayer` skill. Verified against a real `npm run build` static output served locally
(`npx serve out`), not dev mode, since dev mode showed a misleading artifact (see below).

| # | Check | Result |
|---|---|---|
| 1 | Canonical signal push timing | Done — no separate experiment/build-variant signal in this project; `page_render_mode_set` fires right after GTM container init |
| 2 | Canonical signal value | Done — `page_render_mode: "mpa"` correct and consistent |
| 3 | Re-declared per page | Done — confirmed via Home -> Services real navigation, `dataLayer` fully reset and `page_render_mode_set` re-fired exactly once on the new page |
| 4 | Naming consistency | Done — same event name/keys every time |
| 5 | `dataLayer` never overwritten | Done — grepped `src/`, only `window.dataLayer = window.dataLayer \|\| []` pattern found, no raw reassignment |
| 6 | Engagement events fire | Done — all 4 scroll-depth thresholds (25/50/75/90) fired in order once a real scroll event reached the listener |
| 7 | GTM Preview run | **Not done — needs Anthony's Google/GTM account access.** Confirmed events reach `dataLayer` correctly; did not confirm GTM's own tag configuration actually maps those triggers through to GA4 (Tag Assistant/Preview mode requires login this session doesn't have) |
| 8 | Custom dimension registration | Deferred — not needed unless GA4 Admin/Explore reporting on `scroll_depth_threshold` is planned |

**Real bug ruled out, not found:** `page_render_mode_set` appeared to fire twice in `npm run dev`.
Re-tested against the actual production build (`npm run build` + `serve out`) and it fires exactly
once — the dev-mode duplicate was React StrictMode's known dev-only double-invoke of effects, not
a real issue, confirmed by testing the real deploy artifact instead of dev mode.

**Verification note:** the custom `scroll_depth` event initially appeared not to fire after a
programmatic `window.scrollTo()` via the browser automation tool — this is a known automation-tool
quirk (`scrollTo()` doesn't always dispatch a native `scroll` event the way real user scrolling
does), not a site bug. Confirmed by manually dispatching a `scroll` event, which fired all 4
thresholds correctly and in order.

**Bottom line:** 6 of 8 checks fully verified and passing. #7 (actual GTM Preview mode, confirming
GA4 tags fire from these triggers) needs Anthony's GTM account access — this session can confirm
the code pushes the right data to `dataLayer`, but cannot confirm the container's own tag/trigger
configuration inside Google's own UI without login. #8 deferred, not currently needed.

## Phase 6 gate — closed 2026-09-17, confirmed via real GTM Preview mode

Anthony ran GTM Preview mode himself (his own Google account, incognito to rule out extension
interference after an initial "Could not connect" timeout in his normal profile). Connected to
`http://localhost:3000`. Screenshot evidence reviewed directly.

**Confirmed, real GA4 tags fired (not just dataLayer pushes — actual configured tags):**
- `GA4 - Anthony Chilaka Portfolio` (base GA4 config tag) — Fired 1 time
- `GA4 Event - scroll_depth` — Fired 1 time

**`page_render_mode_set` appeared twice in this session** — expected: Anthony connected to the dev
server (`localhost:3000`, React StrictMode enabled), matching the exact dev-mode double-invoke
already diagnosed and ruled out earlier the same day against the real production build (fires
exactly once there). Not a bug, no action taken.

**Bonus finding, not part of the original gate scope:** 5 additional GA4 event tags exist in the
container, configured directly in GTM (not app code) — `book_now_click`, `whatsapp_click`,
`linkedin_click`, `upwork_click`, `portfolio_click`. Showed "Not Fired" only because nothing was
clicked during this Preview session, not because of any misconfiguration. Not tested; optional
follow-up if click-tracking confidence is wanted before deploy, not required by Phase 6's own
stated scope (page_render_mode + scroll events only).

**Phase 6 (GTM/GA4 validation gate) is now fully closed — check #7 from the earlier internal audit
(GTM Preview run) confirmed complete.** All 7 of 8 gate checks now done; #8 (custom dimension
registration) remains correctly deferred, not currently needed.

## Phase 5 — Build & preview, run 2026-09-17

Full static export build against real production output (`npm run build` + `npx serve out`), not
dev mode, per the phase's own definition.

**All 13 routes verified:**

| Route | HTTP | Console errors (desktop) |
|---|---|---|
| `/` | 200 | none |
| `/about` | 200 | none |
| `/services` | 200 | none |
| `/ai-automation` | 200 | none |
| `/templates` | 200 | none |
| `/blog` | 200 | none |
| `/portfolio` | 200 | none |
| `/walkthroughs` | 200 | none |
| `/contact` | 200 | none |
| `/faq` | 200 | none |
| `/terms` | 200 | none |
| `/robots.txt` | 200 | n/a |
| `/sitemap.xml` | 200 | n/a |

**Mobile (375x812) spot-checked on Home, Services, About, Templates, Contact, FAQ:** all content,
the Tools I Use grid, the Templates subheading rewrite, and the Contact thumbnail all render
correctly with no overflow or layout breakage.

### CRITICAL FINDING — no mobile navigation exists at all
`src/components/SiteNav.tsx`'s entire `<nav>` (Home, About, Services, AI Automation, More dropdown)
is wrapped in `hidden ... md:flex` — it renders only at >=768px. There is no hamburger menu, no
mobile drawer, no alternative navigation anywhere in the component. Confirmed visually on
`/`, `/services` at 375px width: only the logo (now linking to GitHub, not Home) and the 4 social
icons are visible in the header. **A mobile visitor has no way to reach any other page via the
header nav at all.** This blocks every route except whichever one they land on directly (e.g. from
a search result or shared link) — they cannot get to Services, Contact, FAQ, etc. from Home.

**Severity: blocking.** This is core functionality, not cosmetic, and affects every single page on
the site for the entire mobile audience. Flagged to Anthony immediately, not silently deferred like
the earlier hero-whitespace/hero-tagline findings — those were degraded-but-functional; this is a
dead end.

### Secondary finding, same root cause as the hero-tagline gap already logged
Home hero's baked-in tagline text ("...FOUNDATION. ...EDGE. 15+ Years... Nigeria & EMEA") is visibly
cropped at 375px width (`bg-cover` on a fixed-aspect image, text runs off both edges: "DATA
ANALYTICS FOUNDATION" reads as "CS FOUNDATION", "AI AUTOMATION EDGE" reads as "ATION EDGE").
Same underlying cause as the tall-viewport whitespace issue and the missing-USA text issue already
logged — the tagline being baked into a `bg-cover` image, not live responsive HTML, is a real
liability now confirmed on two more axes (crop on narrow viewports, in addition to gap on tall
ones and inability to update copy). Not fixed here, consistent with earlier deferral, but raises
the priority of that deferred item.

**Phase 5 status: 11 of 13 routes and both meta-routes fully pass. The mobile nav gap is a genuine
blocker that should be fixed before this build is considered staging-ready.**

## Mobile navigation + hero height fix, 2026-09-17

Installed the `responsive-design` skill globally first (`C:\Users\Emeka Chilaka\.claude\skills\responsive-design`,
sourced from skills.sh's wshobson/agents — 18.8K installs, 39.7K GitHub stars, all 3 security
audits PASS), same pattern as the earlier global `design-system` install. Used its Pattern 4
(Responsive Navigation) and its named "Viewport Height: 100vh issues on mobile browsers" /
"Aspect Ratio: images squishing or stretching" common-issues list, which independently named both
problems already found in the Phase 5 mobile audit before this session even opened the skill.

**Phase A — mobile navigation drawer, done.**
- `src/components/SiteNav.tsx`: added a `Menu`/`X` toggle button (from the already-installed
  `lucide-react`, 44x44px touch target per the skill's stated minimum), visible only `md:hidden`.
  Opens a full-width dropdown panel listing all `PRIMARY_LINKS` + `MORE_LINKS` flattened (9 links
  total, no nested hover-submenu on mobile — avoids replicating the desktop "More" dropdown's
  hover-only fragility on a touch device).
  - Real accessibility wiring: `aria-expanded`, `aria-controls`, `aria-label` on the toggle button.
  - Closes automatically on link click (`onClick={() => setMobileOpen(false)}`) — verified this
    matters less than it sounds since every link is a real `<a href>` full-page reload anyway
    (confirmed no `next/link` usage anywhere, per the earlier GTM/GA4 gate audit), but still closes
    cleanly for the instant before navigation completes.
- Verified live at 375px: hamburger renders, tapping opens the drawer with all 9 links + socials,
  tapping "Services" navigates correctly to `/services` and the drawer closes. Verified at desktop
  width: hamburger correctly hidden, existing nav/More dropdown unaffected, no console errors.

**Phase D — hero height bound, done (partial fix).**
- `src/app/page.tsx`: hero container height changed from unbounded `calc(100svh - 76px)` to
  `clamp(480px, calc(100svh - 76px), 760px)` — keeps the skill's recommended dynamic viewport unit
  (`svh`, already correct) but caps it so very tall desktop viewports can no longer stretch the
  container indefinitely, which was the actual cause of the dead-whitespace finding from the
  earlier spacing audit.
- **Not fixed by this change, still open:** the hero's baked-in tagline text itself (missing USA,
  crops on narrow viewports) — that's a separate, deeper issue (text baked into the `.webp` image,
  not live HTML) requiring a source-image re-export, per the two earlier logged findings. The
  height clamp only fixes the *container's* over-stretch, not the *image's* own limitations.

**Verified: `npx tsc --noEmit` clean, `npm run build` succeeds (all 13 routes), confirmed live
against the real static output (not dev mode) at both 375px and desktop width, no console errors.**

**Still open from the original mobile-responsive plan (not done this pass):**
- Phase B: fix the desktop "More" dropdown's hover-only trigger (no click-to-toggle reliability
  confirmed on touch-hybrid devices)
- Phase C: verify `TemplatesInteractive.tsx`'s hover-reveal overlay works correctly via tap on a
  real touch device, not just visually in emulation
- Hero tagline image re-export (needs Anthony's design source, cannot be done via code)

## Mobile build completion — Phase B + C, 2026-09-17

**Phase B — desktop "More" dropdown touch/click fragility, fixed.**
- `src/components/SiteNav.tsx`: replaced `onMouseLeave={() => setMoreOpen(false)}` with a proper
  outside-click/outside-touch listener (`mousedown` + `touchstart` on `document`, via `useEffect` +
  `useRef`), closing the panel only when a real interaction happens outside it, not on ordinary
  mouse movement away from the trigger.
- **Bug found and fixed during verification, not present in the original plan:** the button's
  `onClick` was `setMoreOpen((v) => !v)` (toggle) while the wrapper's `onMouseEnter` set it `true`
  — a real hover-then-click sequence (hover opens it, then a click immediately toggles it back
  closed) silently broke the dropdown. Confirmed via live click test: dropdown links weren't in the
  DOM after a click despite a successful open+close cycle. Fixed by changing the click handler to
  `setMoreOpen(true)` (idempotent open) and relying entirely on the new outside-click listener to
  close — removes the race between hover and click.
- Verified live: click opens the dropdown (all 5 `MORE_LINKS` present), clicking a link (Data
  Challenge Walkthrough) navigates to `/walkthroughs` correctly, no console errors.

**Phase C — Templates hover-reveal hint, fixed for touch discoverability.**
- Confirmed first that the underlying click action was never actually broken on touch (the
  `onClick` is bound directly to the `<button>`, not gated behind the hover-reveal overlay) — the
  real gap was the "Click to email" visual hint only appearing via `group-hover`, which never
  fires on a touch device, so mobile visitors had no cue the thumbnail was tappable.
- `src/components/TemplatesInteractive.tsx`: overlay changed from `opacity-0 ... group-hover:opacity-100`
  (hover-only, all breakpoints) to always-visible below `md` (`opacity-100 bg-black/35`) and
  hover-only-reveal unchanged at `md` and above (`md:opacity-0 md:group-hover:opacity-100`).
- Verified live at 375px: "Click to email" hint visible by default on all 6 template cards, no tap
  required to discover it; desktop hover-reveal behavior unchanged.

**Full verification after both fixes:** `npx tsc --noEmit` clean, `npm run build` succeeds (13
routes), confirmed live against the real static output at desktop and mobile widths, no console
errors.

**Mobile-responsive build (Phases A-D) is now fully complete.** Only the hero tagline image
re-export remains open, and that's explicitly a design-asset task outside code, not a build phase.

## Hero image refresh + Contact thumbnail swap, 2026-09-17

Anthony supplied 9 new images, dropped in `public/images/`. Moved to proper folders and wired in.

**Path decisions (Anthony asked me to decide and report back):**
- `v2hero1-4.webp` -> `public/hero/` (matches the existing desktop hero convention)
- `mobilehero1-4.webp` -> new folder `public/hero/mobile/` (new asset class, grouped with hero
  but clearly separated)
- `v2contactme.webp` -> stayed in `public/images/` (same folder the existing `contactme.webp`
  already lived in)
- Confirmed all dimensions exactly match the earlier recommendation: v2hero*/v2contactme at
  3840x1520, mobilehero* at 900x1600 (verified via PIL, not assumed).

**`src/components/HeroCarousel.tsx` rebuilt** to serve two independent image sets from one shared
`active` index (both have exactly 4 slides, so no need for two intervals):
- Desktop/tablet (`hidden md:block`): `v2hero1-4.webp`, with the label chip, in Anthony's confirmed
  order: PERSONAL BRAND -> END TO END ANALYTICS -> AI AUTOMATION -> WEB DESIGN. "END TO END
  ANALYTICS" is a new tag, not previously in the 3-tag set.
- Mobile (`md:hidden`): `mobilehero1-4.webp`, no label chip at all, per Anthony's explicit "No tag
  for mobile" instruction. Progress dots kept shared across both breakpoints (not asked to remove).
- The old 3-image set (`anthonychilakahero1.webp`, `hero2.webp`, `hero3.webp` in `public/hero/`)
  is now unused but not deleted — left in place, not requested to remove.

**Bonus: the hero-tagline-missing-USA issue (flagged repeatedly this session, previously
unfixable via code) is now resolved by this asset swap** — the new `v2hero1.webp`'s baked-in text
already reads "Nigeria - EMEA - USA", confirmed live. No further action needed on that finding.

**Contact page:** `src/app/contact/page.tsx`'s thumbnail source changed from `contactme.webp` to
`v2contactme.webp`.

**Verified:** `npx tsc --noEmit` clean, `npm run build` succeeds (13 routes), confirmed live
against the real static output at both desktop and mobile width — desktop carousel cycles through
all 4 v2hero images with correct matching labels, mobile shows mobilehero images full-bleed with
no label chip and no crop, Contact thumbnail renders correctly. No console errors.

## Phase 5 — fresh re-verification pass, 2026-09-17 (post mobile-build + hero-refresh)

Full re-run after all mobile nav, dropdown, touch-hint, and hero-image changes landed, since the
prior pass predates several of them.

- `npm run build`: all 13 routes build clean.
- All 13 routes (11 content + robots.txt + sitemap.xml) confirmed HTTP 200.
- All 11 content routes checked individually for console errors: none found, correct page titles
  on every route.
- Mobile drawer re-confirmed at 375px: opens, all 9 links present, correct hrefs.
- Desktop "More" dropdown re-confirmed: single click opens it reliably, all 5 links present — the
  earlier hover/toggle race-condition fix holds.

**Full site re-verified clean end to end. No regressions from any of today's changes.**

## Phase 7 — Deploy (staged), complete 2026-09-17

Deployed `out/` to a Firebase Hosting preview channel (Anthony confirmed go-ahead after the full
Phase 5 re-verification pass).

**Live preview URL: https://anthonychilaka-web--staging-vhaqufaz.web.app** (expires 2026-10-17,
30-day auto-cleanup channel).

- `firebase hosting:channel:deploy staging --expires 30d` — 157 files uploaded, deploy complete.
- **Warning surfaced during deploy, flagged not hidden:** "Unable to add channel domain to
  Firebase Auth" / "Unable to sync Firebase Auth state." The static site itself is unaffected (all
  pages, nav, images serve correctly regardless), but the template-request OTP email feature
  specifically uses reCAPTCHA Enterprise App Check, which is domain-scoped — this preview channel's
  domain may not be authorized for App Check, meaning that one feature could be blocked on this
  URL even though it works on the eventual production domain. Not yet tested on this preview URL;
  flagged for Anthony to check before relying on it for that feature specifically.
- Verified live: confirmed via direct HTTP check (`/` and `/about` both 200) and via the browser —
  Home renders correctly with the new v2hero1 carousel image and label, no console errors, mobile
  hamburger menu present and functional on the real deployed domain (not just localhost).

**Still open, unchanged by this deploy:**
- Item 5 (Firebase production-workflow report) — still owed
- BigQuery Export link — still not configured, only needed for Phase 8
- Old unused hero images (`anthonychilakahero1.webp`, `hero2.webp`, `hero3.webp`) — still present,
  not deleted
- Promotion to production — this is a preview channel, not live at the real domain yet; that's a
  separate, explicit step Anthony needs to approve

## Hero carousel loading-performance fix, 2026-09-17

Anthony reported the site was slow to load. Root cause confirmed: `HeroCarousel.tsx` rendered all
4 slides for BOTH breakpoints simultaneously on every page load, using CSS `background-image` on
plain `<div>`s, which has no lazy-loading mechanism at all (`loading`/`fetchpriority`/`srcset` only
apply to real `<img>` elements, per the `responsive-design` skill's Pattern 5). Real file sizes
confirmed: desktop set 1.7MB across 4 files, mobile set 1.2MB across 4 files (old 3-image set was
~180KB total) — roughly 10-15x heavier, all loading eagerly regardless of which slide was showing.

**Fix implemented (loading strategy only — confirmed with Anthony beforehand that no image files
would be resized/recompressed, none were):**
- Converted from CSS `background-image` divs to real `<img>` elements, unlocking native
  `loading="eager"`/`loading="lazy"` and `fetchPriority`.
- Added JS-detected breakpoint gating (`matchMedia('(min-width: 768px)')`, re-evaluated on resize)
  so only the relevant breakpoint's image set ever mounts/fetches — the other set's 4 files are
  never requested at all, not just CSS-hidden.
- Slides now load just-in-time: only the active slide loads on first paint, and the *next* slide is
  quietly preloaded during the current slide's full 5.5s dwell window (via a `loaded` Set state),
  so by the time the carousel advances the next image is already cached. Reduces initial hero
  payload from ~1.2-1.7MB (all 4 slides) to a single slide's file size.
- `src/components/HeroCarousel.tsx` fully rewritten; visual behavior (Ken Burns animation, opacity
  crossfade, label chip on desktop only, shared progress dots) preserved exactly as before.

**Verified:** `npx tsc --noEmit` clean, `npm run build` succeeds (13 routes), confirmed via direct
network-request inspection against the real static output at both desktop and mobile width — only
1-2 images fetch on initial load (not all 4), the wrong breakpoint's image set is never requested,
repeat/cached slides correctly return 304 Not Modified rather than re-downloading. No console
errors. Not yet re-deployed to the staging preview channel — this fix exists locally/in the repo
only until the next deploy.

## Staging redeploy + cache-artifact investigation, 2026-09-17

Redeployed the hero loading-performance fix to the `staging` channel (same URL as before, channel
updated in place): `firebase hosting:channel:deploy staging --expires 30d` — 157 files, deploy
complete, same known non-fatal Firebase Auth channel-domain warning as the first deploy (unrelated
to the static site itself).

**False alarm investigated and resolved, no code changes needed.** Checking the redeployed site
initially appeared to show the OLD behavior (all 8 hero images loading eagerly, both breakpoints'
image sets, via `background-image` divs) — looked like the fix hadn't actually shipped. Traced to
root cause before touching any code, per Anthony's "report findings first" instruction:

1. Compared local `out/_next/static/chunks/` filenames against the live site's referenced chunks —
   identical hashes. Confirmed the deployed HTML is pointing at the current build's files, not a
   stale document.
2. Grepped the local build's chunk content directly (not just filenames) for strings unique to the
   new code (`matchMedia`, `fetchPriority`) — found in `2-4rzcfmhrwpo.js`. Confirmed the fix was
   genuinely compiled into the local `out/` output.
3. `curl`'d that exact chunk URL on the live staging site directly (bypasses any browser cache) —
   it already contained `matchMedia`/`fetchPriority`. **Confirmed the server was serving the
   correct, updated file from the moment the redeploy completed.**
4. Checked the chunk's response headers: `Cache-Control: max-age=3600`. The browser tab used for
   testing had already visited the staging URL before this redeploy (during earlier same-session
   testing) and had legitimately cached that same-URL chunk under normal HTTP caching rules — this
   is what caused the confusing "old behavior" observation, not a real deployment or code problem.
5. Reloaded the tab; DOM check afterward showed `4` real `<img>` tags and `0` `background-image`
   divs for hero images — confirming the new code was running correctly all along, the deployed
   fix was correct, and this was purely a browser-cache artifact from repeated testing in the same
   tab.

**Practical note for future checks:** any browser that visited the staging URL before a given
redeploy may need one hard refresh (or a fresh tab/incognito) to see that redeploy's changes,
since Firebase Hosting serves `_next/static/` chunks with a 1-hour cache lifetime. A genuinely
first-time visitor is unaffected and gets the current build immediately.

**Confirmed final state: the hero loading-performance fix is live and correct on staging**
(https://anthonychilaka-web--staging-vhaqufaz.web.app), verified via direct chunk-content
inspection and DOM inspection after cache invalidation, not just assumed from a passing deploy log.

## Template-request feature "Unauthenticated" on staging — root cause confirmed, not fixed by design

Anthony reported "Unauthenticated" when testing the template-request form on the staging preview
channel. Investigated and confirmed root cause before touching anything:

- Reproduced live: submitted a test email on `/templates`, got "Unauthenticated" displayed via
  `extractErrorMessage()` in `TemplateRequestForm.tsx`.
- **Confirmed via the network log: zero requests to `requestOtp` were ever sent.** The failure
  happens entirely client-side, before the Firebase Functions SDK makes any network call.
- Traced to `src/lib/firebaseClient.ts`: `initializeAppCheck` uses `ReCaptchaEnterpriseProvider`,
  which is domain-restricted at the Google Cloud reCAPTCHA Enterprise key level. The auto-generated
  staging channel domain (`anthonychilaka-web--staging-vhaqufaz.web.app`) is not in that key's
  authorized domain list — only the real production domain (and possibly the base
  `anthonychilaka-web.web.app`) is registered there. App Check's token step rejects the unauthorized
  domain before the request ever reaches the network.
- **This exact risk was flagged proactively right after the first staging deploy** (the
  "Unable to add channel domain to Firebase Auth" warning Firebase itself printed during deploy) —
  confirmed now, not a new or surprise finding.
- **Not a regression, not a bug in anything built this session.** The feature is already confirmed
  working end-to-end on production (see "Live end-to-end test — WORKING, confirmed 2026-09-17"
  entry above: real OTP requested, verified, email delivered via Resend).

**Decision, per Anthony:** do not authorize the staging domain in reCAPTCHA Enterprise. Leave
staging as-is — every other part of the site works correctly there. The template-request feature
will be re-verified once promoted to the real production domain, where App Check is already
correctly authorized and the feature has already been proven to work.

## Phase 7 — Promoted to production, 2026-09-17

Anthony reviewed staging and confirmed go-ahead. Deployed `out/` to the live hosting channel:
`firebase deploy --only hosting` — 157 files, deploy complete.

- **Live URLs confirmed:** `https://anthonychilaka-web.web.app` (Firebase default) and
  `https://anthonychilaka.com` (custom domain, confirmed connected via DNS resolving to Firebase's
  edge IP `199.36.158.100`) — both return 200 on `/`, `/about`, `/faq`.
- **Verified this is genuinely today's build, not stale:** the live custom domain's HTML contains
  "anthonychukwuemekachilaka" (today's cal.com link fix), and its referenced JS chunk filenames
  match the local `out/` build exactly, same verification method used to confirm the staging
  deploy earlier this session.
- The hero image strings ("v2hero1", "END TO END ANALYTICS") don't appear in the raw HTML — this
  is expected, not a staleness sign: `HeroCarousel` renders a neutral placeholder during SSR and
  only injects the actual slide client-side once breakpoint detection runs.

**Site is now live in production, both at the Firebase default URL and the real custom domain.**

**Known, accepted gap carried into production:** the template-request OTP feature was never
re-verified on staging (reCAPTCHA Enterprise domain restriction, Anthony's explicit call to skip
authorizing that one-off staging URL rather than fix it). It's already confirmed working
end-to-end on production from the 2026-09-17 live test logged earlier — worth a final smoke test
on the actual production domain now that this deploy has gone out, to confirm nothing in today's
changes (mobile nav, hero swap, Contact thumbnail, dropdown fix) broke that flow.

**Still open, unaffected by this deploy:**
- Phase 8 — re-baseline (24h+ post-promotion)
- Item 5 — Firebase production-workflow report, still owed
- BigQuery Export link — not configured
- Old unused hero images (`anthonychilakahero1.webp`, `hero2.webp`, `hero3.webp`) — still present in
  `public/hero/`, now shipped to production unused, safe to delete

## Favicon changed to logo.webp, 2026-09-17

- `src/app/layout.tsx`: added `icons: { icon, shortcut, apple }` all pointing to
  `/images/logo.webp` in the root metadata.
- **Found and fixed a conflict:** Next.js's default scaffold `src/app/favicon.ico` (stock Next.js
  icon, never replaced) was still present and auto-detected, producing a second competing
  `rel="icon"` tag alongside the new one — deleted it so `logo.webp` is the single, unambiguous
  favicon source.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, inspected `out/index.html` directly
  and confirmed exactly one `rel="icon"`, one `rel="shortcut icon"`, one `rel="apple-touch-icon"`,
  all pointing to `/images/logo.webp`, no leftover `favicon.ico` reference. Confirmed live via
  local static server, no console errors. Not yet redeployed to staging/production — exists only
  in the local build until the next deploy.

## Favicon changed to aboutme.webp (square-cropped), 2026-09-17

Anthony asked to switch the favicon from `logo.webp` to `aboutme.webp`, then reported it looked
stretched.

- Checked `aboutme.webp`'s actual dimensions: 1366x768 (widescreen), not square — confirmed this
  as the cause. Browsers squash non-square favicon sources into the square tab-icon slot rather
  than cropping them, producing the stretched look Anthony saw.
- Viewed the source image directly to confirm subject placement before cropping (face centered
  horizontally in the frame, on white background) — a plain center-crop was safe.
- Created `public/images/aboutme-favicon.webp`, a 768x768 center crop (full height, horizontally
  centered), not overwriting the original `aboutme.webp` (kept intact in case it's used elsewhere
  at its native aspect ratio later). Viewed the crop directly before wiring it in — face fully
  intact, nothing cut off.
- `src/app/layout.tsx` icons updated to point at `/images/aboutme-favicon.webp`.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, inspected `out/index.html` directly
  — single clean set of icon/shortcut-icon/apple-touch-icon tags, all pointing to the new
  square-cropped file. Anthony confirmed it displays correctly, not stretched.
- Not yet redeployed to staging/production — local build only until next deploy.

## Favicon fix deployed to staging, 2026-09-17

`firebase hosting:channel:deploy staging --expires 30d` — 156 files, deploy complete. Verified via
direct `curl` (bypasses browser cache): live staging HTML shows the single correct
`aboutme-favicon.webp` icon set, and `/images/aboutme-favicon.webp` returns 200.

**https://anthonychilaka-web--staging-vhaqufaz.web.app** — favicon fix confirmed live. Not yet
promoted to production.

## Favicon fix promoted to production, 2026-09-17

Anthony confirmed correct on staging. `firebase deploy --only hosting` — 156 files, deploy
complete. Verified via direct `curl` on both production URLs: correct `aboutme-favicon.webp` icon
tags present, image returns 200 on both `anthonychilaka.com` and `anthonychilaka-web.web.app`.

**Favicon fix is now live in production.**

## Template-request OTP feature — re-verified on production after today's changes, 2026-09-17

Anthony manually smoke-tested the template-request OTP feature on the live production domain
after all of today's changes (mobile nav, hero image swap, dropdown fix, hero loading-performance
fix, favicon change) went out. **Confirmed working.** No regression from anything shipped today —
the earlier staging-only "Unauthenticated" finding was correctly isolated to that preview channel's
reCAPTCHA Enterprise domain restriction, not a real bug in the feature itself, as already logged.

## Deleted old unused hero images, 2026-09-17

Removed `anthonychilakahero1.webp`, `hero2.webp`, `hero3.webp` from `public/hero/` — dead weight
since the `v2hero1-4.webp` / `mobilehero1-4.webp` swap earlier today, no code references remained
(confirmed via grep). `npx tsc --noEmit` clean, `npm run build` succeeds. Not yet redeployed.
