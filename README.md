# Website SPA→MPA Migration | Next.js | Web Analytics & GEO

## Executive Summary

Production rebuild of `anthonychilaka.com`, replacing a single-page React app with a true
multi-page Next.js static export. The SPA's hash-anchor navigation (`/#about`, `/#services`)
left content invisible to crawlers until JavaScript executed — a structural SEO/GEO ceiling no
amount of client-side routing could fix. This rebuild gives every route its own real HTML
document, its own crawlable `<h1>` + JSON-LD, and its own GTM/GA4 tracking, so the before/after
impact of the migration can be measured, not just assumed.

**Status: not yet deployed.** All 9 routes are built and the analytics port is complete; this
is currently backing up local build state ahead of one more feature (a template-request email
flow) before staged deployment to a Firebase Hosting preview channel.

## Business Problem

The SPA's content only existed after JS ran client-side. A router alone fixes bookmarking and
the back button — it does not fix crawlability. That gap blocks SEO and AI-search (GEO)
visibility on a portfolio site whose entire purpose is being found by hiring managers and
clients. The rebuild also had to preserve every existing GTM/GA4 signal (scroll depth, session
engagement) so the SPA baseline stays comparable against the new MPA data.

## Methodology

Static-export Next.js (`output: 'export'`) with one real route per page, deployed to Firebase
Hosting with `cleanUrls: true` and no catch-all rewrite (the opposite of the SPA's rewrite
config, which is what broke direct-URL crawling in the first place). A three-layer design token
system (primitive → semantic → component) drives all styling, so there is no hardcoded color/
spacing to drift from the brand. Analytics parity is a blocking gate: GTM/GA4 events carry a `page_render_mode` field so the SPA
and MPA data can be segmented and compared in the same BigQuery table.

## Skills Demonstrated

- **Next.js / React / TypeScript** — App Router static export, per-route metadata + JSON-LD,
  strict typing throughout
- **Tailwind CSS v4** — three-layer design token architecture, no hardcoded hex/spacing
- **Web Analytics** — GTM container + GA4 property wiring, custom `dataLayer` events
  (`page_render_mode`, scroll-depth thresholds at 25/50/75/90%)
- **SEO / GEO** — crawlable semantic HTML, `schema.org` JSON-LD per route (`Person`, `Service`,
  `ItemList`, `BlogPosting`), real per-page titles/descriptions
- **Git/GitHub** — staged, reviewed history; no secrets committed (see `SECURITY.md`)

## Results & Business Recommendations

Not applicable yet — nothing is deployed to production, so there is no before/after data to
report. The SPA baseline this rebuild will be measured against is documented in the SPA vs MPA
migration blueprint referenced in `build.md`.

## Next Steps

1. Build the template-request email feature (Firebase Functions + Resend OTP flow — see
   `ARCHITECTURE.md`)
2. Close remaining SEO/GEO gaps: JSON-LD on Home/Contact, `llms.txt`
3. Deploy to a Firebase Hosting preview channel; run the GTM/GA4 validation gate
4. Promote to production only after the preview channel passes validation
5. Re-baseline against the existing SPA data 24h+ after promotion, segmented by
  `page_render_mode`

See `build.md` for the full phase-by-phase build log and `troubleshoot.md` for bugs found and
fixed during the build.
