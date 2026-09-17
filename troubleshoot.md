# Troubleshooting — MPA-web-clone-v2

Bugs found during this build and how they were actually fixed. Newest first.
Full narrative context for any entry is in `D:\AI Tools\Claude Code\Outputs\sessions\log.txt`.

---

## Live template-request test failed end-to-end across 3 separate bugs — RESOLVED

**Status: resolved 2026-09-17. Full flow confirmed working — real OTP requested, verified, and
the template-request email sent successfully ("Request sent — you'll hear back at
anthonychilaka@gmail.com soon." shown live).**

Three genuinely separate bugs stacked on top of each other, each only visible once the previous
one was fixed and the request got one step further. Summary of the full chain, newest fix last:

**Symptom:** After Functions deployed and App Check/env vars were wired up, submitting the real
form (`requestOtp`) still failed with a generic "internal" error client-side.

**Investigation, in order:**

1. Added `logger.error` around both Resend `.send()` failure paths (previously silent — the code
   threw a generic `HttpsError("internal", ...)` without logging the real cause anywhere).
   Redeployed. Re-tested. Still failed, but now `firebase functions:log` showed the *real* first
   cause, unrelated to Resend entirely:
   ```
   The request was not authenticated. Either allow unauthenticated invocations or set the
   proper Authorization header. Empty Authorization header value.
   ```
   This meant requests were being rejected at the Cloud Run/IAM layer, before ever reaching our
   function code.

2. **Cause confirmed via Google's own docs:** this GCP org has **Domain Restricted Sharing**
   active (common default on a real Cloud Identity/Workspace-backed org), which silently blocks
   the `allUsers` → Cloud Run Invoker IAM grant that Firebase normally makes automatically on
   deploy. Manually trying "Allow public access" in the Cloud Run console's Security tab also
   silently reverted on refresh — confirming the org policy was blocking it, not a UI bug.

3. **Fix (applied, working):** installed `gcloud` CLI (wasn't present locally — `firebase-tools`
   alone doesn't include it), then used the documented DRS workaround — disabling Cloud Run's
   Invoker IAM check entirely (a separate mechanism from IAM role grants, so it isn't blocked by
   DRS):
   ```
   gcloud run services update requestotp --no-invoker-iam-check --region=europe-west1
   gcloud run services update verifyotpandsend --no-invoker-iam-check --region=europe-west1
   ```
   Confirmed fixed: the next log line showed `"Callable request verification passed"` — requests
   now reach the function code, which they never did before.

4. **New, narrower error surfaced once past the auth layer** — same root cause family as the
   earlier Cloud Build permission gap (the default compute service account,
   `540017973887-compute@developer.gserviceaccount.com`, has zero project-level IAM roles due to
   the 2024 GCP policy change), just a different missing role this time:
   ```
   Error: 7 PERMISSION_DENIED: Missing or insufficient permissions.
     at Firestore.getAll (...)
   ```
   The service account can invoke the function now, but can't read/write Firestore — it never had
   the Datastore role either.

5. ✅ **Fixed** — granted `540017973887-compute@developer.gserviceaccount.com` the **"Cloud
   Datastore User"** role (`roles/datastore.user`) via IAM & Admin → Grant Access, same pattern as
   the Cloud Build fix. This let the function's Firestore cooldown-check read succeed, and the
   request finally reached the Resend `.send()` call for the first time — which immediately
   surfaced the real, final bug:
   ```
   { message: "API key is invalid", name: "validation_error", statusCode: 400 }
   ```
6. ✅ **Fixed — the actual root cause.** The `RESEND_API_KEY` secret's stored value was corrupted,
   almost certainly from a bad paste into PowerShell's masked `firebase functions:secrets:set`
   prompt the first time it was set (no visual feedback on a masked field makes a partial/garbled
   paste invisible until something actually tries to use the key). Fixed by generating a **fresh**
   Resend API key (deleted the old one, created a new one with identical scope) and setting it via
   `--data-file` instead of the interactive masked prompt (see takeaway below). Redeployed both
   functions so they picked up the new secret version. Retested — full flow confirmed working.

**Takeaway 1:** this project's default compute service account needed **three** separate manual
role grants across this build (Secret Manager access was auto-granted by `firebase deploy`; Cloud
Build Builder and Datastore User were not) — all stemming from the same one-time 2024 GCP policy
change removing default Editor access for new projects' compute service accounts. Any *new* GCP
capability this service account touches going forward should be assumed to need the same manual
grant, not treated as a fresh mystery each time.

**Takeaway 2 — going forward, never set a Firebase secret via the interactive masked prompt on
this machine.** PowerShell's masked-input field for `firebase functions:secrets:set <NAME>` gave
no visual feedback and silently accepted a corrupted paste with no error — the secret was
"created successfully" while actually holding a broken value, and this wasn't discoverable until
a real API call downstream failed with a vague error days later. **Always use the file-based
method instead:**
```
# 1. Paste the secret value into Notepad (normal clipboard, not the masked terminal field), save as a .txt file
# 2. Set it from that file:
firebase functions:secrets:set SECRET_NAME --data-file "path\to\file.txt"
# 3. Delete the file immediately after — never leave a plaintext secret file on disk or in a git-tracked folder
Remove-Item "path\to\file.txt"
```
This is slower by one step but actually verifiable — you can confirm the file's contents look
right before the CLI ever sees them, which the masked prompt gives you no way to do.

---

## First `firebase deploy --only functions` failed: missing Cloud Build permission

**Symptom:** `firebase deploy --only functions` uploaded source and granted Secret Manager access
successfully, but both `requestOtp` and `verifyOtpAndSend` failed to build with: `Build failed
with status: FAILURE. Could not build the function due to a missing permission on the build
service account.`

**Cause:** Confirmed via Google's own troubleshooting docs and Firebase community threads — since
July 2024, newly-created GCP projects no longer automatically grant the default Compute Engine
service account (`<project-number>-compute@developer.gserviceaccount.com`) the broad Editor role
it used to get by default. 2nd-gen Cloud Functions builds run under that service account, so
without an explicit Cloud Build role it can't build anything. This project's default compute SA
had **zero** project-level IAM roles at all (confirmed: it didn't even appear in the IAM console's
principal list until searched by exact email, and "Grant access" had to add it as a brand-new
principal, not edit an existing one).

**Fix:** IAM & Admin → Grant Access → new principal
`<project-number>-compute@developer.gserviceaccount.com` → role **"Cloud Build Service Account"**
(`roles/cloudbuild.builds.builder`). After granting and waiting ~1-2 minutes for propagation,
redeploy succeeded cleanly.

**Takeaway:** Any brand-new GCP/Firebase project attempting its *first* 2nd-gen Functions deploy
should expect this exact failure — it's not project-specific misconfiguration, it's the current
default state of every new project since the policy change. Grant the Cloud Build role
proactively before the first deploy attempt next time, rather than debugging the failure fresh.

---

## New `firebase` dependency showed "Module not found" despite being installed

**Symptom:** After adding `firebase` to `package.json` and running `npm install`, the dev server
(already running from earlier in the session) threw `Module not found: Can't resolve
'firebase/app'` / `'firebase/app-check'` / `'firebase/functions'` on every route touching the new
`TemplateRequestForm`/`TemplatesInteractive` components — even though `node_modules/firebase`
was confirmed present on disk.

**Cause:** Same root issue logged earlier in this file for a missing Tailwind class — a
long-running Turbopack dev server doesn't reliably pick up a `node_modules` change (new package
added mid-session) without a restart. The server's module resolution graph was built before
`firebase` existed in `node_modules`.

**Fix:** Killed the stale dev server process (found via `Get-NetTCPConnection -LocalPort 3000`),
`rm -rf .next`, restarted clean. Resolved immediately — no code change needed, same as the
Tailwind case.

**Takeaway:** This is now the *second* time a long-running dev server missed a real `node_modules`
change this build (see the Tailwind entry below). Confirmed pattern: any time a new package is
added to `package.json` mid-session, restart the dev server (kill + `rm -rf .next`) before
debugging a "module not found" as if it were a real code problem — it almost never is.

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

## GTM Tag Assistant "Could not connect to localhost" on first Preview mode attempt — RESOLVED

**Status: resolved 2026-09-17. Connected successfully on retry from an Incognito window.**

**Symptom:** Running GTM Preview mode (`tagmanager.google.com`, container GTM-MQV493DM) against
`http://localhost:3000` failed with "Could not connect to localhost" / "A timeout occurred while
attempting to connect to http://localhost:3000/", "0 Google tags found." The connected site tab
itself loaded fine and correctly carried the `?gtm_debug=...` query param GTM's own snippet checks
for, so the page and its GTM script were both working — only Tag Assistant's own debug handshake
back to the extension/parent window was failing.

**Cause:** Not confirmed with certainty (no browser extension list was audited), but the standard
GTM guidance for this exact error message explicitly lists "the Google tag is not being blocked,
e.g. by a browser extension" as one of three causes, and the fix (Incognito, extensions disabled
by default) worked immediately on the first retry — consistent with an ad blocker or privacy
extension in the normal Chrome profile silently blocking Tag Assistant's own connection channel,
separate from blocking the site's actual GTM snippet (which was never blocked, per the direct
`dataLayer` inspection done via this session's own browser tool beforehand, which showed
`page_render_mode_set` and `scroll_depth` events reaching `dataLayer` correctly the whole time).

**Fix:** Opened a fresh Incognito window (Ctrl+Shift+N in Chrome, extensions disabled by default
unless explicitly allowed in Incognito), signed into `tagmanager.google.com` there, retried
Preview mode -> connected immediately, "Connected!", 2 Google tags found (GTM-MQV493DM,
G-GFK6117QNY), full event timeline visible (Consent Initialization -> Initialization -> Container
Loaded -> page_render_mode_set -> DOM Ready -> Window Loaded -> Scroll Depth), `GA4 - Anthony
Chilaka Portfolio` and `GA4 Event - scroll_depth` both confirmed "Fired 1 time."

**Takeaway:** If GTM Preview mode ever times out again on this or another project, try Incognito
before assuming a real site/GTM misconfiguration — the site's own GTM snippet can be working
perfectly (confirmed independently via direct `dataLayer` inspection) while Tag Assistant's own
debug connection is blocked by something in the browser profile running Preview mode, not by
anything on the site itself.
