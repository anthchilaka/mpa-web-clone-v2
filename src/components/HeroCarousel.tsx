"use client";

import { useEffect, useState } from "react";

type Slide = { src: string; label: string };

const DESKTOP_SLIDES: Slide[] = [
  { src: "/hero/v2hero1.webp", label: "PERSONAL BRAND" },
  { src: "/hero/v2hero2.webp", label: "END TO END ANALYTICS" },
  { src: "/hero/v2hero3.webp", label: "AI AUTOMATION" },
  { src: "/hero/v2hero4.webp", label: "WEB DESIGN" },
];

const MOBILE_SLIDES: string[] = [
  "/hero/mobile/mobilehero1.webp",
  "/hero/mobile/mobilehero2.webp",
  "/hero/mobile/mobilehero3.webp",
  "/hero/mobile/mobilehero4.webp",
];

const DISPLAY_MS = 5500;
const ACCENT = "var(--carousel-accent)"; // shared accent, ties mismatched photos together
const SLIDE_COUNT = DESKTOP_SLIDES.length; // desktop and mobile sets are the same length

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  // null = breakpoint not yet known client-side; avoids loading the wrong set's images.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      setActive(0);
      setLoaded(new Set([0]));
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDE_COUNT);
    }, DISPLAY_MS);
    return () => clearInterval(id);
  }, []);

  // Preload the next slide during the current one's full dwell time, so it's
  // ready before it's needed instead of loading all slides on first paint.
  useEffect(() => {
    const nextIndex = (active + 1) % SLIDE_COUNT;
    setLoaded((prev) => (prev.has(nextIndex) ? prev : new Set(prev).add(nextIndex)));
  }, [active]);

  if (isDesktop === null) {
    return <div className="absolute inset-0 bg-neutral-900" />;
  }

  const sources = isDesktop ? DESKTOP_SLIDES.map((s) => s.src) : MOBILE_SLIDES;

  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-900">
      {sources.map((src, i) =>
        loaded.has(i) ? (
          <img
            key={`${src}-${i === active ? active : "idle"}`}
            src={src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === active ? "high" : "auto"}
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-linear"
            style={{
              opacity: i === active ? 1 : 0,
              transitionDuration: `${DISPLAY_MS}ms`,
              animation: i === active ? `hero-kenburns ${DISPLAY_MS}ms ease-out forwards` : "none",
            }}
          />
        ) : null
      )}

      {isDesktop && (
        <div className="absolute bottom-8 left-6 z-10 sm:left-10 lg:left-[7.5%]">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", border: `1px solid ${ACCENT}` }}
          >
            {DESKTOP_SLIDES[active].label}
          </span>
        </div>
      )}

      {/* Progress dots — bottom-center, shared across both breakpoints */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full transition-colors"
            style={{
              backgroundColor: i === active ? ACCENT : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
