import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PushPageViewSnippet from "@/components/PushPageViewSnippet";

export const metadata: Metadata = {
  title: "Portfolio Project Walkthroughs | Anthony Chilaka",
  description:
    "Curated, step-by-step guides for optimizing your business from build to production. Coming soon!",
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <SiteNav />

      <main className="flex-1 px-6 py-24 text-center sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Portfolio Project Walkthroughs</h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-black/60">
          Curated, step-by-step guides for optimizing your business from build to production. Coming soon!
        </p>

        <div className="mx-auto mt-14 max-w-2xl text-left">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--color-brand-accent)" }}
          >
            Preview: page-view tracking helper
          </h2>
          <p className="mt-3 text-sm text-black/60">
            A real snippet from this site&apos;s own SPA (single-page application) → MPA (multi-page
            application) migration — the shared helper every page calls to set the canonical
            render-mode signal.
          </p>
          <PushPageViewSnippet />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
