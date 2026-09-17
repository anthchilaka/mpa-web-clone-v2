import { httpsCallable } from "firebase/functions";
import { getFunctionsClient } from "@/lib/firebaseClient";

interface RequestOtpInput {
  email: string;
  templateName: string;
}

interface VerifyOtpInput {
  email: string;
  code: string;
  templateName: string;
}

export async function requestOtp(input: RequestOtpInput): Promise<void> {
  const fn = httpsCallable<RequestOtpInput, { sent: true }>(getFunctionsClient(), "requestOtp");
  await fn(input);
}

export async function verifyOtpAndSend(input: VerifyOtpInput): Promise<void> {
  const fn = httpsCallable<VerifyOtpInput, { sent: true }>(getFunctionsClient(), "verifyOtpAndSend");
  await fn(input);
}

// Firebase Functions callable errors carry a `.code` (e.g. "resource-exhausted")
// and a human-readable `.message` — surface the message directly since the
// backend already writes visitor-safe copy for every HttpsError it throws.
export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
