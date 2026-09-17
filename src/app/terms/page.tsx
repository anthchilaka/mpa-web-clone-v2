import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions | Anthony Chilaka",
  description:
    "Terms and conditions governing business analytics, BI training, corporate sourcing, website development, AI automation, and project walkthrough engagements with Anthony Chilaka.",
};

const SECTIONS = [
  {
    title: "1. Scope of Work",
    body: "Each engagement is defined by a written Statement of Work (SOW) agreed before work begins: service description, deliverables, and timeline. Any work not expressly listed in the SOW is a Change Request and will be quoted and approved in writing before it's added to the project.",
  },
  {
    title: "2. Payment Terms",
    body: "Payment structure depends on engagement size. Fixed-scope work (e.g. WebSite Templates) requires a deposit before work begins, with the balance due on delivery. Larger engagements (e.g. BI dashboards, AI automation builds) are billed in milestones tied to project phases, as agreed in that project's SOW. The Contractor may pause work on any invoice that remains unpaid past its due date.",
  },
  {
    title: "3. Currency & Transfer Costs",
    body: "Invoice currency is agreed per engagement. Payment via Wise is available in addition to other agreed methods. The Client bears all transaction and intermediary-bank fees so that the Contractor receives the full invoiced amount.",
  },
  {
    title: "4. Revisions",
    body: "Included revision rounds vary by service: 3 rounds for BI dashboards, 3 rounds for WebSite Templates, and 5 rounds for AI automation builds. A revision is a refinement within the agreed scope, not a new request. Additional revisions beyond the included rounds are quoted and billed separately. Consulting, BI training, and corporate sourcing engagements are scoped individually and don't follow a fixed revision count.",
  },
  {
    title: "5. Intellectual Property",
    body: "The Contractor retains all intellectual property rights in the deliverables until full payment is received. Upon receipt of final payment in full, ownership of the agreed final deliverables transfers to the Client. The Contractor may display completed work in their portfolio unless the Client requests otherwise in writing.",
  },
  {
    title: "6. Cancellation",
    body: "If the Client cancels a project mid-engagement, any deposit paid is forfeited, and the Client pays for all work completed up to the cancellation date, unless otherwise agreed in that engagement's SOW. Cancellation must be given in writing.",
  },
  {
    title: "7. Confidentiality",
    body: "Both parties agree to keep confidential information shared during the engagement private, except where display in the Contractor's portfolio is permitted under Section 5.",
  },
  {
    title: "8. Limitation of Liability",
    body: "The Contractor's liability under any engagement is capped at the total value of that engagement's contract. The Contractor is not liable for indirect or consequential losses. The Client warrants that, to the best of its knowledge, any materials it supplies do not infringe third-party rights.",
  },
  {
    title: "9. Independent Contractor Status",
    body: "The Contractor operates as an independent contractor, not an employee of the Client, and is solely responsible for their own taxes, insurance, tools, and statutory obligations.",
  },
  {
    title: "10. Termination",
    body: "Either party may terminate an engagement with reasonable written notice, except where that engagement's SOW specifies otherwise (e.g. fixed-scope work near completion). The Client pays for all work completed up to the termination date. Sections 5 (Intellectual Property), 7 (Confidentiality), and 8 (Limitation of Liability) survive termination.",
  },
  {
    title: "11. Governing Law",
    body: "Governing law and dispute resolution are determined on a case-by-case basis, specified in each engagement's Statement of Work based on the Client's location and mutual agreement.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-4 max-w-2xl text-sm text-black/60">
          These terms govern business analytics, BI training, corporate sourcing, website
          development, AI automation, and project walkthrough engagements between Anthony Chilaka
          (&quot;the Contractor&quot;) and the
          client engaging those services (&quot;the Client&quot;). Specific figures (deposits,
          timelines, deliverables) are set per engagement in that project&apos;s Statement of Work.
        </p>

        <div className="mt-14 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-black">{section.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/70">{section.body}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
