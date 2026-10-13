import MediaSlot from "./MediaSlot";
import RotatingPhrase from "./RotatingPhrase";
import { Button } from "./ui";
import { getSiteConfig } from "@/lib/content";

/** Full-bleed photo with the blue panel anchored bottom-right, cyan bar at its edge. */
export default function Hero() {
  const { media } = getSiteConfig();

  return (
    <section className="cs-hero cs-reveal on-blue" aria-labelledby="hero-title">
      <div className="relative">
        <MediaSlot
          src={media?.hero}
          alt="QUANTT members on a visit to an industry partner's office"
          className="cs-hero__media"
          sizes="100vw"
          priority
        >
          <div className="cs-hero__media" aria-hidden="true" />
        </MediaSlot>
        <p className="cs-hero__label">Queen&apos;s University Algorithmic Network &amp; Trading Team</p>
      </div>

      <div className="cs-hero__panel">
        <h1 id="hero-title" className="cs-h1">
          <span className="sr-only">
            Tomorrow&apos;s talent in quantitative finance, algorithmic trading, and data science.
          </span>
          <span aria-hidden="true" className="block">
            Tomorrow&apos;s Talent in
          </span>
          <RotatingPhrase />
        </h1>
        <p>
          Queen&apos;s students research, build, and trade quantitative strategies, learning and
          building side by side all year.
        </p>
        <Button href="/competition" variant="cyan">
          Explore Our Research
        </Button>
      </div>
    </section>
  );
}
