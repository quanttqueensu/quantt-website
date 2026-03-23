import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — QUANTT",
  description: "Get in touch with the QUANTT team at Queen's University.",
};

export default function ContactPage() {
  const config = getSiteConfig();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel><span className="text-blue-light">Reach Out</span></SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">Contact Us</h1>
        </ScrollReveal>

        {config.recruiting && (
          <ScrollReveal>
            <div className="mt-10 rounded-lg border border-green-400/30 bg-green-400/10 p-6">
              <h2 className="text-lg font-bold g-heading">We&apos;re Recruiting!</h2>
              {config.recruitingDetails && <p className="mt-2 text-sm g-body">{config.recruitingDetails}</p>}
              {config.recruitingUrl && (
                <a href={config.recruitingUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded bg-primary px-5 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80">Apply Now</a>
              )}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-sm font-semibold g-heading">Email</h3>
              <a href="mailto:quanttgroup@gmail.com" className="text-sm text-blue-light hover:text-primary">quanttgroup@gmail.com</a>
            </div>
            <div>
              <h3 className="text-sm font-semibold g-heading">Social</h3>
              <div className="mt-2 flex flex-col gap-2">
                {[
                  { href: "https://www.facebook.com/QUANTTpage", label: "Facebook" },
                  { href: "https://www.linkedin.com/company/quanttqueens/", label: "LinkedIn" },
                  { href: "https://www.instagram.com/quanttqueens", label: "Instagram" },
                  { href: "https://linktr.ee/quantt", label: "Linktree" },
                ].map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-light hover:text-primary">{link.label} →</a>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
