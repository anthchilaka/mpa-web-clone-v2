import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Workflow Automation Case Studies | Anthony Chilaka",
  description:
    "AI-driven automation systems built with Claude, n8n, and self-hosted infrastructure — each shown as problem, approach, and outcome.",
};

const CASE_STUDIES = [
  {
    title: "Credit Analyst Meeting Handover Automation",
    status: "Live-tested end-to-end with a real meeting",
    repo: "https://github.com/anthchilaka/credit-analyst-meeting-handover-automation",
    problem:
      "Credit analysts received manual write-ups after client calls they hadn't personally attended, producing inconsistent, incomplete handover records with no standard structure.",
    approach:
      "Built an event-driven pipeline — a Fathom call-recording webhook triggers n8n the moment a call ends, which runs a structured summary (overview, financial/credit details, decisions, action items, open questions) and emails it out with zero manual effort. Event-driven was chosen deliberately over polling for lower latency and lower running cost. Runs on Docker Compose (Postgres, Redis, n8n queue mode) on a self-hosted Hetzner VPS with Nginx SSL.",
    outcome:
      'Processes a call within under a minute of it ending, at an infrastructure cost of about $7.09/month and a few cents of Claude API usage per meeting. In testing it correctly reported "no financial/credit-relevant details discussed" on a call where that was true, rather than inventing content — the trait that matters most in a document analysts will actually rely on. Validation so far is one real meeting plus schema-matched synthetic payloads; CRM integration and wider meeting-length coverage are explicitly out of scope for now.',
    stack: "n8n, Claude API (Sonnet 5), Fathom webhook, Gmail API, Docker Compose, PostgreSQL, Redis",
  },
  {
    title: "Claude Workspace Audit",
    status: "Methodology validated, production run 2026-07-09",
    repo: "https://github.com/anthchilaka/claude-workspace-audit",
    problem:
      "Claude Cowork/Code builds accumulate operational drift — unrotated scratch folders, duplicated skills, broken paths, missing test coverage — with no repeatable way to catch it, and any audit tool has to run under a strict propose-only constraint so it never acts without explicit approval.",
    approach:
      "Built a Claude skill implementing a 6-point build-hygiene checklist that runs entirely on the user's own machine, requiring no external file access. Evaluated three ways: synthetic fixture testing for detection accuracy, real production validation against live daily job data, and cross-vendor grading gates spanning Claude, OpenAI, and Google models. A baseline comparison found the entire gap traced to propose-only discipline, where the baseline deleted an entire target folder without asking, overriding a delete-permission prompt. A production validation run on 2026-07-09 against the linkedin-job-intel skill found and fixed three real rule gaps, including a keyword match where 11 of 12 hits were false positives.",
    outcome:
      "Cross-vendor grading gates spanning Claude, OpenAI, and Google confirm the propose-only discipline holds under adversarial testing, not just in the happy path.",
    stack:
      "Claude Code / Cowork, cross-vendor model grading (Claude, OpenAI, Google), synthetic fixture testing, production data validation",
  },
  {
    title: "Kachi AI Assistant",
    status: "Live on Telegram · WhatsApp in progress",
    repo: "https://github.com/anthchilaka/kachi-ai-assistant",
    problem:
      "CraftByTag, a Nigerian retail business, needed to meet customers on the messaging apps they already use rather than routing them to a website, and to personalize returning-customer interactions without a staff member manually triaging every inbound message.",
    approach:
      "Built a conversational AI assistant on a queue-mode n8n instance (Redis-backed job broker) that runs a real Claude reasoning call to validate each customer's free-text description before capturing structured data, verifying email, and confirming next steps — no human in the loop. Handles three intake categories (AI automation guidance, craft training, freelance services) with voice input transcribed via OpenAI Whisper.",
    outcome:
      "Live and operational on Telegram at @ask_kachi_bot — the AI-automation intake flow is confirmed working through real customer conversations, not isolated testing. WhatsApp is in progress pending Meta Business Portfolio verification, launched on a deliberate staggered-rollout call rather than holding both channels for a simultaneous release.",
    stack: "n8n, Redis, PostgreSQL, Anthropic Claude, OpenAI Whisper, Telegram Bot API, WhatsApp Cloud API",
  },
];

export default function AiAutomationPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Workflow Automation Case Studies",
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
          Workflow Automation Case Studies
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black/60">
          AI-driven automation systems built with Claude, n8n, and self-hosted infrastructure — each
          shown as problem, approach, and outcome.
        </p>

        <div className="mt-16 flex flex-col gap-16">
          {CASE_STUDIES.map((c) => (
            <article key={c.title} className="border-t border-black/10 pt-10">
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

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
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
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
