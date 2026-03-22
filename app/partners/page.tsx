import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import PartnerCard from "@/components/PartnerCard";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners — QUANTT",
  description: "QUANTT partners with leading financial institutions to provide real-world quantitative finance experience.",
};

export default function PartnersPage() {
  const partners = getPartners();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel><span className="text-blue-light">Our Network</span></SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">Partners</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">Leveraging our talent-base to provide the value you need.</p>
        </ScrollReveal>

        <div className="mt-12">
          <h2 className="mb-6 text-lg font-semibold text-white">Current Partners</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {partners.current.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>
        </div>

        <ScrollReveal>
          <div className="mt-12 rounded-lg border border-primary/30 bg-primary/10 p-6 text-center">
            <h3 className="font-heading text-lg font-bold text-white">Looking for 2026-2027 Partners!</h3>
            <p className="mt-2 text-sm text-white/70">Interested in partnering with QUANTT? We&apos;d love to hear from you.</p>
            <a href="mailto:quanttgroup@gmail.com" className="mt-4 inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80">Get in Touch</a>
          </div>
        </ScrollReveal>

        {partners.past.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-sm font-semibold text-white/50">Past Partners</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {partners.past.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} muted />
              ))}
            </div>
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
