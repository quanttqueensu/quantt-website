import ScrollReveal from "./ScrollReveal";

export default function HiringBanner() {
  return (
    <ScrollReveal>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-xl border border-green-400/20 bg-green-400/[0.08] p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-green-300">
              Now Hiring
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">
              Join the 2026-2027 Executive Team
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Open positions: Portfolio Manager, Chief People Officer, Director
              of Research, Director of Education — and more coming soon.
              Attend our conference on March 28 for a guaranteed interview!
            </p>
          </div>
          <div className="mt-4 flex flex-shrink-0 gap-2 md:mt-0">
            <a
              href="https://reflective-doll-bcf.notion.site/2026-2027-QUANTT-Hiring-Package-3242cf39c60a80d3a132ebf75f6d4adc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
