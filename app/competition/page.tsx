import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Competition — QUANTT",
  description:
    "QUANTT's annual end-of-year conference — case competition, project presentations, papers, results, and more.",
};

export default function CompetitionPage() {
  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Annual Showcase</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            End-of-Year Conference
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
            Our annual conference features a live case competition, project team
            presentations, research showcases, and networking — all in one day.
          </p>
        </ScrollReveal>

        {/* Case Competition */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-lg font-semibold g-heading">Case Competition</h2>
            <p className="mt-2 text-sm g-body">
              In partnership with National Bank Capital Markets. Teams compete
              in a live case challenge judged by industry professionals.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-yellow-400/20 bg-yellow-400/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-200/70">Prizes</p>
                <p className="mt-1 text-lg font-bold text-yellow-200">$1,200+</p>
                <p className="mt-1 text-xs g-body">from NBC Capital Markets</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider g-muted">Perks</p>
                <p className="mt-1 text-sm font-semibold g-heading">Coffee Chats</p>
                <p className="mt-1 text-xs g-body">
                  Exclusive sessions with Sales &amp; Trading professionals at
                  NBC Capital Markets
                </p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider g-muted">Format</p>
                <p className="mt-1 text-sm font-semibold g-heading">Teams of 2</p>
                <p className="mt-1 text-xs g-body">
                  Compete with a partner or get matched
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
              <p className="text-sm g-muted">Case details and results coming soon</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Project Teams */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-lg font-semibold g-heading">Project Presentations</h2>
            <p className="mt-2 text-sm g-body">
              Each project team presents their year-long work — strategies,
              research, and trading results.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                "Binomial Pricing",
                "Equities Hedged",
                "Intraday Volatility",
                "Macro Regime",
                "Pairs Trading",
              ].map((name) => (
                <div
                  key={name}
                  className="rounded-lg border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md"
                >
                  <h3 className="text-sm font-semibold g-heading">{name}</h3>
                  <p className="mt-1 text-xs g-muted">Details coming soon</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Papers */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-lg font-semibold g-heading">Papers</h2>
            <p className="mt-2 text-sm g-body">
              Research papers and strategy write-ups from our teams.
            </p>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
              <p className="text-sm g-muted">Coming soon</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Results */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-lg font-semibold g-heading">Results</h2>
            <p className="mt-2 text-sm g-body">
              Final standings, performance metrics, and awards.
            </p>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
              <p className="text-sm g-muted">Coming soon</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Videos */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-lg font-semibold g-heading">Videos</h2>
            <p className="mt-2 text-sm g-body">
              Recordings of presentations, highlights, and behind-the-scenes.
            </p>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
              <p className="text-sm g-muted">Coming soon</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
