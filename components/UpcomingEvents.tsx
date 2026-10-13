import { getEvents } from "@/lib/content";
import { ArrowCircle, Wrap } from "./ui";

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

/** Grey list panel of events. Rows with a URL link out; the rest are plain rows. */
export default function UpcomingEvents() {
  const events = getEvents();
  if (events.length === 0) return null;

  return (
    <div className="cs-section">
      <Wrap>
        <section className="cs-panel cs-reveal" aria-labelledby="events-title">
          <div className="cs-panel__intro">
            <h2 id="events-title" className="cs-h2 cs-h2--md">
              Upcoming Events
            </h2>
          </div>
          <ul className="cs-list">
            {events.map((e) => {
              const body = (
                <>
                  <div className="cs-byline">
                    <span>
                      <time dateTime={e.date}>{formatDate(e.date)}</time>, {e.time}
                    </span>
                    <span>{e.location}</span>
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                  </div>
                </>
              );
              return (
                <li key={`${e.date}-${e.title}`}>
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer">
                      {body}
                      <ArrowCircle />
                    </a>
                  ) : (
                    <div className="grid grid-cols-[1fr_auto] border-b border-line pb-10">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </Wrap>
    </div>
  );
}
