import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { Resend } from "resend";
import {
  RESEND_API_KEY,
  FROM_ADDRESS,
  BUSINESS_INBOX,
  OTP_TTL_SECONDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_REQUESTS_COLLECTION,
} from "./config";
import { isValidEmail, generateOtp, hashOtp, emailDocId } from "./otp";

initializeApp();
const db = getFirestore();

interface OtpDoc {
  codeHash: string;
  email: string;
  templateName: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  attempts: number;
}

const CALL_OPTIONS = {
  enforceAppCheck: true,
  secrets: [RESEND_API_KEY],
  region: "europe-west1",
};

export const requestOtp = onCall(CALL_OPTIONS, async (request) => {
  const email = request.data?.email;
  const templateName = request.data?.templateName;

  if (!isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "A valid email address is required.");
  }
  if (typeof templateName !== "string" || templateName.length === 0 || templateName.length > 80) {
    throw new HttpsError("invalid-argument", "A template selection is required.");
  }

  const docId = emailDocId(email);
  const docRef = db.collection(OTP_REQUESTS_COLLECTION).doc(docId);
  const existing = await docRef.get();

  if (existing.exists) {
    const data = existing.data() as OtpDoc;
    const ageSeconds = (Date.now() - data.createdAt.toMillis()) / 1000;
    if (ageSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
      throw new HttpsError(
        "resource-exhausted",
        `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - ageSeconds)}s before requesting another code.`
      );
    }
  }

  const code = generateOtp();
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(now.toMillis() + OTP_TTL_SECONDS * 1000);

  const doc: OtpDoc = {
    codeHash: hashOtp(code, email),
    email,
    templateName,
    createdAt: now,
    expiresAt, // Firestore TTL policy on this field auto-deletes expired docs
    attempts: 0,
  };
  await docRef.set(doc);

  const resend = new Resend(RESEND_API_KEY.value());
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Your verification code",
    text: `Your verification code is ${code}. It expires in ${OTP_TTL_SECONDS / 60} minutes.`,
  });

  if (error) {
    logger.error("Resend send failed (requestOtp)", { error });
    throw new HttpsError("internal", "Could not send the verification email. Please try again.");
  }

  return { sent: true };
});

export const verifyOtpAndSend = onCall(CALL_OPTIONS, async (request) => {
  const email = request.data?.email;
  const code = request.data?.code;
  const templateName = request.data?.templateName;

  if (!isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "A valid email address is required.");
  }
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    throw new HttpsError("invalid-argument", "Enter the 6-digit code.");
  }

  const docId = emailDocId(email);
  const docRef = db.collection(OTP_REQUESTS_COLLECTION).doc(docId);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new HttpsError("not-found", "No verification code found for this email. Request a new one.");
  }

  const data = snap.data() as OtpDoc;

  if (data.expiresAt.toMillis() < Date.now()) {
    await docRef.delete();
    throw new HttpsError("deadline-exceeded", "That code has expired. Request a new one.");
  }

  if (data.attempts >= 5) {
    await docRef.delete();
    throw new HttpsError("resource-exhausted", "Too many attempts. Request a new code.");
  }

  if (hashOtp(code, email) !== data.codeHash) {
    await docRef.update({ attempts: data.attempts + 1 });
    throw new HttpsError("invalid-argument", "Incorrect code.");
  }

  // Verified — consume the code so it can't be replayed, then send the request.
  await docRef.delete();

  const finalTemplateName = typeof templateName === "string" && templateName.length > 0
    ? templateName
    : data.templateName;

  const resend = new Resend(RESEND_API_KEY.value());
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: BUSINESS_INBOX,
    replyTo: email,
    subject: `Template request: ${finalTemplateName}`,
    text: `Good day, I will like to receive the price template for ${finalTemplateName}. Regards`,
  });

  if (error) {
    logger.error("Resend send failed (verifyOtpAndSend)", { error });
    throw new HttpsError("internal", "Could not send the request email. Please try again.");
  }

  return { sent: true };
});
