import Image from "next/image";
import Hero from "@/components/Hero";
import MediaSlot from "@/components/MediaSlot";
import PricePaths from "@/components/PricePaths";
import UpcomingEvents from "@/components/UpcomingEvents";
import { Button, ListPanel, Section, Split, Stats, Wrap } from "@/components/ui";
import {
  getPartners,
  getPortfolios,
  getSiteConfig,
  getTeamYears,
} from "@/lib/content";

export default function Home() {
  const portfolios = getPortfolios();
  const partners = getPartners().current;
  const { media } = getSiteConfig();

  // The most recent year that published papers.
  const paperYear = getTeamYears().find(
    (year) => Object.keys(year.config.researchPapers ?? {}).length > 0
  );
  const papers = Object.keys(paperYear?.config.researchPapers ?? {});
  const details = paperYear?.config.researchPaperDetails ?? {};
  const winner = paperYear?.config.winner;

  return (
    <>
      <Hero />

      <Section>
        <Split
          title="Research and Portfolios"
          lede={
            <p>
              Members design, build, and run live quantitative strategies across equities, rates,
              credit, options, and energy, and publish the results.
            </p>
          }
          cta={<Button href="/portfolios">Explore the Portfolios</Button>}
        />
        <Stats
          items={[
            { value: portfolios.length, label: "Portfolios this year" },
            { value: papers.length, label: `Papers published in ${paperYear?.config.year ?? "our last year"}` },
            { value: partners.length, label: "Industry partners" },
          ]}
        />
      </Section>

      {paperYear && (
        <section className="cs-band cs-band--papers on-blue" aria-labelledby="papers-title">
          <Wrap>
            <div className="cs-grid cs-split cs-reveal">
              <h2 id="papers-title" className="cs-h2 cs-h2--on-blue">
                Published Research
              </h2>
              <div>
                <p className="cs-lede">
                  Each project team publishes a research paper on its strategy.
                  {winner && ` The ${paperYear.config.year} competition winner was ${winner}.`}
                </p>
                <Button href="/competition" variant="accent" className="mt-8">
                  Explore the Papers
                </Button>
              </div>
            </div>
            <MediaSlot src={media?.research} alt="" className="cs-band__media">
              <ul className="cs-papers" aria-label="First pages of the published papers">
                {papers.map((team) => (
                  <li key={team}>
                    {details[team]?.image ? (
                      <Image
                        src={details[team].image!}
                        alt={`First page of “${details[team].title}”`}
                        width={850}
                        height={1100}
                        sizes="(max-width: 900px) 33vw, 20vw"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </MediaSlot>
          </Wrap>
        </section>
      )}

      <Section>
        <Split
          title="Curriculum"
          lede={
            <p>
              Coverage of asset classes and strategy types, coding and problem solving, and the
              infrastructure behind a strategy, from data to automation. Grounded in math and
              probability, with Green Book problems and market-making games, and taught alongside
              portfolio work.
            </p>
          }
          cta={<Button href="/education">Explore the Curriculum</Button>}
        />
      </Section>

      <div className="cs-section">
        <ListPanel
          title={
            <>
              2026–2027
              <br />
              Portfolios
            </>
          }
          intro={<p>{portfolios.length} desks, each with its own thesis, data, and tooling.</p>}
          items={portfolios.map((p) => ({
            href: `/portfolios#${p.slug}`,
            title: p.title,
            byline: p.tech.slice(0, 2),
          }))}
        />
      </div>

      <section className="cs-band cs-band--texture on-blue" aria-labelledby="partners-title">
        <PricePaths className="!bottom-[var(--cs-overhang)]" />
        <Wrap>
          <div className="cs-grid cs-split cs-reveal">
            <h2 id="partners-title" className="cs-h2 cs-h2--on-blue">
              Partnerships
            </h2>
            <div>
              <p className="cs-lede">
                QUANTT works with {partners.map((p) => p.name).join(", ")}. We welcome new
                partners for the 2026–2027 year.
              </p>
              <Button href="/partners" variant="accent" className="mt-8">
                Explore Partnerships
              </Button>
            </div>
          </div>
          <MediaSlot
            src={media?.partners}
            alt="QUANTT members together in a university atrium"
            className="cs-band__media"
            sizes="(max-width: 1440px) 100vw, 1328px"
          >
            <div className="cs-band__media bg-blue" aria-hidden="true" />
          </MediaSlot>
        </Wrap>
      </section>

      <UpcomingEvents />
    </>
  );
}
