import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Professional Services | Anthony Chilaka",
  description:
    "Business analytics, BI training, corporate sourcing, website development, and monthly project walkthroughs — remote-first consulting for teams across Nigeria and EMEA.",
};

const SERVICES = [
  {
    title: "Business Analytics",
    body: "Click the thumbnail above for a 1-on-1 session. Gain actionable insights from your complex data to guide your critical corporate strategies.",
    href: "https://cal.com/anthonychukwuemekachilaka/30min",
  },
  {
    title: "BI Training",
    body: "Click above image to request personalized BI training. Share your team's needs and get top-tier coaching on the latest Business Intelligence tooling and data workflows.",
    href: "https://wa.me/2347015366600",
  },
  {
    title: "Corporate Sourcing",
    body: "Click above image for expert corporate sourcing. We bridge the gap between borders to ensure your brand items are delivered reliably and on-brand, every time.",
    href: "https://cal.com/anthonychukwuemekachilaka/30min",
  },
  {
    title: "Website Development",
    body: "Click the image above to view available templates. Please take a screenshot of your choice or share your specific preferences via the social media handles located at the top and bottom of this page.",
    href: "/templates",
  },
  {
    title: "Monthly Project Walkthroughs",
    body: "Comprehensive step-by-step guides delivered to your inbox. Click the above thumbnail to view and download.",
    href: "/walkthroughs",
  },
];

const AREAS = [
  "Lagos",
  "Ibadan",
  "Port Harcourt",
  "Kaduna",
  "Abuja",
  "Bauchi",
  "Kano",
  "Plateau",
  "Jos",
  "Owerri",
  "Awka",
  "USA",
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            provider: { "@type": "Person", name: "Anthony Chilaka" },
            areaServed: AREAS,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Professional Services",
              itemListElement: SERVICES.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.title, description: s.body },
              })),
            },
          }),
        }}
      />

      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Professional Services</h1>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <a
              key={service.title}
              href={service.href}
              target={service.href.startsWith("http") ? "_blank" : undefined}
              rel={service.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group block rounded-md border border-black/10 p-6 transition-colors hover:border-[var(--color-brand-accent)]"
            >
              <h2 className="text-base font-semibold text-black">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{service.body}</p>
            </a>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="text-xl font-bold text-black">Areas I Work With</h2>
          <p className="mt-2 text-sm text-black/60">
            Remote-first business analytics and AI automation consulting, serving clients across
            Nigeria and EMEA:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full border border-black/15 px-3 py-1 text-xs text-black/70"
              >
                {area}
              </span>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
