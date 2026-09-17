import HeroCarousel from "@/components/HeroCarousel";
import SiteNav from "@/components/SiteNav";
import HomeCta from "@/components/HomeCta";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Anthony Chilaka",
            description:
              "Business Analyst and Power BI Analyst with 15+ years in corporate brand sourcing and design, and 3+ years building AI-driven business automation, serving clients across Nigeria and EMEA.",
            url: "https://www.anthonychilaka.com/",
            provider: {
              "@type": "Person",
              name: "Anthony Chilaka",
            },
            areaServed: [
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
            ],
            sameAs: [
              "https://www.linkedin.com/in/anthonychilaka/",
              "https://www.upwork.com/freelancers/~01952cdb9ce3e5b230?s=1017484851352698939",
              "https://x.com/anthonychilaka",
            ],
          }),
        }}
      />

      <SiteNav />

      {/* Hero — fixed to fill the viewport below the 76px nav, independent of CTA/Footer siblings */}
      <main
        className="relative flex flex-col overflow-hidden"
        style={{ height: "clamp(480px, calc(100svh - 76px), 760px)" }}
      >
        <HeroCarousel />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-0" />
      </main>

      <HomeCta />
      <SiteFooter />
    </div>
  );
}
