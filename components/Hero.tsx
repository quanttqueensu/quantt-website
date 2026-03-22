import Link from "next/link";
import ParticleCanvas from "./ParticleCanvas";
import RotatingText from "./RotatingText";
import SectionLabel from "./SectionLabel";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-primary">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(to right, #cfd6f6 1px, transparent 1px)",
          backgroundSize: "calc(100% / 16) 100%",
        }}
        aria-hidden="true"
      />

      {/* Chart lines SVG */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-[200px] w-full opacity-10"
        viewBox="0 0 500 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points="0,160 50,130 100,140 150,80 200,110 250,40 300,70 350,30 400,56 450,20 500,36"
          fill="none"
          stroke="#6b8fd4"
          strokeWidth="1.5"
        />
        <polyline
          points="0,180 50,150 100,160 150,110 200,124 250,76 300,90 350,60 400,80 450,50 500,60"
          fill="none"
          stroke="#4a7ae0"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      <ParticleCanvas />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <SectionLabel>
          <span className="text-text-light">
            Queen&apos;s University Algorithmic Network &amp; Trading Team
          </span>
        </SectionLabel>

        <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Tomorrow&apos;s Talent in
          <br />
          <RotatingText />
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-text-light md:text-base">
          Bridging academic research and industry practice through
          collaboration, research, and real-world application.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
          >
            Get Involved
          </Link>
          <a
            href="#pillars"
            className="text-xs uppercase tracking-wider text-text-light transition-colors hover:text-white"
          >
            Our Work ↓
          </a>
        </div>
      </div>
    </section>
  );
}
