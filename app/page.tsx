import Link from "next/link";
import Hero from "@/components/Hero";
import PartnerLogos from "@/components/PartnerLogos";
import PricePaths from "@/components/PricePaths";
import ResearchList from "@/components/ResearchList";
import UpcomingEvents from "@/components/UpcomingEvents";
import { Button, ListPanel, Section, Split, Stats, Wrap } from "@/components/ui";
import { getEducationChapters, getPartners, getPortfolios, getTeamYears } from "@/lib/content";

export default function Home() {
  const portfolios = getPortfolios();
  const weeks = getEducationChapters().length;
  const partners = getPartners().current;

  // The most recent year that published papers.
  const paperYear = getTeamYears().find(
    (year) => Object.keys(year.config.researchPapers ?? {}).length > 0
  );
  const paperLinks = paperYear?.config.researchPapers ?? {};
  const details = paperYear?.config.researchPaperDetails ?? {};
  const winner = paperYear?.config.winner;
  // Winner first, then the rest in config order.
  const papers = Object.keys(paperLinks)
    .sort((a, b) => Number(b === winner) - Number(a === winner))
    .map((team) => ({ team, pdf: paperLinks[team], detail: details[team] }));

  return (
    <>
      <Hero />

      <Wrap>
        <Stats
          strip
          items={[
            { value: portfolios.length, label: "Portfolios this year" },
            { value: weeks, label: "Weeks of curriculum" },
            { value: papers.length, label: `Papers published in ${paperYear?.config.year ?? "our last year"}` },
            { value: partners.length, label: "Industry partners" },
          ]}
        />
      </Wrap>

      <Section>
        <Split
          title="Rigorous Research. Real Portfolios."
          lede={
            <p>
              Our members build live quantitative strategies across equities, rates, credit,
              options, and energy, and publish what they find.
            </p>
          }
          cta={<Button href="/portfolios">Explore the Portfolios</Button>}
        />
      </Section>

      {paperYear && (
        <section className="cs-research" aria-labelledby="papers-title">
          <Wrap>
            <div className="cs-research__head cs-reveal">
              <div>
                <h2 id="papers-title" className="cs-h2">
                  Research, Written Up.
                </h2>
                <p>
                  Every project team publishes a paper on the strategy it built.
                  {winner && ` The ${paperYear.config.year} winner was ${winner}.`}
                </p>
              </div>
              <Link href="/competition" className="cs-link whitespace-nowrap">
                Explore the Papers
              </Link>
            </div>
            <ResearchList papers={papers} />
          </Wrap>
        </section>
      )}

      <Section>
        <Split
          title="Learning and Building. All Year."
          lede={
            <p>
              Members build their portfolio&apos;s strategy alongside the curriculum, so every
              lesson has somewhere to go. Two tracks: trading and development.
            </p>
          }
          cta={<Button href="/education">Explore the Curriculum</Button>}
        />
        <Stats
          large
          items={[
            { value: weeks, label: "Weeks of curriculum" },
            { value: 2, label: "Tracks: trading and development" },
            { value: portfolios.length, label: "Live portfolios" },
          ]}
        />
      </Section>

      <div className="cs-section">
        <ListPanel
          title={
            <>
              This Year&apos;s
              <br />
              Portfolios
            </>
          }
          intro={<p>{portfolios.length} desks for 2026–2027, each with its own thesis, data, and tooling.</p>}
          items={portfolios.map((p) => ({
            href: `/portfolios#${p.slug}`,
            title: p.title,
            byline: p.tech.slice(0, 2),
          }))}
        />
      </div>

      <Section label="Partners">
        <h2 className="cs-h2 cs-reveal">Our Partners</h2>
        <PartnerLogos partners={partners} />
      </Section>

      <section className="cs-band cs-band--flat cs-band--texture on-blue" aria-labelledby="partners-title">
        <PricePaths />
        <Wrap>
          <div className="cs-grid cs-split cs-reveal">
            <h2 id="partners-title" className="cs-h2 cs-h2--on-blue">
              Partner With QUANTT.
            </h2>
            <div>
              <p className="cs-lede">
                {partners.map((p) => p.name).join(", ")} work with QUANTT. We are looking for
                partners for the coming year.
              </p>
              <Button href="/partners" variant="accent" className="mt-8">
                Explore Partnerships
              </Button>
            </div>
          </div>
        </Wrap>
      </section>

      <UpcomingEvents />
    </>
  );
}
