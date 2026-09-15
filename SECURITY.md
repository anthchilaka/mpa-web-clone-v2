# Security

## Current state

The site is a static export with no server-side code, no database, and no user input handling
of any kind. There is nothing running that collects or stores data today.

## Secrets

No API keys, tokens, or credentials are committed to this repository. Environment files
(`.env*`) are excluded via `.gitignore`. When the planned email flow (see `ARCHITECTURE.md`) is
built, any API keys it needs will live only in the hosting platform's own encrypted
configuration store — never committed to this repo, and never hardcoded in source. Only
`.env.example`-style placeholders, if any, will be committed.

## Data handling

**Today:** none. The site collects no personal data — no forms, no cookies beyond what the
analytics tag manager sets.

**Once the template-request email flow is built:** the only personal data collected will be a
visitor's email address, entered voluntarily to receive a requested template price list. It is
used solely to (a) deliver a one-time verification code and (b) set as the reply-to address on
the resulting request email — it is not stored beyond the short-lived verification window, and
is not added to any mailing list without separate, explicit opt-in.

## Reporting a Vulnerability

If you find a security issue in this repository or the deployed site, please report it directly
rather than opening a public issue: contact via the details on `anthonychilaka.com/contact`.
