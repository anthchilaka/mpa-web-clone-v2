import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PushPageViewSnippet from "@/components/PushPageViewSnippet";

export const metadata: Metadata = {
  title: "Portfolio Project Walkthroughs | Anthony Chilaka",
  description:
    "Real build walkthroughs from this site's own infrastructure, starting with why it runs on Firebase and the secure template-request email feature. More walkthroughs coming soon.",
};

const CASE_STUDIES = [
  {
    title: "Secure Template-Request Flow — Serverless OTP Email Verification",
    status: "Live in production, confirmed end-to-end",
    repo: "https://github.com/anthchilaka/mpa-web-clone-v2",
    problem:
      "A plain \"email us\" link on the WordPress template gallery invites spam and gives no proof the requester owns the address. Needed verified delivery with zero standing account infrastructure.",
    approach:
      "Two Firebase Cloud Functions (2nd-gen, europe-west1), gated by App Check (reCAPTCHA Enterprise) since the endpoints are public and unauthenticated. Firestore holds OTP state only: SHA-256 hashed codes, single-use, 10-minute expiry, 60-second resend cooldown, 5-attempt cap, and the document ID itself is a hash of the email, so no plaintext address sits in the database at rest. Firestore rules deny all client reads and writes; only the Admin SDK inside the Functions can touch the collection. Delivery runs through Resend on a dedicated sending subdomain, its own isolated team separate from other projects' mail infrastructure.",
    outcome:
      "Confirmed working end-to-end in production: template selected, email entered, OTP requested, verified, and the request email delivered via Resend. Three separate infrastructure issues stood between deploy and a working flow, a missing Cloud Build IAM role, a Domain Restricted Sharing policy silently blocking Cloud Run's public-invoker grant, and a corrupted API key from a masked terminal prompt, each only surfacing once the last one was fixed.",
    stack: "Next.js (static export), Firebase Cloud Functions (2nd-gen), Firestore, Firebase App Check (reCAPTCHA Enterprise), Resend",
  },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Portfolio Project Walkthroughs",
            itemListElement: CASE_STUDIES.map((c, i) => ({
              "@type": "CreativeWork",
              position: i + 1,
              name: c.title,
              about: c.problem,
              url: c.repo,
            })),
          }),
        }}
      />

      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <h1 className="max-w-2xl text-3xl font-bold text-black sm:text-4xl">
          Portfolio Project Walkthroughs
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black/60">
          Real build walkthroughs from this site&apos;s own infrastructure, problem, approach, and
          outcome. More walkthroughs coming soon.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-black/10 pt-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex gap-5">
            <span
              className="select-none text-6xl font-black leading-none sm:text-7xl"
              style={{ color: "var(--color-brand-accent)", opacity: 0.18 }}
              aria-hidden="true"
            >
              01
            </span>
            <div className="min-w-0">
              <h2
                className="text-xs font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--color-brand-accent)" }}
              >
                Why Firebase
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/70">
                The Astra WordPress build on Namecheap shared hosting was costing close to $140 a
                year. On top of that, the free Google Meet link behind my Cal.com booking flow
                capped every call at 60 minutes, cutting off client and mentee sessions that needed
                more time.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-black/70">
                First move: migrate the domain to Squarespace. Second: start a Google Workspace
                Starter plan, which removed the meeting-length cap. That left one problem still
                unsolved: hosting a real site and backend without adding another recurring cost.
                Researching free-tier options is what surfaced Firebase, and it has held up since,
                Hosting, Functions, Firestore, and App Check, all inside Google&apos;s free-tier
                allowance at this traffic level.
              </p>
            </div>
          </div>

          {CASE_STUDIES.map((c) => (
            <article key={c.title} className="flex gap-5">
              <span
                className="select-none text-6xl font-black leading-none sm:text-7xl"
                style={{ color: "var(--color-brand-accent)", opacity: 0.18 }}
                aria-hidden="true"
              >
                02
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-bold text-black">{c.title}</h2>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.06em]"
                    style={{ color: "var(--color-brand-accent)" }}
                  >
                    {c.status}
                  </span>
                </div>
                <a
                  href={c.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-black/50 underline"
                >
                  {c.repo.replace("https://", "")}
                </a>

                <div className="mt-6 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-black/40">
                      Problem
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/70">{c.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-black/40">
                      Approach
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/70">{c.approach}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-black/40">
                      Outcome
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/70">{c.outcome}</p>
                  </div>
                </div>

                <p className="mt-6 text-xs text-black/50">
                  <span className="font-semibold text-black/70">Stack:</span> {c.stack}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex gap-5 border-t border-black/10 pt-10">
          <span
            className="select-none text-6xl font-black leading-none sm:text-7xl"
            style={{ color: "var(--color-brand-accent)", opacity: 0.18 }}
            aria-hidden="true"
          >
            03
          </span>
          <div className="min-w-0 max-w-2xl">
            <h2
              className="text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--color-brand-accent)" }}
            >
              The Canonical Signal Behind the SPA vs MPA Comparison
            </h2>
            <p className="mt-3 text-sm text-black/60">
              A real snippet from this site&apos;s own SPA (single-page application) → MPA (multi-page
              application) migration — the shared helper every page calls to set the canonical
              render-mode signal.
            </p>
            <PushPageViewSnippet />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
