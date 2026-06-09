import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import YearTabs from "@/components/YearTabs";
import type { TeamYear } from "@/lib/content";
import { getTeamYears } from "@/lib/content";

export const metadata: Metadata = {
  title: "Competition — QUANTT",
  description:
    "QUANTT's project teams and their research papers from each competition year.",
};

function ProjectsView({ year }: { year: TeamYear }) {
  const teams = year.config.projectTeams ?? [];
  const papers = year.config.researchPapers ?? {};
  const winner = year.config.winner;

  return (
    <ScrollReveal>
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((name) => {
          const paper = papers[name];
          const isWinner = name === winner;
          const pm = year.members.find(
            (m) => m.tier === "project-manager" && m.department === name
          );
          return (
            <div
              key={name}
              className={`rounded-lg border p-5 backdrop-blur-md ${
                isWinner
                  ? "border-yellow-400/30 bg-yellow-400/[0.06]"
                  : "border-white/15 bg-white/[0.06]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold g-heading">{name}</h3>
                {isWinner && (
                  <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-200">
                    🏆 Winner
                  </span>
                )}
              </div>
              {isWinner && pm && (
                <p className="mt-1 text-xs g-muted">Led by {pm.name}</p>
              )}
              {paper && (
                <a
                  href={encodeURI(paper)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} research paper (opens in new tab)`}
                  className="mt-3 inline-block rounded-md bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.12] hover:text-white"
                >
                  Research Paper ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </ScrollReveal>
  );
}

export default function CompetitionPage() {
  const years = getTeamYears().filter(
    (year) => (year.config.projectTeams ?? []).length > 0
  );

  const tabs = years.map((year) => ({
    year: year.config.year,
    current: year.config.current,
    content: <ProjectsView year={year} />,
  }));

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Project Teams</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Competition
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
            Each year our project teams research, build, and trade a
            quantitative strategy — read their research papers below.
          </p>
        </ScrollReveal>

        <div className="mt-8">
          <YearTabs tabs={tabs} />
        </div>
      </div>
    </GradientBackground>
  );
}
