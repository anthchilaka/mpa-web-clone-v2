import { createHash, randomInt } from "crypto";
import { OTP_LENGTH } from "./config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email);
}

export function generateOtp(): string {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) code += randomInt(0, 10).toString();
  return code;
}

// Codes are never stored in plaintext — only this hash.
export function hashOtp(code: string, email: string): string {
  return createHash("sha256").update(`${email.toLowerCase()}:${code}`).digest("hex");
}

// Firestore doc ids can't contain "/" or start with "."; emails are safe enough
// after lowercasing, but hash the email too so the document id itself never
// exposes a plaintext address in logs, exports, or the console UI.
export function emailDocId(email: string): string {
  return createHash("sha256").update(email.toLowerCase()).digest("hex");
}
