import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ | Anthony Chilaka",
  description:
    "Answers to common questions about business analytics, AI automation, and website development engagements with Anthony Chilaka: payment, revisions, tools, and areas served.",
};

const FAQS = [
  {
    question: "Can you reliably support real-time calls and remote delivery?",
    answer:
      "Yes. I work from a dedicated home office on a Starlink connection, tested at 269 Mbps download and 19 Mbps upload with 23ms latency, well above what's needed for video calls, screen shares, and remote pair sessions.",
  },
  {
    question: "Is the discovery call free?",
    answer:
      "Yes, discovery call sessions are free. Book a slot at cal.com/anthonychukwuemekachilaka/30min.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Business Analytics, BI Training, Corporate Sourcing, Website Development, AI Automation, and Monthly Project Walkthroughs. See the Services page for details on each.",
  },
  {
    question: "How does payment work?",
    answer:
      "It depends on engagement size. Fixed-scope work like WebSite Templates requires a deposit before work begins, with the balance due on delivery. Larger engagements like BI dashboards and AI automation builds are billed in milestones tied to project phases, agreed in that project's Statement of Work.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Payment via Wise is available, alongside other methods agreed per engagement. The Client bears all transaction and intermediary-bank fees so the full invoiced amount is received.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "3 rounds for BI dashboards, 3 rounds for WebSite Templates, and 5 rounds for AI automation builds. Consulting, BI training, and corporate sourcing engagements are scoped individually rather than following a fixed revision count. Additional revisions beyond the included rounds are quoted and billed separately.",
  },
  {
    question: "Who owns the final deliverables?",
    answer:
      "Ownership transfers to the Client once final payment is received in full. Full terms are in the Terms & Conditions page.",
  },
  {
    question: "What if I need to cancel a project partway through?",
    answer:
      "Any deposit paid is forfeited and you pay for work completed up to the cancellation date, unless otherwise agreed in that engagement's Statement of Work. Cancellation must be given in writing.",
  },
  {
    question: "Where are you based, and what areas do you work with?",
    answer:
      "Based in Nigeria, working remotely with clients across Lagos, Ibadan, Port Harcourt, Kaduna, Abuja, Bauchi, Kano, Plateau, Jos, Owerri, Awka, the USA, and EMEA.",
  },
  {
    question: "What tools and technologies do you use?",
    answer:
      "Power BI and Excel for reporting, MySQL and Python for data work, Microsoft Fabric for unified analytics pipelines, and n8n, OpenCode, and Claude Code for building and deploying AI automation.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a discovery call at cal.com/anthonychukwuemekachilaka/30min, or reach out directly via WhatsApp or LinkedIn from the Contact page.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            })),
          }),
        }}
      />

      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-4 max-w-2xl text-sm text-black/60">
          Common questions about working with Anthony Chilaka on business analytics, AI automation,
          and website development engagements. See the{" "}
          <a href="/terms" className="footer-link" style={{ color: "var(--color-brand-accent)" }}>
            Terms &amp; Conditions
          </a>{" "}
          page for full details.
        </p>

        <div className="mt-14 max-w-3xl space-y-8">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h2 className="text-base font-semibold text-black">{faq.question}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
