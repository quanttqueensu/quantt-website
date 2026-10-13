import type { Metadata } from "next";
import YearTabs from "@/components/YearTabs";
import { List, PageIntro, Stats, Wrap } from "@/components/ui";
import type { TeamYear } from "@/lib/content";
import { getTeamYears } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research — QUANTT",
  description: "Research papers from QUANTT's project teams, by competition year.",
};

function PapersList({ year }: { year: TeamYear }) {
  const teams = year.config.projectTeams ?? [];
  const papers = year.config.researchPapers ?? {};
  const details = year.config.researchPaperDetails ?? {};
  const winner = year.config.winner;

  // The winning team leads; the rest keep their configured order.
  const ordered =
    winner && teams.includes(winner) ? [winner, ...teams.filter((t) => t !== winner)] : teams;

  return (
    <List
      items={ordered
        .filter((team) => papers[team])
        .map((team) => {
          const pm = year.members.find((m) => m.tier === "project-manager" && m.department === team);
          const title = details[team]?.title ?? `${team}`;
          return {
            href: encodeURI(papers[team]),
            external: true,
            title,
            byline: [
              team === winner ? `${year.config.year} winner` : team,
              [details[team]?.date, pm && `Led by ${pm.name}`].filter(Boolean).join(" · ") || "PDF",
            ],
            label: `${title}, ${team} team${team === winner ? `, ${year.config.year} winner` : ""} (PDF, opens in new tab)`,
          };
        })}
    />
  );
}

export default function CompetitionPage() {
  const years = getTeamYears().filter((year) => (year.config.projectTeams ?? []).length > 0);
  const paperCount = years.reduce(
    (sum, year) => sum + Object.keys(year.config.researchPapers ?? {}).length,
    0
  );
  const latest = years[0];

  const tabs = years.map((year) => ({
    year: year.config.year,
    current: year.config.current,
    content: <PapersList year={year} />,
  }));

  return (
    <>
      <PageIntro
        title="Research, Written Up."
        lede={
          <p>
            Each year our project teams research, build, and trade a quantitative strategy, then
            publish the paper. Every one is free to read in full.
          </p>
        }
      >
        <Stats
          large
          items={[
            { value: paperCount, label: "Papers published" },
            { value: latest?.config.projectTeams?.length ?? 0, label: `Project teams in ${latest?.config.year ?? ""}` },
            ...(latest?.config.winner ? [{ value: 1, label: `Winner: ${latest.config.winner}` }] : []),
          ]}
        />
      </PageIntro>

      <div className="cs-section">
        <Wrap>
          <section className="cs-panel cs-reveal" aria-labelledby="papers-title">
            <div className="cs-panel__intro">
              <h2 id="papers-title" className="cs-h2 cs-h2--md">
                The Papers
              </h2>
              <p>Opened as PDFs. The winning paper is listed first.</p>
            </div>
            <div>
              <YearTabs tabs={tabs} label="Competition year" />
            </div>
          </section>
        </Wrap>
      </div>
    </>
  );
}
