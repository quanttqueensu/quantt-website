// Password check for the sign-in screen.
import { authorized, json } from "../../lib/core.js";

export async function onRequestPost({ request, env }) {
  return authorized(request, env) ? json({ ok: true }) : json({ error: "Wrong password" }, 401);
}
