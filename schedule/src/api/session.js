// Who is signed in. With Cloudflare Access: the person's email, contacts name and role. With the shared passwords: which login was used.
import { currentUser, accessMode, json } from "../core.js";

function answer(request, env) {
  const who = currentUser(request);
  if (who && !who.role) return json({ error: `${who.email} isn't on the QUANTT team list.`, access: true, notMember: true, email: who.email }, 403);
  if (!who) return json({ error: accessMode(env) ? "Sign in again." : "Wrong password", access: accessMode(env) }, 401);
  return json({ ok: true, access: who.via === "access", role: who.role, admin: who.role === "admin", name: who.name ?? null, email: who.email ?? null });
}

export const onRequestGet = ({ request, env }) => answer(request, env);
export const onRequestPost = ({ request, env }) => answer(request, env);
