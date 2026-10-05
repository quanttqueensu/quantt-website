// Members: list (names only), add, remove. Calendar links never leave the server.
import { authorized, json, loadMembers, saveMembers, addMembers } from "../core.js";

const publicView = (m) => ({ id: m.id, name: m.name });
const denied = () => json({ error: "Wrong password" }, 401);

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return denied();
  const members = await loadMembers(env);
  return json({ members: members.map(publicView) });
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return denied();
  let body;
  try { body = await request.json(); } catch { return json({ error: "Send a name and a calendar link." }, 400); }
  const items = Array.isArray(body?.members) ? body.members : [body];
  const { added, error } = await addMembers(env, items);
  if (error) return json({ error }, 400);
  return json({ added: added.map(publicView) }, 201);
}

export async function onRequestDelete({ request, env }) {
  if (!authorized(request, env)) return denied();
  const id = new URL(request.url).searchParams.get("id");
  const members = await loadMembers(env);
  const next = members.filter((m) => m.id !== id);
  if (next.length === members.length) return json({ error: "Member not found." }, 404);
  await saveMembers(env, next);
  return json({ removed: id });
}
