import type { Metadata } from "next";
import { Button, List, PageIntro, Split, Wrap } from "@/components/ui";
import { getSiteConfig, isRecruitingOpen } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — QUANTT",
  description: "Get in touch with the QUANTT team at Queen's University.",
};

// The recruiting message expires by date, so re-evaluate it daily.
export const revalidate = 86400;

const channels = [
  { href: "https://www.instagram.com/quanttqueens", title: "Instagram", note: "Recruiting and event announcements" },
  { href: "https://www.linkedin.com/company/quanttqueens/", title: "LinkedIn", note: "Club news and partner updates" },
  { href: "https://www.facebook.com/QUANTTpage", title: "Facebook", note: "Club page" },
  { href: "https://linktr.ee/quantt", title: "Linktree", note: "Every link in one place" },
];

export default function ContactPage() {
  const config = getSiteConfig();
  const recruiting = isRecruitingOpen(config);

  return (
    <>
      <PageIntro
        title="Talk to the Team."
        lede={<p>Students and partners: email reaches the executive team directly.</p>}
        cta={<Button href="mailto:quanttgroup@gmail.com">Email quanttgroup@gmail.com</Button>}
      />

      {recruiting && (
        <section className="cs-band cs-band--flat on-blue" aria-label="Recruiting">
          <Wrap>
            <Split
              onBlue
              title="Recruiting Now."
              lede={config.recruitingDetails && <p>{config.recruitingDetails}</p>}
              cta={
                config.recruitingUrl && (
                  <Button href={config.recruitingUrl} variant="cyan" className="mt-8">
                    Explore the Portfolios
                  </Button>
                )
              }
            />
          </Wrap>
        </section>
      )}

      <div className="cs-section">
        <Wrap>
          <section className="cs-panel cs-reveal" aria-labelledby="follow-title">
            <div className="cs-panel__intro">
              <h2 id="follow-title" className="cs-h2 cs-h2--md">
                Follow QUANTT
              </h2>
              <p>Announcements go out on these channels first.</p>
            </div>
            <List
              items={channels.map((c) => ({
                href: c.href,
                external: true,
                title: c.title,
                byline: [c.note],
                label: `${c.title}: ${c.note} (opens in new tab)`,
              }))}
            />
          </section>
        </Wrap>
      </div>
    </>
  );
}
