"use client";

import { useEffect, useState } from "react";

type Slide = { src: string; label: string };

const SLIDES: Slide[] = [
  { src: "/hero/anthonychilakahero1.webp", label: "PERSONAL BRAND" },
  { src: "/hero/hero2.webp", label: "WEB DESIGN" },
  { src: "/hero/hero3.webp", label: "AI AUTOMATION" },
];
const DISPLAY_MS = 5500;
const ACCENT = "var(--carousel-accent)"; // shared accent, ties 3 mismatched photos together

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, DISPLAY_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-900">
      {SLIDES.map((slide, i) => (
        <div
          key={`${slide.src}-${i === active ? active : "idle"}`}
          className="absolute inset-0 bg-cover bg-center transition-opacity ease-linear"
          style={{
            backgroundImage: `url(${slide.src})`,
            opacity: i === active ? 1 : 0,
            transitionDuration: `${DISPLAY_MS}ms`,
            animation: i === active ? `hero-kenburns ${DISPLAY_MS}ms ease-out forwards` : "none",
          }}
        />
      ))}

      {/* Chip label — bottom-left, same position/style every slide, one shared accent color */}
      <div className="absolute bottom-8 left-6 z-10 sm:left-10 lg:left-[7.5%]">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", border: `1px solid ${ACCENT}` }}
        >
          {SLIDES[active].label}
        </span>
      </div>

      {/* Progress dots — bottom-center */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
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
