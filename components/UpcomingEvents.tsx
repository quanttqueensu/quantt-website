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
          <span className="text-blue-mid">Coming Up</span>
        </SectionLabel>
        <h2 className="mt-2 font-heading text-2xl font-bold text-text-dark">
          Upcoming Events
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={`${event.date}-${event.title}`}
              className="rounded-lg border border-white/30 bg-white/35 p-5 backdrop-blur-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-mid">
                {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <h3 className="mt-1.5 text-sm font-semibold text-text-dark">{event.title}</h3>
              <p className="mt-1 text-xs text-text-dark-body">
                {event.location} &middot; {event.time}
              </p>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
