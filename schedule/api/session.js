// Password check for the sign-in screen.
import { authorized, json } from "./_lib.js";

export async function POST(request) {
  return authorized(request) ? json({ ok: true }) : json({ error: "Wrong password" }, 401);
}
