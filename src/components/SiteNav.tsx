"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const PRIMARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "AI Automation", href: "/ai-automation" },
];

const MORE_LINKS = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Data Challenge Walkthrough", href: "/walkthroughs" },
  { label: "WebSite Template", href: "/templates" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/anthonychilaka/", icon: "/icons/linkedin.webp" },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~01952cdb9ce3e5b230?s=1017484851352698939",
    icon: "/icons/upwork.webp",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2347015366600?text=Hi%20Anthony,%20I%20have%20viewed%20your%20services%20and%20would%20like%20to%20discuss%20further",
    icon: "/icons/whatsapp.webp",
  },
  { label: "X", href: "https://x.com/anthonychilaka", icon: "/icons/x.svg" },
];

function SocialIcon({ label, href, icon }: { label: string; href: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-all duration-300 hover:scale-125 hover:bg-white/20"
      style={{ transitionProperty: "transform, background-color, box-shadow" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 14px 3px ${ACCENT_GLOW}`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <img
        src={icon}
        alt={label}
        className={`object-contain transition-transform duration-300 group-hover:scale-110 ${
          label === "WhatsApp" ? "h-4 w-4 scale-[2]" : "h-4 w-4"
        }`}
      />
    </a>
  );
}

const ACCENT_GLOW = "rgba(var(--color-red-600-rgb), 0.55)";

export default function SiteNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const allLinks = [...PRIMARY_LINKS, ...MORE_LINKS];
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [moreOpen]);

  return (
    <header
      className="relative z-20 flex w-full items-center justify-between px-6 sm:px-10 lg:px-[7.5%]"
      style={{ height: "76px", backgroundColor: "var(--nav-bg)" }}
    >
      <a href="https://github.com/anthchilaka" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <img src="/images/logo.webp" alt="Anthony Chilaka monogram" className="h-10 w-auto" />
      </a>

      <nav className="hidden items-center gap-7 text-sm font-medium text-white md:flex">
        {PRIMARY_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="transition-colors hover:text-[var(--link-hover)]"
          >
            {link.label}
          </a>
        ))}

        <div className="relative" ref={moreRef} onMouseEnter={() => setMoreOpen(true)}>
          <button
            type="button"
            className="flex items-center gap-1 transition-colors hover:text-[var(--link-hover)]"
            onClick={() => setMoreOpen(true)}
            aria-expanded={moreOpen}
          >
            More
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-full w-48 pt-2">
              <div className="rounded-md bg-white py-2 text-black shadow-lg">
                {MORE_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-2 text-sm transition-colors hover:bg-black/5 hover:text-[var(--link-hover)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex items-center gap-2">
        {SOCIALS.map((s) => (
          <SocialIcon key={s.label} label={s.label} href={s.href} icon={s.icon} />
        ))}

        <button
          type="button"
          className="ml-1 flex h-11 w-11 items-center justify-center text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-white/10 px-6 py-4 text-sm font-medium text-white md:hidden"
          style={{ backgroundColor: "var(--nav-bg)" }}
        >
          {allLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block rounded-md px-2 py-3 transition-colors hover:bg-white/5 hover:text-[var(--link-hover)]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
