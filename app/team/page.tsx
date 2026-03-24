import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import TeamMemberCard from "@/components/TeamMemberCard";
import { getTeamMembers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Who We Are — QUANTT",
  description:
    "Meet the QUANTT leadership team and explore our quantitative finance projects.",
};

const leadershipTiers = [
  { key: "co-chair", label: "Co-Chairs" },
  { key: "director", label: "Directors" },
  { key: "coordinator", label: "Coordinators" },
] as const;

const projectTeams = [
  "Binomial Pricing",
  "Equities Hedged",
  "Intraday Volatility",
  "Macro Regime",
  "Pairs Trading",
];

export default function TeamPage() {
  const members = getTeamMembers();

  const leadershipByTier = leadershipTiers
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
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        {/* Leadership */}
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our People</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Leadership
          </h1>
        </ScrollReveal>

        {leadershipByTier.map(({ label, members: tierMembers }) => (
          <ScrollReveal key={label}>
            <div className="mt-10">
              <h2 className="mb-6 text-lg font-semibold g-heading">
                {label}
              </h2>
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

        {/* Project Teams */}
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

      </div>
    </GradientBackground>
  );
}
