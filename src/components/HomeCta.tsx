export default function HomeCta() {
  return (
    <section className="bg-white px-6 py-24 text-center sm:px-10 lg:px-[7.5%]">
      <h2 className="text-3xl font-bold text-black sm:text-4xl">
        Ready to put your data to work?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base text-black/60">
        Business analytics, BI training, and AI automation consulting for teams across Nigeria and EMEA.
      </p>
      <a
        href="https://cal.com/anthonychukwuemekachilaka/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-8 inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-8 text-sm font-semibold text-white"
        style={{ backgroundColor: "var(--cta-bg)" }}
      >
        <span className="relative z-10">Book a discovery call</span>
        <span
          className="pointer-events-none absolute inset-y-0 left-[-60%] w-1/3 -skew-x-12 bg-white/35 transition-transform duration-700 ease-out group-hover:translate-x-[260%]"
        />
      </a>
    </section>
  );
}
