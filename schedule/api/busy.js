// Busy grid for one week: for each member, the class (if any) in every half hour, 8 AM to 10 PM Toronto time.
import { authorized, json, loadMembers, fetchFeed, parseICS, busyGrid, parseWeek } from "./_lib.js";

export async function GET(request) {
  if (!authorized(request)) return json({ error: "Wrong password" }, 401);
  const params = new URL(request.url).searchParams;
  const monday = parseWeek(params.get("week"));
  const fresh = params.get("fresh") === "1";
  const members = await loadMembers();
  const results = await Promise.all(members.map(async (m) => {
    try {
      const events = parseICS(await fetchFeed(m.url, fresh));
      return { id: m.id, name: m.name, ok: true, busy: busyGrid(events, monday) };
    } catch {
      return { id: m.id, name: m.name, ok: false, busy: null };
    }
  }));
  const d = new Date(monday * 86400000);
  return json({ week: d.toISOString().slice(0, 10), members: results });
}
