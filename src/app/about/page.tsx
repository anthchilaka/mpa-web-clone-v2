import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Anthony Chilaka | Business Analyst & Power BI Analyst | AI Automation Consultant",
  description:
    "Business Analyst and Power BI Analyst with 15+ years in corporate brand sourcing and design, and 3+ years building AI-driven business automation, serving clients across Nigeria and EMEA.",
};

const PILLARS = [
  {
    title: "Business Analytics & Business Intelligence",
    body: "I turn raw data into ROI. For a global logistics client running 72 fulfilment sites, I led a Microsoft Fabric migration that unified 8 SAP sources into a governed Direct Lake model, surfacing £57.77M in stock value and flagging 108,497 items for procurement action. For a Shopify eCommerce brand, I consolidated 5 data sources into one dashboard, saving $1,000/month against a paid analytics vendor.",
  },
  {
    title: "AI Automation & Website Development",
    body: "I build AI-driven automation tools alongside the next generation of web apps in React and TypeScript, integrated with data pipelines for a unified view of performance, including a Claude AI skill and a 7-layer job-intelligence pipeline running unattended in production.",
  },
  {
    title: "Corporate Brand Sourcing",
    body: "I provide expert-level talent and brand acquisition backed by over 15 years of corporate networking, ensuring timely delivery in line with client requirements.",
  },
  {
    title: "Business Intelligence Training",
    body: "I serve as Lead Mentor for data cohorts, having trained 20+ freelancers on Upwork and LinkedIn positioning and 15+ analytics professionals across three cohorts at Blossom Academy Ghana.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Anthony Chilaka",
            jobTitle: "Business Analyst & Power BI Analyst / AI Automation Consultant",
            description:
              "Business Analyst and Power BI Analyst with 15+ years in corporate brand sourcing and design, and 3+ years building AI-driven business automation.",
            url: "https://www.anthonychilaka.com/about",
            sameAs: [
              "https://www.linkedin.com/in/anthonychilaka/",
              "https://www.upwork.com/freelancers/~01952cdb9ce3e5b230?s=1017484851352698939",
            ],
          }),
        }}
      />

      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <h1 className="max-w-3xl text-3xl font-bold text-black sm:text-4xl">
          Anthony Chilaka | Business Analyst &amp; Power BI Analyst | AI Automation Consultant
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-black/70">
          I&apos;m a Business Analyst and Power BI Analyst with 15+ years in corporate brand sourcing
          and design, and a proven track record of 3+ years building AI-driven business automation.
          Across retail, eCommerce, logistics, health and wellness, and fintech, the pattern repeats:
          the data exists, but nobody trusts it enough to act on it. I build the dashboards, pipelines,
          and automated workflows that close that gap.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
          {PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <h2
                className="text-sm font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--color-brand-accent)" }}
              >
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{pillar.body}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
