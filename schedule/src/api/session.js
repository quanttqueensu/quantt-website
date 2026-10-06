// Password check for the sign-in screen.
import { role, json } from "../core.js";

export async function onRequestPost({ request, env }) {
  const r = role(request, env);
  return r ? json({ ok: true, admin: r === "admin" }) : json({ error: "Wrong password" }, 401);
}
