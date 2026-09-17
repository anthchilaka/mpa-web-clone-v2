"use client";

import { useState } from "react";
import { requestOtp, verifyOtpAndSend, extractErrorMessage } from "@/lib/templateRequest";
import { isFirebaseConfigured } from "@/lib/firebaseClient";

const BUSINESS_INBOX = "services@anthonychilaka.com";

type Step = "email" | "otp" | "success";

function ShineButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-md px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      style={{ backgroundColor: "var(--cta-bg)" }}
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-y-0 left-[-60%] w-1/3 -skew-x-12 bg-white/35 transition-transform duration-700 ease-out group-hover:translate-x-[260%]" />
    </button>
  );
}

export default function TemplateRequestForm({ selectedTemplate }: { selectedTemplate: string | null }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bodyPreview = selectedTemplate
    ? `Good day, I will like to receive the price template for ${selectedTemplate}. Regards`
    : "Good day, I will like to receive the price template for this option. Regards";

  async function handleRequestCode() {
    if (!selectedTemplate) {
      setError("Select a template above first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await requestOtp({ email, templateName: selectedTemplate });
      setStep("otp");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAndSend() {
    if (!selectedTemplate) return;
    setError(null);
    setLoading(true);
    try {
      await verifyOtpAndSend({ email, code, templateName: selectedTemplate });
      setStep("success");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!isFirebaseConfigured()) {
    return (
      <div className="rounded-md border border-dashed border-black/15 p-8 text-center text-sm text-black/40">
        Template requests aren&apos;t live yet — check back soon.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-black/10 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--color-brand-accent)" }}>
        Request a template
      </p>

      <div className="mt-4 space-y-1 text-sm text-black/60">
        <p>
          <span className="font-semibold text-black">To:</span> {BUSINESS_INBOX}
        </p>
        <p>
          <span className="font-semibold text-black">Template:</span>{" "}
          {selectedTemplate ?? <span className="italic text-black/40">select one above</span>}
        </p>
      </div>

      <p className="mt-4 rounded-md bg-black/[0.03] p-4 text-sm text-black/70">{bodyPreview}</p>

      {step === "email" && (
        <div className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-black" htmlFor="template-request-email">
            Your email
          </label>
          <input
            id="template-request-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-black/15 px-4 py-2.5 text-sm text-black outline-none focus:border-[var(--color-brand-accent)]"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <ShineButton onClick={handleRequestCode} disabled={loading || !email || !selectedTemplate}>
            {loading ? "Sending code…" : "Send verification code"}
          </ShineButton>
        </div>
      )}

      {step === "otp" && (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-black/60">
            We sent a 6-digit code to <span className="font-semibold text-black">{email}</span>.
          </p>
          <label className="block text-sm font-medium text-black" htmlFor="template-request-code">
            Verification code
          </label>
          <input
            id="template-request-code"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="w-full rounded-md border border-black/15 px-4 py-2.5 text-center text-lg tracking-[0.4em] text-black outline-none focus:border-[var(--color-brand-accent)]"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <ShineButton onClick={handleVerifyAndSend} disabled={loading || code.length !== 6}>
            {loading ? "Sending…" : "Verify & send request"}
          </ShineButton>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError(null);
            }}
            className="text-xs text-black/40 underline"
          >
            Use a different email
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="mt-5 rounded-md bg-black/[0.03] p-4 text-sm text-black/70">
          Request sent — you&apos;ll hear back at <span className="font-semibold text-black">{email}</span> soon.
        </div>
      )}
    </div>
  );
}
