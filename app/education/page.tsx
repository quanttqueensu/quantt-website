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
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-10">
            {items.length > 0 ? (
              <Accordion items={items} />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
                <p className="text-sm text-white/50">Coming soon</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
