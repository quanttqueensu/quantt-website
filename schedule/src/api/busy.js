// Busy grid for one week: for each member, the class (if any) in every half hour, 8 AM to 10 PM Toronto time.
import { authorized, json, loadMembers, fetchFeed, parseICS, busyGrid, parseWeek, icsKey } from "../core.js";

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ error: "Wrong password" }, 401);
  const params = new URL(request.url).searchParams;
  const monday = parseWeek(params.get("week"));
  const fresh = params.get("fresh") === "1";
  const members = await loadMembers(env);
  const results = await Promise.all(members.map(async (m) => {
    try {
      const text = m.file ? await env.SCHEDULE_KV.get(icsKey(m.id)) : await fetchFeed(m.url, fresh);
      if (!text) throw new Error("missing calendar");
      const events = parseICS(text);
      return { id: m.id, name: m.name, team: m.team || null, ok: true, busy: busyGrid(events, monday) };
    } catch {
      return { id: m.id, name: m.name, team: m.team || null, ok: false, busy: null };
    }
  }));
  const d = new Date(monday * 86400000);
  return json({ week: d.toISOString().slice(0, 10), members: results });
}
