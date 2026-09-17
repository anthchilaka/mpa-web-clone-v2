"use client";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Data Challenge Walkthrough", href: "/walkthroughs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "AI Automation", href: "/ai-automation" },
  { label: "WebSite Template", href: "/templates" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
];

const AREAS_SERVED = [
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
];

const ACCENT = "var(--color-brand-accent)";

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

function FooterSocialIcon({ label, href, icon }: { label: string; href: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-125 hover:bg-white/10"
      style={{ borderColor: "rgba(255,255,255,0.3)", transitionProperty: "transform, background-color, box-shadow" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 14px 3px ${ACCENT}88`)}
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

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "var(--footer-bg)" }} className="text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-[7.5%]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <a href="https://github.com/anthchilaka" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src="/images/logo.webp" alt="Anthony Chilaka monogram" className="h-10 w-auto" />
            </a>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Business Analyst and AI Automation Consultant, serving clients across Nigeria, the USA, and EMEA.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <FooterSocialIcon key={s.label} label={s.label} href={s.href} icon={s.icon} />
              ))}
            </div>
          </div>

          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: ACCENT }}
            >
              Navigate
            </h3>
            <div className="mt-4 flex gap-x-6 text-sm text-white/80">
              <ul className="space-y-3">
                {NAV_LINKS.filter((_, i) => i % 2 === 0).map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {NAV_LINKS.filter((_, i) => i % 2 === 1).map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: ACCENT }}
            >
              Where My Clients Are Located
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {AREAS_SERVED.map((area) => (
                <span
                  key={area}
                  className="rounded-full px-3 py-1 text-xs text-white/70"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 text-xs text-white/50 sm:flex-row"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          <span>
            © 2026{" "}
            <a
              href="https://github.com/anthchilaka"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link transition-colors"
            >
              Anthony Chilaka
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
