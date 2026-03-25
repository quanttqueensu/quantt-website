"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const CONFERENCE_END = new Date("2026-03-29");

export default function HiringBanner() {
  const showConference = new Date() < CONFERENCE_END;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 space-y-4">
      {/* Conference Banner — auto-hides after March 28 */}
      {showConference && (
        <ScrollReveal>
          <div className="rounded-xl border border-primary/30 bg-primary/[0.12] p-6">
            <div className="md:flex md:items-start md:justify-between md:gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-blue-light">
                  This Saturday &middot; In Partnership with NBC Capital Markets
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">
                  QUANTT End-of-Year Conference
                </h3>
                <p className="mt-1 text-sm font-medium text-blue-light">
                  March 28 &middot; 9:00 AM – 3:30 PM &middot; Goodes 153
                </p>
                <p className="mt-3 text-sm text-white/70">
                  Case competition, networking, lunch, and project presentations.
                  Join as a competitor or spectator.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <div className="rounded-md border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5">
                    <span className="text-xs font-bold text-yellow-200">$1,200+ in prizes from NBC</span>
                  </div>
                  <div className="rounded-md border border-green-400/30 bg-green-400/10 px-3 py-1.5">
                    <span className="text-xs font-semibold text-green-300">Attend → guaranteed exec interview</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-shrink-0 flex-col gap-2 md:mt-0">
                <a
                  href="https://www.bouncelife.com/events/69b466f8a9636980e4704c39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded bg-primary px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
                >
                  Get Tickets
                </a>
                <Link
                  href="/competition"
                  className="inline-block rounded border border-white/20 px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  Competition Page
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Hiring Banner — always visible */}
      <ScrollReveal>
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
              of Research, Director of Education — more roles coming soon.
            </p>
          </div>
          <div className="mt-4 flex-shrink-0 md:mt-0">
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
      </ScrollReveal>
    </section>
  );
}
