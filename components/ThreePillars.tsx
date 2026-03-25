import GlassCard from "./GlassCard";
import SectionLabel from "./SectionLabel";
import ScrollReveal from "./ScrollReveal";

const pillars = [
  {
    icon: "✦",
    title: "Collaboration",
    description: "Working together across disciplines to solve complex problems in quantitative finance.",
  },
  {
    icon: "◆",
    title: "Research",
    description: "Rigorous quantitative analysis, financial modeling, and academic exploration.",
  },
  {
    icon: "▶",
    title: "Application",
    description: "Real-world algorithmic trading, portfolio management, and data-driven strategies.",
  },
];

export default function ThreePillars() {
  return (
    <ScrollReveal>
      <section id="pillars" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <SectionLabel>
            <span className="text-white/50">What We Do</span>
          </SectionLabel>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white">
            Three Pillars
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <GlassCard key={pillar.title} className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-blue-accent">
                {pillar.icon}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">{pillar.title}</h3>
              <p className="text-xs leading-relaxed text-white/60">{pillar.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
