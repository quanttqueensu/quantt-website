import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import TeamMemberCard from "@/components/TeamMemberCard";
import YearTabs from "@/components/YearTabs";
import type { TeamYear, TeamMember } from "@/lib/content";
import { getTeamYears } from "@/lib/content";

export const metadata: Metadata = {
  title: "Who We Are — QUANTT",
  description:
    "Meet the QUANTT leadership team and explore our quantitative finance projects.",
};

function TieredView({ year }: { year: TeamYear }) {
  const { config, members } = year;
  const tiers = config.leadershipTiers ?? [];
  const projectTeams = config.projectTeams ?? [];

  const leadershipByTier = tiers
    .map(({ key, label }) => ({
      label,
      members: members.filter((m) => m.tier === key),
    }))
    .filter(({ members }) => members.length > 0);

  const teams = projectTeams.map((teamName) => {
    const pm = members.find(
      (m) => m.tier === "project-manager" && m.department === teamName
    );
    const gms = members.filter(
      (m) => m.tier === "member" && m.department === teamName
    );
    return { name: teamName, pm, gms };
  });

  return (
    <>
      {leadershipByTier.map(({ label, members: tierMembers }) => (
        <ScrollReveal key={label}>
          <div className="mt-10">
            <h2 className="mb-6 text-lg font-semibold g-heading">{label}</h2>
            <div
              className={`grid gap-4 ${
                tierMembers.length <= 2
                  ? "sm:grid-cols-2 max-w-2xl"
                  : tierMembers.length <= 4
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {tierMembers.map((member) => (
                <TeamMemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      ))}

      <div className="my-16 h-px bg-white/15" />

      <ScrollReveal>
        <SectionLabel>
          <span className="text-blue-light">Our Teams</span>
        </SectionLabel>
        <h2 className="mt-2 font-heading text-2xl font-bold g-heading">
          Project Teams
        </h2>
      </ScrollReveal>

      <div className="mt-10 space-y-8">
        {teams.map(({ name, pm, gms }) => (
          <ScrollReveal key={name}>
            <div className="rounded-lg border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold g-heading">{name}</h3>

              {pm && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-xs font-bold g-muted">
                    {pm.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold g-heading">{pm.name}</p>
                    <p className="text-xs text-blue-light">Project Manager</p>
                  </div>
                </div>
              )}

              {gms.length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider g-muted">
                    Team Members
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {gms.map((gm) => (
                      <div
                        key={gm.name}
                        className="flex items-center gap-2 rounded-md bg-white/[0.05] px-3 py-2"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-bold g-muted">
                          {gm.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm g-heading">{gm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}

function CorporateView({ year }: { year: TeamYear }) {
  const { config, members } = year;
  const hierarchy = config.hierarchy ?? [];

  return (
    <>
      {hierarchy.map((tier) => (
        <ScrollReveal key={tier.tier}>
          <div className="mt-10">
            <h2 className="mb-6 text-lg font-semibold g-heading">
              {tier.label}
            </h2>

            {tier.roles && (
              <div
                className={`grid gap-4 ${
                  tier.roles.length <= 3
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {tier.roles.map((role) => {
                  const member = members.find(
                    (m) => m.role === role.title || m.role === role.short
                  );
                  return (
                    <div
                      key={role.short}
                      className="rounded-lg border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-light">
                        {role.short}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold g-heading">
                        {role.title}
                      </h3>
                      {member ? (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-bold g-muted">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm g-heading">
                            {member.name}
                          </span>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs g-muted">TBA</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {tier.teams && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tier.teams.map((team) => (
                  <div
                    key={team}
                    className="rounded-lg border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md"
                  >
                    <h3 className="text-sm font-semibold g-heading">
                      {team} Analysts
                    </h3>
                    <p className="mt-1 text-xs g-muted">
                      {tier.placeholder ?? "TBA"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!tier.roles && !tier.teams && tier.placeholder && (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
                <p className="text-sm g-muted">{tier.placeholder}</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      ))}
    </>
  );
}

export default function TeamPage() {
  const years = getTeamYears();

  const tabs = years.map((year) => ({
    year: year.config.year,
    current: year.config.current,
    content:
      year.config.structure === "corporate" ? (
        <CorporateView year={year} />
      ) : (
        <TieredView year={year} />
      ),
  }));

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our People</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Meet the Team
          </h1>
        </ScrollReveal>

        <div className="mt-8">
          <YearTabs tabs={tabs} />
        </div>
      </div>
    </GradientBackground>
  );
}
