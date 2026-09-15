import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PushPageViewSnippet from "@/components/PushPageViewSnippet";

const TITLE = "Why This Site Moved From a Single-Page App to a True Multi-Page Build";
const EXCERPT =
  "A single index.html and client-side routing look modern, but they don't fix the one thing that actually matters for search and AI crawlers: content that exists before JavaScript runs.";
const DATE = "2026-09-07";

export const metadata: Metadata = {
  title: `${TITLE} | Anthony Chilaka`,
  description: EXCERPT,
};

export default function BlogPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: TITLE,
            description: EXCERPT,
            datePublished: DATE,
            author: { "@type": "Person", name: "Anthony Chilaka" },
          }),
        }}
      />

      <SiteNav />

      <main className="flex-1 px-6 py-24 sm:px-10 lg:px-[7.5%]">
        <article className="mx-auto max-w-2xl">
          <span
            className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-brand-accent)" }}
          >
            Blog
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-black sm:text-4xl">{TITLE}</h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60">{EXCERPT}</p>
          <div className="mt-6 flex items-center gap-3 border-t border-black/10 pt-4 text-sm text-black/50">
            <span className="font-semibold text-black/70">Anthony Chilaka</span>
            <span>·</span>
            <time dateTime={DATE}>September 7, 2026</time>
          </div>

          <div className="prose prose-neutral mt-10 max-w-none text-base leading-relaxed text-black/80">
            <p>
              This site&apos;s SPA had one <code className="code-inline">index.html</code> and
              hash-anchor navigation — <code className="code-inline">/#about</code>,{" "}
              <code className="code-inline">/#services</code>,{" "}
              <code className="code-inline">/#portfolio</code>. It worked fine for people. It
              didn&apos;t work for crawlers.
            </p>

            <h2 className="mt-10 text-xl font-bold text-black">
              The problem client-side routing doesn&apos;t fix
            </h2>
            <p className="mt-4">
              A client-side router like React Router fixes bookmarking and the back button. It does
              not fix the underlying issue: content only exists after JavaScript executes. A crawler
              that doesn&apos;t run your JS — or times out before it finishes — sees an empty shell.
              The fix isn&apos;t a smarter router. It&apos;s not having a router at all for content
              that should be crawlable on its own: a true multi-page build, one static HTML entry per
              route, built with Vite&apos;s multi-entry mode.
            </p>

            <h2 className="mt-10 text-xl font-bold text-black">What changed, concretely</h2>
            <p className="mt-4">
              Each page now gets its own entry point instead of sharing one bundle:
            </p>
            <PushPageViewSnippet />
            <p>
              That <code className="code-inline">page_render_mode</code> field is what lets the
              analytics side of this project tell the SPA and MPA apart in the same BigQuery table,
              so the before/after comparison is measured, not assumed.
            </p>

            <h2 className="mt-10 text-xl font-bold text-black">What&apos;s still in progress</h2>
            <p className="mt-4">
              The route-by-route migration is incremental on purpose — each page gets scaffolded,
              verified in a dev server, and approved before the next one starts. This blog, and the
              MDX pipeline that renders it, is one of those pieces.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
