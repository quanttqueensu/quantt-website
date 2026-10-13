import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/* ---------- Buttons & arrows ---------- */

type ButtonVariant = "blue" | "cyan";

/** Pill CTA. Blue on white/grey surfaces, cyan on blue. One per text block. */
export function Button({
  href,
  children,
  variant = "blue",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  const classes = `cs-btn cs-btn--${variant} ${className}`;
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  const external = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && <span className="sr-only"> (opens in new tab)</span>}
    </a>
  );
}

/** 40px outlined circle with a thin right arrow. Fills cyan when its row is hovered. */
export function ArrowCircle({ className = "" }: { className?: string }) {
  return (
    <span className={`cs-arrow ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 25">
        <path d="M20.707 12.6875L14.3535 6.33391L13.6464 7.04101L18.7928 12.1874L3.99989 12.1874V13.1874L18.7929 13.1874L13.6464 18.3339L14.3535 19.041L20.707 12.6875Z" />
      </svg>
    </span>
  );
}

/* ---------- Layout ---------- */

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`cs-wrap ${className}`}>{children}</div>;
}

/** Headline in columns 1–11, lede + optional CTA from column 13. */
export function Split({
  title,
  lede,
  cta,
  as: Heading = "h2",
  onBlue = false,
  className = "",
}: {
  title: ReactNode;
  lede?: ReactNode;
  cta?: ReactNode;
  as?: "h1" | "h2";
  onBlue?: boolean;
  className?: string;
}) {
  return (
    <div className={`cs-grid cs-split cs-reveal ${className}`}>
      <Heading className={`cs-h2 ${onBlue ? "cs-h2--on-blue" : ""}`}>{title}</Heading>
      <div>
        {lede && <div className="cs-lede">{lede}</div>}
        {cta}
      </div>
    </div>
  );
}

/** First block of every inner page: the page's H1 as a split, optional stats and media. */
export function PageIntro({
  title,
  lede,
  cta,
  children,
}: {
  title: string;
  lede?: ReactNode;
  cta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="cs-intro">
      <Wrap>
        <Split as="h1" title={title} lede={lede} cta={cta} />
        {children}
      </Wrap>
    </section>
  );
}

/** A white section with the standard top rhythm. */
export function Section({
  children,
  id,
  label,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  label?: string;
  className?: string;
}) {
  return (
    <section id={id} aria-label={label} className={`cs-section scroll-mt-28 ${className}`}>
      <Wrap>{children}</Wrap>
    </section>
  );
}

/* ---------- Stats ---------- */

export interface StatItem {
  value: ReactNode;
  /** Small superscript suffix or prefix, e.g. "+", "%". */
  sup?: string;
  label: string;
}

/** Big blue figures in columns separated by hairline rules. Only real numbers. */
export function Stats({ items, large = false }: { items: StatItem[]; large?: boolean }) {
  return (
    <dl
      className={`cs-stats ${large ? "cs-stats--lg" : ""}`}
      style={{ "--cols": items.length } as CSSProperties}
    >
      {items.map((item) => (
        <div key={item.label} className="cs-stat flex flex-col-reverse justify-end">
          <dt className="cs-stat__label">{item.label}</dt>
          <dd className="cs-stat__num">
            {item.value}
            {item.sup && <sup>{item.sup}</sup>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Lists ---------- */

export interface ListItem {
  href: string;
  title: string;
  byline?: string[];
  external?: boolean;
  label?: string;
}

/** Grey inset panel: intro on the left, linked rows with arrow circles on the right. */
export function ListPanel({
  title,
  intro,
  items,
  children,
}: {
  title: ReactNode;
  intro?: ReactNode;
  items?: ListItem[];
  children?: ReactNode;
}) {
  return (
    <Wrap>
      <section className="cs-panel cs-reveal">
        <div className="cs-panel__intro">
          <h2 className="cs-h2 cs-h2--md">{title}</h2>
          {intro && <div className="mt-12 text-lg leading-7 text-ink">{intro}</div>}
        </div>
        {items ? <List items={items} /> : children}
      </section>
    </Wrap>
  );
}

export function List({ items }: { items: ListItem[] }) {
  return (
    <ul className="cs-list">
      {items.map((item) => {
        const inner = (
          <>
            {item.byline && item.byline.length > 0 && (
              <div className="cs-byline">
                {item.byline.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            )}
            <div>
              <h3>{item.title}</h3>
            </div>
            <ArrowCircle />
          </>
        );
        return (
          <li key={item.href + item.title}>
            {item.external ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                {inner}
              </a>
            ) : (
              <Link href={item.href} aria-label={item.label}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
