"use client";

import { useState, useEffect } from "react";

export default function AnnouncementPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Auto-hide after the conference date
    if (new Date() > new Date("2026-03-29")) return;
    const dismissed = sessionStorage.getItem("popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("popup-dismissed", "1");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/15 bg-navy p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute right-4 top-4 text-white/40 hover:text-white text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Conference */}
        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-blue-light">
          This Saturday
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-white">
          QUANTT End-of-Year Conference
        </h2>
        <p className="mt-1 text-sm font-medium text-blue-light">
          March 28 &middot; 9:00 AM – 3:30 PM &middot; Goodes 153
        </p>

        <p className="mt-2 text-xs font-medium text-white/50">
          In partnership with National Bank Capital Markets
        </p>

        <p className="mt-4 text-sm leading-relaxed text-white/75">
          Case competition, networking, lunch, and project presentations from
          our teams. Join as a competitor or spectator — you&apos;ll learn about
          the quantitative finance industry and won&apos;t regret it!
        </p>

        <div className="mt-4 space-y-2">
          <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-4 py-3">
            <p className="text-sm font-bold text-yellow-200">
              $1,200+ in prizes from NBC Capital Markets
            </p>
            <p className="mt-1 text-xs text-yellow-200/70">
              Plus exclusive coffee chats with Sales &amp; Trading professionals at NBC Capital Markets
            </p>
          </div>
          <div className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3">
            <p className="text-sm font-semibold text-green-300">
              Attend the conference → guaranteed interview for any exec position!
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href="https://www.bouncelife.com/events/69b466f8a9636980e4704c39"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded bg-primary px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
          >
            Get Tickets
          </a>
          <a
            href="https://reflective-doll-bcf.notion.site/2026-2027-QUANTT-Hiring-Package-3242cf39c60a80d3a132ebf75f6d4adc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-white/20 px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Exec Hiring Info
          </a>
        </div>

        {/* Hiring teaser */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[3px] text-white/40">
            Also Hiring
          </p>
          <p className="mt-2 text-sm text-white/70">
            We&apos;re hiring for 2026-2027 exec positions: Portfolio Manager,
            Chief People Officer, Director of Research, and Director of
            Education — with more roles coming soon.
          </p>
        </div>

        <p className="mt-5 text-xs text-white/40">
          Questions? DM us on{" "}
          <a
            href="https://www.instagram.com/quanttqueens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-light hover:text-white"
          >
            @quanttqueens
          </a>
        </p>
      </div>
    </div>
  );
}
