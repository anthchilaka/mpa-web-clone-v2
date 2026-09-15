import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Available Templates | Anthony Chilaka",
  description:
    "Explore the layouts below to find the perfect foundation for your project — Business, Finance, Restaurant, Beauty & Fashion, NGO/Services, and Enterprise Solution templates.",
};

const TEMPLATES = [
  {
    name: "Business Template",
    image: "BusinessTemplate.webp",
    cta: "View Template Live",
    href: "https://websitedemos.net/love-nature-02/?customize=template",
  },
  {
    name: "Finance Template",
    image: "FinanaceTemplate.webp",
    cta: "View Template Live",
    href: "https://websitedemos.net/financial-accounting-04/?customize=template",
  },
  {
    name: "Restaurant Template",
    image: "FastFood.webp",
    cta: "View Template Live",
    href: "https://websitedemos.net/fast-food-04/?customize=template",
  },
  {
    name: "Beauty and Fashion",
    image: "BeautyFashion.webp",
    cta: "View Template Live",
    href: "https://websitedemos.net/black-friday-bonanza-04/?customize=template",
  },
  {
    name: "NGO/Services",
    image: "NGO.webp",
    cta: "View Template Live",
    href: "https://websitedemos.net/pet-care-04/?customize=template",
  },
  {
    name: "Enterprise Solution",
    image: "CoperateTemplate.webp",
    cta: "Contact to Discuss",
    href: "https://wa.me/2347015366600",
  },
] as const;

export default function TemplatesPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Available Templates",
            itemListElement: TEMPLATES.map((t, i) => ({
              "@type": "CreativeWork",
              position: i + 1,
              name: t.name,
            })),
          }),
        }}
      />

      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Available Templates</h1>
        <p className="mt-4 max-w-xl text-base text-black/60">
          Explore WordPress template layouts below to find the perfect foundation for your project,
          use the button below each template submit your pick.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="overflow-hidden rounded-md border border-black/10">
              <img
                src={`/images/${t.image}`}
                alt={`${t.name} preview`}
                className="aspect-[4/3] w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-base font-semibold text-black">{t.name}</h2>

                {t.name === "Enterprise Solution" ? (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mt-4 inline-flex h-10 items-center justify-center overflow-hidden rounded-md px-6 text-sm font-semibold text-white"
                    style={{ backgroundColor: "var(--cta-bg)" }}
                  >
                    <span className="relative z-10">{t.cta}</span>
                    <span className="pointer-events-none absolute inset-y-0 left-[-60%] w-1/3 -skew-x-12 bg-white/35 transition-transform duration-700 ease-out group-hover:translate-x-[260%]" />
                  </a>
                ) : (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: "var(--color-brand-accent)" }}
                  >
                    {t.cta} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
