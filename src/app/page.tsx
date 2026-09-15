import HeroCarousel from "@/components/HeroCarousel";
import SiteNav from "@/components/SiteNav";
import HomeCta from "@/components/HomeCta";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <SiteNav />

      {/* Hero — fixed to fill the viewport below the 76px nav, independent of CTA/Footer siblings */}
      <main className="relative flex flex-col overflow-hidden" style={{ height: "calc(100svh - 76px)" }}>
        <HeroCarousel />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-0" />
      </main>

      <HomeCta />
      <SiteFooter />
    </div>
  );
}
