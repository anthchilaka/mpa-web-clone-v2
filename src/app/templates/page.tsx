import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import TemplatesInteractive from "@/components/TemplatesInteractive";

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
          click on the desired thumbnail to submit your pick, or use the button below each template
          to view it live or get in touch.
        </p>

        <TemplatesInteractive templates={TEMPLATES} />
      </main>

      <SiteFooter />
    </div>
  );
}
