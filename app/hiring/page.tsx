import type { Metadata } from "next";
import Link from "next/link";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hiring — QUANTT",
  description:
    "Join QUANTT project teams for 2026–2027. Explore open quantitative trading and research projects.",
};

const APPLY_URL =
  "https://reflective-doll-bcf.notion.site/2026-2027-QUANTT-Hiring-Package-3242cf39c60a80d3a132ebf75f6d4adc";

export default function HiringPage() {
  const projects = getProjects();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-green-300">Now Hiring</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Join a Project Team
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            QUANTT is hiring analysts for 2026–2027 research and trading
            projects. Explore each opening below, then apply through our hiring
            package.
          </p>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
          >
            Apply Now
          </a>
        </ScrollReveal>

        <div className="mt-14 space-y-0">
          {projects.map((project, i) => (
            <article
              key={project.slug}
              id={project.slug}
              className="scroll-mt-28 border-t border-white/10 py-10"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-sm text-blue-light/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-heading text-xl font-bold text-white md:text-2xl">
                  {project.title}
                </h2>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {project.description}
              </p>

              {project.body && (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  {project.body.split("\n\n").map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              )}

              {project.tech.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-blue-light transition-colors hover:text-white"
              >
                Apply for this project
                <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-6 border-t border-white/10 pt-10 text-center">
            <h3 className="font-heading text-lg font-bold text-white">
              Ready to join?
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Review the full hiring package and submit your application.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
              >
                Apply Now
              </a>
              <Link
                href="/contact"
                className="inline-block rounded border border-white/20 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
