import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact | Anthony Chilaka",
  description:
    "Book a discovery call or connect with Anthony Chilaka directly via LinkedIn, Upwork, or WhatsApp.",
};

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

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-poppins)]">
      <SiteNav />

      <main className="flex-1 px-6 py-24 text-center sm:px-10 lg:px-[7.5%]">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Ready to Optimize?</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-black/60">
          Connect with me directly by booking a slot on my calendar or via any of the social media
          links below.
        </p>

        <a
          href="https://cal.com/anthonychilaka"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-2 rounded-md border border-black/10 p-8 transition-colors hover:border-[var(--color-brand-accent)]"
        >
          <span className="text-lg font-semibold text-black">Schedule 1-on-1</span>
          <span className="text-sm" style={{ color: "var(--color-brand-accent)" }}>
            cal.com/anthonychilaka
          </span>
        </a>

        <div className="mt-12 flex items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition-all duration-300 hover:scale-110 hover:border-[var(--color-brand-accent)]"
            >
              <img
                src={s.icon}
                alt={s.label}
                className={`object-contain ${s.label === "WhatsApp" ? "h-5 w-5 scale-[2]" : "h-5 w-5"}`}
              />
            </a>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
