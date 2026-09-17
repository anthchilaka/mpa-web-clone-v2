import { defineSecret } from "firebase-functions/params";

// Set via `firebase functions:secrets:set RESEND_API_KEY` — never committed.
export const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

// Dedicated sending subdomain, isolated from Kachi's own Resend setup.
export const FROM_ADDRESS = "Anthony Chilaka <noreply@mail.anthonychilaka.com>";
export const BUSINESS_INBOX = "services@anthonychilaka.com";

export const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
export const OTP_RESEND_COOLDOWN_SECONDS = 60; // min gap between two requests for the same email
export const OTP_LENGTH = 6;

export const OTP_REQUESTS_COLLECTION = "otpRequests";
