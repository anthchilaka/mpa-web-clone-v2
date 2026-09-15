import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Data Challenge Walkthroughs | Anthony Chilaka",
  description: "Step-by-step build guides for analytics data challenges. Coming soon.",
};

export default function DataChallengeWalkthroughsPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <SiteNav />

      <main className="flex-1 px-6 py-24 text-center sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Data Challenge Walkthroughs</h1>

        <div className="mx-auto mt-10 max-w-lg">
          <img
            src="/images/walkthroughloadingv2.webp"
            alt="Data challenge walkthrough placeholder"
            className="w-full rounded-md"
          />
          <p className="mt-4 text-sm text-black/60">
            Full build breakdowns from Power BI, Excel, and Fabric analytics challenges — coming soon.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
