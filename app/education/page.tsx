import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import Accordion from "@/components/Accordion";
import ScrollReveal from "@/components/ScrollReveal";
import GlassCard from "@/components/GlassCard";
import { getEducationChapters } from "@/lib/content";

export const metadata: Metadata = {
  title: "Curriculum & Education — QUANTT",
  description:
    "Explore QUANTT's intensive 10-week curriculum covering quantitative trading, computational finance, and software engineering for quantitative research.",
};

export default function EducationPage() {
  const chapters = getEducationChapters();
  const items = chapters.map((ch) => {
    const isDualTrack = !!(ch.trading_track || ch.development_track);

    return {
      title: `Week ${ch.chapter}: ${ch.title}`,
      content: (
        <div className="space-y-4">
          {ch.body && (
            <p className="text-text-light mb-4 text-sm leading-relaxed">
              {ch.body}
            </p>
          )}

          {isDualTrack ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {ch.trading_track && ch.trading_track.length > 0 && (
                <div className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <h4 className="font-heading text-sm font-semibold text-white">
                      Trading Track
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {ch.trading_track.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-light">
                        <span className="mt-1 text-emerald-400">→</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ch.development_track && ch.development_track.length > 0 && (
                <div className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-light" />
                    <h4 className="font-heading text-sm font-semibold text-white">
                      Development Track
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {ch.development_track.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-light">
                        <span className="mt-1 text-blue-light">→</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            ch.topics && ch.topics.length > 0 && (
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-accent" />
                  <h4 className="font-heading text-sm font-semibold text-white">
                    Foundational Topics
                  </h4>
                </div>
                <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {ch.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-light">
                      <span className="mt-1 text-blue-accent">→</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      ),
    };
  });

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <div className="text-center">
            <SectionLabel>
              <span className="text-blue-light">Learn With Us</span>
            </SectionLabel>
            <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
              Curriculum & Education
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-light">
              QUANTT's 10-week educational program bridges the gap between theoretical finance and production-level quantitative software development. Our members learn core market concepts and advance into specialized tracks.
            </p>
          </div>
        </ScrollReveal>

        {/* Tracks Overview Cards */}
        <ScrollReveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  📈
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-white">
                    Trading Track
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-medium">Strategy & Markets</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text-light">
                Focuses on market inefficiencies, hypothesis generation, quantitative strategy design, options theory, volatility models, post-earnings announcement drift, and portfolio risk management.
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-light">
                  💻
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-white">
                    Development Track
                  </h3>
                  <p className="text-[11px] text-blue-light font-medium">Data & Engineering</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text-light">
                Focuses on Python and pandas engineering, data cleansing, regression modeling, time-series stationarity, building robust backtesting engines, computational numerical methods, and connecting with market APIs.
              </p>
            </GlassCard>
          </div>
        </ScrollReveal>

        {/* 10-Week Roadmap */}
        <ScrollReveal>
          <div className="mt-16">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-heading text-lg font-bold text-white">
                10-Week Roadmap
              </h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                Autumn Term
              </span>
            </div>

            {items.length > 0 ? (
              <Accordion items={items} />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
                <p className="text-sm text-white/50">Coming soon</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
