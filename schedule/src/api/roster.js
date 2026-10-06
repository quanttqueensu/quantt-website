// Team roster: an admin uploads the contacts CSV; members are renamed to their contact name and grouped by team.
import { authorized, isAdmin, json, loadMembers, saveMembers, rosterFromContacts, saveRoster, findInRoster } from "../core.js";

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ error: "Wrong password" }, 401);
  if (!isAdmin(request, env)) return json({ error: "Only admins can change calendars." }, 403);
  const body = await request.json().catch(() => null);
  const roster = rosterFromContacts(body?.csv || "");
  if (!roster.length) return json({ error: "That file doesn't look like a contacts export." }, 400);
  await saveRoster(env, roster);
  const members = await loadMembers(env);
  const unmatched = [];
  for (const m of members) {
    const person = findInRoster(roster, m.name);
    if (person) { m.name = person.name; m.team = person.team; } else { m.team = null; unmatched.push(m.name); }
  }
  members.sort((a, b) => a.name.localeCompare(b.name));
  await saveMembers(env, members);
  return json({ matched: members.length - unmatched.length, unmatched });
}
