# Return prompt: MPA-web-clone-v2

Refresh rule: after each finished step and before stopping, (a) copy the old Start-here entry into Context, replacing the old Context; (b) write a new Start-here; (c) tick finished open items and move them to the project log at the next refresh; (d) update the dates. Do not wait for session close.

## Start here - 2026-10-10
Tool: Claude Code (desktop), GTM (GTM-MQV493DM) and GA4 (G-GFK6117QNY). Domain: production site anthonychilaka.com, Next.js static-export MPA on Firebase Hosting.
Task: exclude Anthony's own visits from GA4 using the Option 2 browser flag. Step 1 only: add an inline script to the head of `layout.tsx`, before the GTM snippet (same place as the `page_render_mode` push). If the URL has `?internal=1`, save a flag in localStorage; `?internal=0` removes it. On every load, if the flag exists, push `{ traffic_type: "internal" }` to `dataLayer`. Then typecheck and build, and stop.
Folders: `D:\AI Tools\Claude Code\Outputs\MPA-web-clone-v2\`.
Skills: gtm-datalayer, website-build.
Done when: typecheck and build pass, and the script is in the built HTML head ahead of the GTM snippet.
Out of scope: GTM changes, GA4 filter, deploy. These are Anthony's manual steps below.
Stop rule: one step, then report and wait for confirmation.

## Context - 2026-10-10
Anthony asked how to exclude internal visits from GA4. IP-based exclusion (Option 1) was rejected: Starlink uses CGNAT, so the IP is not stable. Chose Option 2, the browser flag. Confirmed against Google's Analytics Help article (support.google.com/analytics/answer/10104470): `traffic_type` can be added manually to events, the value is user-defined (default `internal`), and the Internal Traffic data filter (Exclude) removes events matching that value. Filters can take 24 to 36 hours to apply, are not retroactive, and Active drops data permanently, so Testing first. No site files edited yet.

## Open items
- [ ] GA4 internal traffic exclusion (Option 2)
  - [ ] Claude: add localStorage flag and `traffic_type` dataLayer push to `layout.tsx` head, typecheck, build
  - [ ] Anthony: deploy the site
  - [ ] Anthony: in GTM, create a Data Layer Variable for `traffic_type`; add parameter `traffic_type` to the GA4 Google tag; test in Preview; publish
  - [ ] Anthony: in GA4 Admin, Data settings, Data filters, create Internal Traffic filter, Exclude, traffic_type value `internal`, state Testing
  - [ ] Anthony: visit `anthonychilaka.com/?internal=1` once on each browser and device (phone included)
  - [ ] Anthony: confirm flagged visits show in Explore under "Test data filter name"
  - [ ] Anthony: switch the filter to Active
