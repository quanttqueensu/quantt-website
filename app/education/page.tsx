import type { Metadata } from "next";
import Accordion from "@/components/Accordion";
import MediaSlot from "@/components/MediaSlot";
import { Button, PageIntro, Stats, Wrap } from "@/components/ui";
import { getEducationChapters, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Curriculum — QUANTT",
  description:
    "Explore QUANTT's intensive 10-week curriculum covering quantitative trading, computational finance, and software engineering for quantitative research.",
};

function TopicList({ title, topics }: { title: string; topics: string[] }) {
  return (
    <div>
      <h4 className="text-base font-medium text-ink">{title}</h4>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-body marker:text-blue">
        {topics.map((topic, i) => (
          <li key={i}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}

const tracks = [
  {
    name: "Trading Track",
    focus: "Strategy and markets",
    body: "Market inefficiencies, hypothesis generation, strategy design, options theory, volatility models, post-earnings announcement drift, and portfolio risk.",
  },
  {
    name: "Development Track",
    focus: "Data and engineering",
    body: "Python and pandas, data cleaning, regression, time-series stationarity, backtesting engines, numerical methods, and market APIs.",
  },
];

export default function EducationPage() {
  const chapters = getEducationChapters();
  const { media } = getSiteConfig();
  const dualTrackWeeks = chapters.filter((ch) => ch.trading_track || ch.development_track).length;

  const items = chapters.map((ch) => ({
    title: `Week ${ch.chapter}. ${ch.title}`,
    content: (
      <div className="grid gap-8 md:grid-cols-2">
        {ch.body && <p className="max-w-[65ch] text-base text-body md:col-span-2">{ch.body}</p>}
        {ch.trading_track?.length ? <TopicList title="Trading track" topics={ch.trading_track} /> : null}
        {ch.development_track?.length ? (
          <TopicList title="Development track" topics={ch.development_track} />
        ) : null}
        {!ch.trading_track && !ch.development_track && ch.topics?.length ? (
          <TopicList title="Foundations" topics={ch.topics} />
        ) : null}
      </div>
    ),
  }));

  return (
    <>
      <PageIntro
        title="Ten Weeks. Two Tracks."
        lede={
          <p>
            From core market concepts to production-quality quantitative software, taught
            alongside the portfolio work members do all year.
          </p>
        }
        cta={<Button href="#weeks">Explore Every Week</Button>}
      >
        <MediaSlot
          src={media?.education}
          alt="Aerial view of Queen's University campus in Kingston"
          className="cs-intro__media"
          sizes="(max-width: 1440px) 100vw, 1328px"
        />
        <Stats
          items={[
            { value: chapters.length, label: "Weeks" },
            { value: 2, label: "Tracks" },
            { value: chapters.length - dualTrackWeeks, label: "Shared foundation weeks" },
            { value: dualTrackWeeks, label: "Weeks split by track" },
          ]}
        />
      </PageIntro>

      <section aria-label="Tracks" className="cs-section">
        <Wrap>
          {tracks.map((t) => (
            <div key={t.name} className="cs-row cs-grid cs-split cs-reveal">
              <div>
                <h2 className="cs-row__title">{t.name}</h2>
                <p className="cs-meta mt-2 text-meta">{t.focus}</p>
              </div>
              <p className="cs-lede">{t.body}</p>
            </div>
          ))}
        </Wrap>
      </section>

      <section id="weeks" aria-labelledby="weeks-title" className="cs-section scroll-mt-28">
        <Wrap>
          <h2 id="weeks-title" className="cs-h2 cs-reveal mb-12">
            Week by Week.
          </h2>
          {items.length > 0 ? (
            <Accordion items={items} />
          ) : (
            <p className="cs-lede">The week-by-week plan is published before the curriculum starts.</p>
          )}
        </Wrap>
      </section>
    </>
  );
}
