import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import Accordion from "@/components/Accordion";
import ScrollReveal from "@/components/ScrollReveal";
import { getEducationChapters } from "@/lib/content";

export const metadata: Metadata = {
  title: "Education — QUANTT",
  description:
    "QUANTT's curriculum covers capital markets, algorithmic trading, time series analysis, and more.",
};

export default function EducationPage() {
  const chapters = getEducationChapters();
  const items = chapters.map((ch) => ({
    title: `Chapter ${ch.chapter}: ${ch.title}`,
    content: ch.body,
  }));

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Learn With Us</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Education
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Our curriculum is designed to take you from fundamentals to
            advanced quantitative finance concepts.
          </p>
        </ScrollReveal>

        <div className="mt-10">
          <Accordion items={items} />
        </div>
      </div>
    </GradientBackground>
  );
}
