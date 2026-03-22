import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import TeamMemberCard from "@/components/TeamMemberCard";
import ProjectCard from "@/components/ProjectCard";
import { getTeamMembers, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team & Projects — QUANTT",
  description: "Meet the QUANTT leadership team and explore our quantitative finance projects.",
};

export default function TeamPage() {
  const members = getTeamMembers();
  const projects = getProjects();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel><span className="text-blue-light">Our People</span></SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">Leadership</h1>
        </ScrollReveal>

        {members.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (<TeamMemberCard key={member.name} member={member} />))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-white/50">Team roster coming soon.</p>
        )}

        <div className="my-16 h-px bg-white/10" />

        <ScrollReveal>
          <SectionLabel><span className="text-blue-light">Our Work</span></SectionLabel>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white">Projects</h2>
        </ScrollReveal>

        {projects.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (<ProjectCard key={project.title} project={project} />))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-white/50">Projects coming soon.</p>
        )}
      </div>
    </GradientBackground>
  );
}
