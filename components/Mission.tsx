import SectionLabel from "./SectionLabel";
import ScrollReveal from "./ScrollReveal";

export default function Mission() {
  return (
    <ScrollReveal>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="flex-1">
            <SectionLabel>
              <span className="text-blue-grey">Our Mission</span>
            </SectionLabel>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white">
              Closing the Gap
            </h2>
            <p className="mt-4 leading-relaxed text-white/75">
              QUANTT bridges the gap between academic theory and industry practice
              in quantitative finance. We equip students with real-world skills
              through hands-on projects, mentorship, and industry partnerships —
              preparing tomorrow&apos;s leaders in algorithmic trading and
              quantitative research.
            </p>
          </div>
          <div className="flex h-48 w-full flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] md:h-52 md:w-64">
            <span className="text-xs text-white/30">Club Photo</span>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
