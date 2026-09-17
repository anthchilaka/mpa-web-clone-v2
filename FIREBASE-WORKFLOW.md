# Firebase Production Workflow — MPA-web-clone-v2

Reference for operating the template-request email feature's Firebase setup
(Functions, Firestore, App Check, Resend) after the initial build. See
`build.md` for what was built and when, `troubleshoot.md` for the specific
bugs hit along the way. This file is the "how to operate it going forward"
reference.

## What's running

Project: `anthonychilaka-web`, Blaze plan (required for Secret Manager and
2nd-gen Functions).

Two Cloud Functions, 2nd-gen, `europe-west1`, both with
`enforceAppCheck: true`: `requestOtp` and `verifyOtpAndSend`.

Firestore: `otpRequests` collection, denied to client reads/writes, Admin
SDK only. TTL on `expiresAt` confirmed "Serving," no manual cleanup needed.

App Check: reCAPTCHA Enterprise, domain-scoped. Only the production domain
and `anthonychilaka-web.web.app` are authorized. Staging preview channels
will show "Unauthenticated" on this one feature. Expected, not a bug, not
fixed by design (confirmed 2026-09-17).

Resend: separate team and domain (`mail.anthonychilaka.com`) from the other
account. DKIM/SPF verified. DMARC set in Squarespace DNS.

## Deploying a change

Hosting only (pages, styling, images):
```
npm run build
firebase deploy --only hosting
```
No Functions involvement, no secrets touched, low risk.

Functions code change:
```
firebase deploy --only functions
```
Higher risk. The first deploy hit three real blockers: missing Cloud Build
IAM role, missing Firestore IAM role, Domain Restricted Sharing blocking
Cloud Run's Invoker check. All three fixed, all documented in
`troubleshoot.md`. These were one-time fixes tied to this GCP project's IAM
state, not something Firebase re-applies automatically. A second function
added later will likely hit the same category of missing-role errors fresh.

## Rotating RESEND_API_KEY

```
firebase functions:secrets:set RESEND_API_KEY --data-file "path\to\file.txt"
Remove-Item "path\to\file.txt"
firebase deploy --only functions
```

Paste the key into Notepad first, save as a local `.txt` file, then use
`--data-file`. Delete the file right after.

Never use the interactive masked prompt in PowerShell directly. It already
corrupted the key once this session with no error and no visual feedback.
The key sat broken in production for days before a real request finally
failed and surfaced it.

## Testing

Production domain: verified working, confirmed 2026-09-17.

Staging: "Unauthenticated" on this feature is expected. Everything else on
staging works normally.

To test this feature on a preview channel: add that channel's domain to
the reCAPTCHA Enterprise key's authorized domains in Google Cloud Console.
A security-boundary change, don't do it without confirming first.

## Cost and monitoring

Expected real cost ~$0/month at current traffic. No manual OTP cleanup
needed. No recurring maintenance task beyond secret rotation, if that's
ever needed.
