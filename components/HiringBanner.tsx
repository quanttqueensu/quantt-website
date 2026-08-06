"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const APPLY_URL =
  "https://reflective-doll-bcf.notion.site/2026-2027-QUANTT-Hiring-Package-3242cf39c60a80d3a132ebf75f6d4adc";

export default function HiringBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <ScrollReveal>
        <div className="rounded-xl border border-green-400/20 bg-green-400/[0.08] p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-green-300">
              Now Hiring
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">
              Join a 2026–2027 Project Team
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Open research and trading projects across energy, rates, options,
              equities, and credit — plus executive team roles.
            </p>
          </div>
          <div className="mt-4 flex flex-shrink-0 flex-col gap-2 sm:flex-row md:mt-0">
            <Link
              href="/hiring"
              className="inline-block rounded bg-primary px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
            >
              View Projects
            </Link>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded border border-white/20 px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              Apply Now
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
