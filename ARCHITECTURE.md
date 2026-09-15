# Architecture

## Build status

| Component | Status |
|---|---|
| Static site (routes, content, SEO/GEO) | Built and verified locally, not deployed |
| GTM/GA4 analytics | Built and verified locally (dataLayer inspection), not validated against live traffic |
| Template-request email flow (OTP + send) | **Planned, not built.** Described below as the intended design — no code exists for this yet |

## Current system — static site

```mermaid
flowchart LR
    Visitor -->|HTTPS| Hosting[Static hosting]
    Hosting -->|serves pre-rendered HTML| Visitor
    Visitor -->|dataLayer.push| GTM[Tag manager container]
    GTM -->|forwards events| Analytics[Analytics property]
```

The site is a static export — every route is pre-rendered HTML at build time, served directly
by the hosting layer with no server-side rendering and no API calls on the critical path. The
tag-manager script loads client-side and reads `dataLayer` events pushed by the page (page-view
render-mode signal, scroll-depth thresholds) and forwards them to the analytics property.

## Planned system — template-request email flow

**Not yet built.** Documented here for review before implementation starts.

```mermaid
flowchart LR
    Visitor -->|1: clicks template CTA| Form[Shared request form]
    Form -->|2: submits email| OTPFn[OTP request function]
    OTPFn -->|3: stores hashed code, short TTL| Store[(Verification store)]
    OTPFn -->|4: sends code| EmailAPI[Transactional email API]
    EmailAPI -->|5: delivers code| Visitor
    Visitor -->|6: enters code| VerifyFn[Verify + send function]
    VerifyFn -->|7: checks code| Store
    VerifyFn -->|8: on match, sends request| EmailAPI
    EmailAPI -->|9: delivers to| Inbox[Business inbox]
```

- **Form** — one shared request form (not per-card), carries the selected template's name as
  submitted state.
- **OTP request function** — serverless function, generates a short-lived one-time code, stores
  it hashed (never in plaintext) with a short expiry, triggers delivery.
- **Verification store** — holds only the hashed code and its expiry against the submitted
  email; nothing else persisted at this stage.
- **Verify + send function** — a second serverless function checks the submitted code against
  the store; only on a match does it send the actual template-request email, with the visitor's
  address set as reply-to.
- **Transactional email API** — third-party provider, not self-hosted.

No real hostnames, endpoints, or credentials are recorded in this repo. See `SECURITY.md` for
how secrets are actually handled once this is built.
