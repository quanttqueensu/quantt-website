import { getEvents } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import ScrollReveal from "./ScrollReveal";

export default function UpcomingEvents() {
  const events = getEvents();
  if (events.length === 0) return null;

  return (
    <ScrollReveal>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionLabel>
          <span className="g-muted">Coming Up</span>
        </SectionLabel>
        <h2 className="mt-2 font-heading text-2xl font-bold g-heading">
          Upcoming Events
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {events.map((event) => {
            const Card = (
              <>
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-text-dark">{event.title}</h3>
                <p className="mt-1 text-xs text-text-dark-body">
                  {event.location} &middot; {event.time}
                </p>
              </>
            );
            return event.url ? (
              <a
                key={`${event.date}-${event.title}`}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-text-dark/10 bg-white/30 p-5 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
              >
                {Card}
              </a>
            ) : (
              <div
                key={`${event.date}-${event.title}`}
                className="rounded-lg border border-text-dark/10 bg-white/30 p-5 backdrop-blur-sm"
              >
                {Card}
              </div>
            );
          })}
        </div>
      </section>
    </ScrollReveal>
  );
}
