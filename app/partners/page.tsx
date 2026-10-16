import type { Metadata } from "next";
import PartnerCard from "@/components/PartnerCard";
import { Button, PageIntro, Split, Stats, Wrap } from "@/components/ui";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners — QUANTT",
  description:
    "QUANTT partners with leading financial institutions to provide real-world quantitative finance experience.",
};

export default function PartnersPage() {
  const partners = getPartners();

  return (
    <>
      <PageIntro
        title="The Firms We Work With."
        lede={
          <p>
            Institutions that partner with QUANTT meet students who research, build, and trade
            real strategies.
          </p>
        }
        cta={<Button href="mailto:quanttgroup@gmail.com">Become a Partner</Button>}
      >
        <Stats
          items={[
            { value: partners.current.length, label: "Current partners" },
            ...(partners.past.length ? [{ value: partners.past.length, label: "Past partners" }] : []),
          ]}
        />
      </PageIntro>

      <section aria-labelledby="current-title" className="cs-section">
        <Wrap>
          <h2 id="current-title" className="cs-h2 cs-h2--md cs-reveal mb-12">
            Current Partners
          </h2>
          <ul className="cs-logos cs-reveal">
            {partners.current.map((p) => (
              <PartnerCard key={p.name} partner={p} />
            ))}
          </ul>
        </Wrap>
      </section>

      <section className="cs-band cs-band--flat on-blue" aria-labelledby="partner-cta">
        <Wrap>
          <Split
            onBlue
            title={<span id="partner-cta">Partner With Us for 2026–2027.</span>}
            lede={<p>Tell us what your team works on and what you would want from our members.</p>}
            cta={
              <Button href="mailto:quanttgroup@gmail.com" variant="accent" className="mt-8">
                Email the Team
              </Button>
            }
          />
        </Wrap>
      </section>

      {partners.past.length > 0 && (
        <section aria-labelledby="past-title" className="cs-section">
          <Wrap>
            <h2 id="past-title" className="cs-h2 cs-h2--md cs-reveal mb-12">
              Past Partners
            </h2>
            <ul className="cs-logos cs-reveal">
              {partners.past.map((p) => (
                <PartnerCard key={p.name} partner={p} past />
              ))}
            </ul>
          </Wrap>
        </section>
      )}
    </>
  );
}
