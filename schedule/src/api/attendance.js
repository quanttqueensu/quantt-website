// Attendance: with Cloudflare Access sign-in each person answers only for themselves (their email decides the name);
// with the shared passwords, anyone signed in answers for a name on the team list. Missing a required event takes an exemption request with a reason.
import { authorized, currentUser, json, normName } from "../core.js";
import { db, people, nowWall, rowToEvent, isInvited } from "../events.js";

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ error: "Wrong password" }, 401);
  const body = await request.json().catch(() => null);
  const status = body?.status;
  if (!["going", "cant", "clear"].includes(status)) return json({ error: "Choose whether you're going." }, 400);
  try {
    const DB = await db(env);
    const row0 = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(String(body?.eventId || "")).first();
    if (!row0) return json({ error: "That event no longer exists." }, 404);
    const ev = rowToEvent(row0);
    const who = currentUser(request);
    if (who.via === "access" && !who.name) return json({ error: `${who.email} isn't on the team list, so you can't respond. Ask an admin to add it to your contact.` }, 403);
    const asName = who.via === "access" ? who.name : body?.name;
    const person = (await people(env)).find((p) => normName(p.name) === normName(asName));
    if (!person) return json({ error: who.via === "access" ? `${who.name} isn't on the team list yet.` : "Pick your name from the team list." }, 400);
    if (!isInvited(ev, person)) return json({ error: `${person.name} isn't invited to this event.` }, 403);
    const name = person.name;
    if (status === "clear") {
      await DB.prepare("DELETE FROM responses WHERE event_id = ? AND name = ?").bind(ev.id, name).run();
      return json({ ok: true });
    }
    const reason = String(body?.reason || "").trim().slice(0, 1000);
    let row;
    if (status === "going") row = { status: "going", reason: "", review: null };
    else if (ev.mandatory) {
      if (reason.length < 3) return json({ error: "Give a reason for the exemption request." }, 400);
      row = { status: "exempt", reason, review: "pending" };
    } else row = { status: "no", reason, review: null };
    await DB.prepare(`INSERT INTO responses (event_id, name, status, reason, review, at) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (event_id, name) DO UPDATE SET status = excluded.status, reason = excluded.reason, review = excluded.review, at = excluded.at`)
      .bind(ev.id, name, row.status, row.reason, row.review, nowWall()).run();
    return json({ ok: true, name, ...row });
  } catch (e) { return json({ error: e.message || "Something went wrong." }, 500); }
}
