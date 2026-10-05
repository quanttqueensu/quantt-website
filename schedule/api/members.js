// Members: list (names only), add, remove. Calendar links never leave the server.
import { authorized, json, loadMembers, saveMembers, validFeedUrl, newId } from "./_lib.js";

const publicView = (m) => ({ id: m.id, name: m.name });

export async function GET(request) {
  if (!authorized(request)) return json({ error: "Wrong password" }, 401);
  const members = await loadMembers();
  return json({ members: members.map(publicView) });
}

export async function POST(request) {
  if (!authorized(request)) return json({ error: "Wrong password" }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Send a name and a calendar link." }, 400); }
  const items = Array.isArray(body?.members) ? body.members : [body];
  const members = await loadMembers();
  const added = [];
  for (const item of items) {
    const name = String(item?.name || "").trim().slice(0, 80);
    const url = validFeedUrl(item?.url);
    if (!name) return json({ error: "Enter a name." }, 400);
    if (!url) return json({ error: "Use a Queen's timetable or Outlook calendar link (https://…)." }, 400);
    const existing = members.find((m) => m.url === url);
    if (existing) { existing.name = name; added.push(existing); continue; }
    const m = { id: newId(), name, url, added: new Date().toISOString() };
    members.push(m);
    added.push(m);
  }
  members.sort((a, b) => a.name.localeCompare(b.name));
  await saveMembers(members);
  return json({ added: added.map(publicView) }, 201);
}

export async function DELETE(request) {
  if (!authorized(request)) return json({ error: "Wrong password" }, 401);
  const id = new URL(request.url).searchParams.get("id");
  const members = await loadMembers();
  const next = members.filter((m) => m.id !== id);
  if (next.length === members.length) return json({ error: "Member not found." }, 404);
  await saveMembers(next);
  return json({ removed: id });
}
