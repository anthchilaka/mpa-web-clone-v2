# Website SPA→MPA Migration | Next.js | Web Analytics & GEO

## Executive Summary

Production rebuild of `anthonychilaka.com`, replacing a single-page React app with a true
multi-page Next.js static export. The SPA's hash-anchor navigation (`/#about`, `/#services`)
left content invisible to crawlers until JavaScript executed. A structural SEO/GEO ceiling no
amount of client-side routing could fix. This rebuild gives every route its own real HTML
document, its own crawlable `<h1>` + JSON-LD, its own GTM/GA4 tracking, and a working
template-request email flow with two-factor verification.

**Status: live in production at anthonychilaka.com.** All 11 routes are built, deployed, and
verified server-side. The template-request email feature (Firebase Functions, Firestore-backed
OTP, App Check, Resend delivery) is confirmed working end to end in production. SEO/GEO closeout
is complete: JSON-LD on every real content page, robots.txt with explicit AI-crawler allow
rules, sitemap.xml, llms.txt.

## Business Problem

The SPA's content only existed after JS ran client-side. A router alone fixes bookmarking and
the back button. It doesn't fix crawlability. That gap blocked SEO and AI-search (GEO)
visibility on a portfolio site whose entire purpose is being found by hiring managers and
clients. The rebuild also had to preserve every existing GTM/GA4 signal (scroll depth, session
engagement) so the SPA baseline stays comparable against the new MPA data, and had to add a way
for visitors to request a template without exposing a spam vector or a way to abuse the send
path with no login gate available.

## Methodology

Static-export Next.js (`output: 'export'`) with one real route per page, deployed to Firebase
Hosting with `cleanUrls: true` and no catch-all rewrite. The opposite of the SPA's rewrite
config, which is what broke direct-URL crawling in the first place. A three-layer design token
system (primitive → semantic → component) drives all styling, no hardcoded color or spacing to
drift from the brand. Analytics parity is a blocking gate: GTM/GA4 events carry a
`page_render_mode` field so the SPA and MPA data can be segmented and compared in the same
BigQuery table, validated through GTM Preview mode against real fired tags before promotion, not
just confirmed at the code level.

The email feature runs a two-step verification flow behind Google App Check (reCAPTCHA
Enterprise): a visitor requests a one-time code, confirms they own that email, only then does
the real request go out. Codes are SHA-256 hashed before they touch the database, expire in 10
minutes, and lock out after 5 attempts.

## Skills Demonstrated

- **Next.js / React / TypeScript** — App Router static export, per-route metadata + JSON-LD,
  strict typing throughout
- **Tailwind CSS v4** — three-layer design token architecture, no hardcoded hex/spacing
- **Web Analytics** — GTM container + GA4 property wiring, custom `dataLayer` events
  (`page_render_mode`, scroll-depth thresholds at 25/50/75/90%), validated live via GTM Preview
  mode against real fired tags
- **SEO / GEO** — crawlable semantic HTML, `schema.org` JSON-LD per route (`Person`, `Service`,
  `FAQPage`, `ContactPage`, `BlogPosting`), robots.txt with explicit rules for Google, GPT, and
  Claude crawlers, real per-page titles/descriptions
- **Mobile-first responsive engineering** — breakpoint-gated asset loading (the wrong device's
  images never download), touch-vs-hover interaction fixes, a real mobile navigation build
- **Performance** — cut hero image payload from four eager-loaded slides to one active slide
  plus a just-in-time preload of the next
- **Security** — Firebase App Check (reCAPTCHA Enterprise), hashed OTP storage with TTL, secrets
  isolated to server-side Firebase config, never committed (see `SECURITY.md`)
- **AI-assisted content verification** — the Terms & Conditions page went through an independent
  cross-vendor audit (GPT and Gemini, not just a same-model self-check) before shipping, catching
  a real inconsistency a single-model review missed
- **Git/GitHub** — staged, reviewed history; no secrets committed

## Results & Business Recommendations

Live and measurable now. The crawlability fix (real HTML per route, JSON-LD, robots.txt,
sitemap.xml) is shipped and verified in production. The actual before/after SPA-vs-MPA
comparison in GTM/GA4 needs 24+ hours of live traffic to mean anything, and that window hasn't
closed yet. Recommendation stands as originally scoped: measure real crawl/index behavior
against the SPA baseline once that window passes, not before.

## Next Steps

1. 24h+ re-baseline against the existing SPA data, segmented by `page_render_mode`
2. Connect GA4 BigQuery Export (not yet configured, needed for the deeper comparison above)
3. Decide whether the template-request feature's build write-up goes on `/portfolio` as a real
   case study (drafted, not yet published)

See `build.md` for the full phase-by-phase build log and `troubleshoot.md` for bugs found and
fixed during the build.
