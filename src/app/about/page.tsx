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

const TOOLS = [
  { name: "Power BI", icon: "/icons/powerbi.svg" },
  { name: "Excel", icon: "/icons/excel.svg" },
  { name: "MySQL", icon: "/icons/mysql.svg" },
  { name: "Python", icon: "/icons/python.svg" },
  { name: "Microsoft Fabric", icon: "/icons/microsoftfabric.svg" },
  { name: "n8n", icon: "/icons/n8n.svg" },
  { name: "OpenCode", icon: "/icons/opencode.svg" },
  { name: "Claude Code", icon: "/icons/claude.svg" },
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

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/70">
          I&apos;m a Business Analyst and Power BI Analyst with 15+ years in corporate brand sourcing
          and design, and a proven track record of 3+ years building AI-driven business automation.
          Across retail, eCommerce, logistics, health and wellness, and fintech, the pattern repeats:
          the data exists, but nobody trusts it enough to act on it. I build the dashboards, pipelines,
          and automated workflows that close that gap.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
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

        <section className="mt-20">
          <h2 className="text-xl font-bold text-black">Tools I Use</h2>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            The BI, data, and AI automation stack behind the analytics and shipped production tools
            above: Power BI and Excel for reporting, MySQL and Python for data work, Microsoft Fabric
            for unified analytics pipelines, and n8n, OpenCode, and Claude Code for building and
            deploying AI automation.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col items-center gap-2 rounded-md border border-black/10 px-4 py-5 text-center transition-colors hover:border-[var(--color-brand-accent)]"
              >
                <img src={tool.icon} alt={`${tool.name} logo`} className="h-8 w-8 object-contain" />
                <span className="text-xs font-medium text-black/80">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
