"use client";

import { useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";
import TemplateRequestForm from "@/components/TemplateRequestForm";

const WHATSAPP_URL =
  "https://wa.me/2347015366600?text=Hi%20Anthony,%20I%27d%20like%20to%20discuss%20a%20template%20urgently";

interface TemplateItem {
  name: string;
  image: string;
  cta: string;
  href: string;
}

export default function TemplatesInteractive({ templates }: { templates: readonly TemplateItem[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function selectTemplate(name: string) {
    setSelected(name);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.name} className="overflow-hidden rounded-md border border-black/10">
            <button
              type="button"
              onClick={() => selectTemplate(t.name)}
              aria-label={`Request the price template for ${t.name}`}
              className="group relative block w-full"
            >
              <img
                src={`/images/${t.image}`}
                alt={`${t.name} preview`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 opacity-100 transition-all duration-300 md:bg-black/0 md:opacity-0 md:group-hover:bg-black/60 md:group-hover:opacity-100">
                <MousePointerClick className="h-8 w-8 text-white" strokeWidth={1.75} />
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                  Click to email
                </span>
              </div>
            </button>

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

      <div ref={formRef} className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <TemplateRequestForm selectedTemplate={selected} />

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col justify-end overflow-hidden rounded-md border border-black/10"
        >
          <img
            src="/images/callv2.webp"
            alt="Chat on WhatsApp for an urgent response"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <p className="text-sm font-semibold text-white">Need it urgently?</p>
            <p className="mt-1 text-xs text-white/80">Chat on WhatsApp for a faster response.</p>
          </div>
        </a>
      </div>
    </>
  );
}
