import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import TeamMemberCard from "@/components/TeamMemberCard";
import ProjectCard from "@/components/ProjectCard";
import { getTeamMembers, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Who We Are — QUANTT",
  description:
    "Meet the QUANTT leadership team and explore our quantitative finance projects.",
};

const tierConfig = [
  { key: "co-chair", label: "Co-Chairs" },
  { key: "director", label: "Directors" },
  { key: "project-manager", label: "Project Managers" },
  { key: "member", label: "Members" },
] as const;

export default function TeamPage() {
  const members = getTeamMembers();
  const projects = getProjects();

  const membersByTier = tierConfig
    .map(({ key, label }) => ({
      label,
      members: members.filter((m) => m.tier === key),
    }))
    .filter(({ members }) => members.length > 0);

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our People</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Leadership
          </h1>
        </ScrollReveal>

        {membersByTier.length > 0 ? (
          membersByTier.map(({ label, members: tierMembers }) => (
            <ScrollReveal key={label}>
              <div className="mt-10">
                <h2 className="mb-6 text-lg font-semibold g-heading">
                  {label}
                </h2>
                <div
                  className={`grid gap-4 ${
                    tierMembers.length <= 2
                      ? "sm:grid-cols-2 max-w-2xl"
                      : "sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {tierMembers.map((member) => (
                    <TeamMemberCard key={member.name} member={member} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))
        ) : (
          <p className="mt-8 text-sm g-muted">
            Team roster coming soon.
          </p>
        )}

        <div className="my-16 h-px bg-white/15" />

        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our Work</span>
          </SectionLabel>
          <h2 className="mt-2 font-heading text-2xl font-bold g-heading">
            Projects
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          {projects.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm g-muted">Projects coming soon.</p>
          )}
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
