// Events, attendance and reminder emails. Stored in D1 (binding DB); times are Toronto wall clock ("2026-10-15T18:00").
import { loadMembers, loadRoster, loadEmails, toToronto, dayNum, newId, normName } from "./core.js";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT NOT NULL, start TEXT NOT NULL, end TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '', mandatory INTEGER NOT NULL DEFAULT 1,
    reminders INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS events_start ON events (start)`,
  // status: going | exempt (asked to miss a required event) | no (can't go to an optional one). review: pending | approved | denied.
  `CREATE TABLE IF NOT EXISTS responses (event_id TEXT NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL,
    reason TEXT NOT NULL DEFAULT '', review TEXT, at TEXT NOT NULL, PRIMARY KEY (event_id, name))`,
  `CREATE TABLE IF NOT EXISTS reminders_sent (event_id TEXT NOT NULL, hours INTEGER NOT NULL, sent_at TEXT NOT NULL,
    recipients INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (event_id, hours))`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
];

let ready = null;
export function db(env) {
  if (!env.DB) throw new Error("The events database isn't connected yet.");
  ready ||= env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => { ready = null; throw e; });
  return ready.then(() => env.DB);
}

/* ---------- time ---------- */
const WALL = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
export const validWall = (s) => typeof s === "string" && WALL.test(s);
// Minutes since the epoch on the Toronto wall clock, so wall times compare and subtract directly.
export function wallMinutes(s) {
  const m = WALL.exec(s);
  return dayNum(+m[1], +m[2], +m[3]) * 1440 + +m[4] * 60 + +m[5];
}
export function nowWall() {
  const t = toToronto(new Date());
  const d = new Date(t.day * 86400000);
  return `${d.toISOString().slice(0, 10)}T${String(Math.floor(t.min / 60)).padStart(2, "0")}:${String(t.min % 60).padStart(2, "0")}`;
}

/* ---------- people (names from the contacts import and the calendars) ---------- */
export async function people(env) {
  const [roster, members] = await Promise.all([loadRoster(env), loadMembers(env)]);
  const seen = new Map();
  for (const p of [...roster, ...members]) if (p.name && !seen.has(normName(p.name))) seen.set(normName(p.name), { name: p.name, team: p.team || null });
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------- events ---------- */
const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export function cleanEvent(body) {
  const e = {
    title: clip(body?.title, 120),
    start: String(body?.start || ""),
    end: String(body?.end || ""),
    location: clip(body?.location, 160),
    description: clip(body?.description, 4000),
    mandatory: body?.mandatory === false ? 0 : 1,
    reminders: body?.reminders === false ? 0 : 1,
  };
  if (!e.title) return { error: "Give the event a title." };
  if (!validWall(e.start) || !validWall(e.end)) return { error: "Pick a date, start time and end time." };
  if (wallMinutes(e.end) <= wallMinutes(e.start)) return { error: "The event has to end after it starts." };
  return { event: e };
}

const rowToEvent = (r) => ({ ...r, mandatory: !!r.mandatory, reminders: !!r.reminders });

export async function listEvents(env, { from, to, id }) {
  const DB = await db(env);
  let rows;
  if (id) rows = (await DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).all()).results;
  else rows = (await DB.prepare("SELECT * FROM events WHERE start < ? AND end >= ? ORDER BY start LIMIT 200").bind(to, from).all()).results;
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const resp = (await DB.prepare(`SELECT * FROM responses WHERE event_id IN (${ids.map(() => "?").join(",")}) ORDER BY name`).bind(...ids).all()).results;
  const sent = (await DB.prepare(`SELECT * FROM reminders_sent WHERE event_id IN (${ids.map(() => "?").join(",")}) ORDER BY sent_at`).bind(...ids).all()).results;
  return rows.map((r) => ({
    ...rowToEvent(r),
    responses: resp.filter((x) => x.event_id === r.id).map(({ event_id, ...x }) => x),
    remindersSent: sent.filter((x) => x.event_id === r.id).map(({ event_id, ...x }) => x),
  }));
}

export async function saveEvent(env, id, e) {
  const DB = await db(env);
  const at = new Date().toISOString();
  if (!id) {
    id = newId();
    await DB.prepare(`INSERT INTO events (id, title, start, end, location, description, mandatory, reminders, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, e.title, e.start, e.end, e.location, e.description, e.mandatory, e.reminders, at, at).run();
    return id;
  }
  const old = await DB.prepare("SELECT start FROM events WHERE id = ?").bind(id).first();
  if (!old) return null;
  const stmts = [DB.prepare(`UPDATE events SET title = ?, start = ?, end = ?, location = ?, description = ?, mandatory = ?, reminders = ?, updated_at = ? WHERE id = ?`)
    .bind(e.title, e.start, e.end, e.location, e.description, e.mandatory, e.reminders, at, id)];
  // A moved event gets its reminders again, counted from the new time.
  if (old.start !== e.start) stmts.push(DB.prepare("DELETE FROM reminders_sent WHERE event_id = ?").bind(id));
  await DB.batch(stmts);
  return id;
}

export async function deleteEvent(env, id) {
  const DB = await db(env);
  const res = await DB.batch([
    DB.prepare("DELETE FROM events WHERE id = ?").bind(id),
    DB.prepare("DELETE FROM responses WHERE event_id = ?").bind(id),
    DB.prepare("DELETE FROM reminders_sent WHERE event_id = ?").bind(id),
  ]);
  return (res[0].meta?.changes ?? 0) > 0;
}

/* ---------- reminder settings ---------- */
export const REMINDER_CHOICES = [168, 72, 48, 24, 12, 4, 2, 1]; // hours before the event
export const NUDGE_CHOICES = [0, 1, 2, 3, 7]; // days between "please respond" emails; 0 = off
export const SEND_HOURS = [7, 8, 9, 10, 12, 15, 17, 18, 20]; // hour of day for "please respond" emails
// audience: "all" = everyone not excused; "pending" = only people who haven't responded yet.
const DEFAULT_REMINDERS = { enabled: true, hours: [72, 24, 2], audience: "all", nudgeDays: 0, nudgeHour: 9 };

export async function loadReminderSettings(env) {
  const DB = await db(env);
  const row = await DB.prepare("SELECT value FROM settings WHERE key = 'reminders'").first();
  try { return row ? { ...DEFAULT_REMINDERS, ...JSON.parse(row.value) } : DEFAULT_REMINDERS; } catch { return DEFAULT_REMINDERS; }
}

export async function saveReminderSettings(env, body) {
  const hours = [...new Set((Array.isArray(body?.hours) ? body.hours : []).map(Number).filter((h) => REMINDER_CHOICES.includes(h)))].sort((a, b) => b - a);
  const value = {
    enabled: !!body?.enabled,
    hours,
    audience: body?.audience === "pending" ? "pending" : "all",
    nudgeDays: NUDGE_CHOICES.includes(+body?.nudgeDays) ? +body.nudgeDays : 0,
    nudgeHour: SEND_HOURS.includes(+body?.nudgeHour) ? +body.nudgeHour : 9,
  };
  const DB = await db(env);
  await DB.prepare("INSERT INTO settings (key, value) VALUES ('reminders', ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value").bind(JSON.stringify(value)).run();
  return value;
}

/* ---------- reminder emails (Resend) ---------- */
export const emailReady = (env) => !!env.RESEND_API_KEY;
const appUrl = (env) => (env.APP_URL || "https://calendar.quantt.ca").replace(/\/$/, "");

// Everyone with an email on file, minus people who are excused or said they can't come.
// audience "pending" keeps only people who haven't responded at all.
export async function recipients(env, ev, audience = "all") {
  const [all, emails] = await Promise.all([people(env), loadEmails(env)]);
  const byNorm = new Map(Object.entries(emails).map(([n, e]) => [normName(n), e]));
  const out = new Set(ev.responses.filter((r) => r.status === "no" || (r.status === "exempt" && r.review !== "denied")).map((r) => normName(r.name)));
  const answered = new Set(ev.responses.map((r) => normName(r.name)));
  return all.filter((p) => !out.has(normName(p.name)) && byNorm.has(normName(p.name)) && (audience !== "pending" || !answered.has(normName(p.name)))).map((p) => ({ name: p.name, email: byNorm.get(normName(p.name)), response: ev.responses.find((r) => normName(r.name) === normName(p.name)) }));
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const clock = (s) => { const h = +s.slice(11, 13), m = s.slice(14, 16); return `${((h + 11) % 12) + 1}${m === "00" ? "" : ":" + m} ${h < 12 ? "AM" : "PM"}`; };
export function whenText(ev) {
  const [y, mo, d] = ev.start.slice(0, 10).split("-").map(Number);
  const wd = WEEKDAYS[(((dayNum(y, mo, d) + 3) % 7) + 7) % 7];
  const sameDay = ev.start.slice(0, 10) === ev.end.slice(0, 10);
  return `${wd}, ${MONTHS[mo - 1]} ${d}, ${clock(ev.start)} – ${sameDay ? clock(ev.end) : ev.end.slice(0, 10) + " " + clock(ev.end)}`;
}
// "today", "tomorrow" or "on Tuesday, October 20", from the actual time left rather than the reminder setting.
function leadText(ev) {
  const days = Math.floor(wallMinutes(ev.start) / 1440) - Math.floor(wallMinutes(nowWall()) / 1440);
  return days <= 0 ? `today at ${clock(ev.start)}` : days === 1 ? `tomorrow at ${clock(ev.start)}` : `on ${whenText(ev).split(",").slice(0, 2).join(",")}`;
}
const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function message(env, ev, person, nudge) {
  const link = `${appUrl(env)}/#event=${encodeURIComponent(ev.id)}`;
  const first = person.name.split(" ")[0];
  const going = person.response?.status === "going";
  const subject = nudge ? `Please respond: ${ev.title} ${leadText(ev)}` : `Reminder: ${ev.title} ${leadText(ev)}`;
  const ask = going ? "You're marked as going."
    : nudge ? `You haven't responded yet. ${ev.mandatory ? "Attendance is required, so if you can't make it, open the event and request an exemption with a reason." : "Let us know if you're coming."}`
    : ev.mandatory ? "Attendance is required. If you can't make it, open the event and request an exemption with a reason."
    : "Let us know if you're coming.";
  const lines = [`Hi ${first},`, "", `${ev.title}`, whenText(ev), ev.location ? `Location: ${ev.location}` : "", ev.description ? `\n${ev.description}` : "", "", ask, link, "", "QUANTT Operations & Marketing"].filter((l, i, a) => l !== "" || a[i - 1] !== "");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f1f1f;line-height:1.5">
<p>Hi ${escHtml(first)},</p>
<p style="font-size:18px;margin:0 0 4px"><b>${escHtml(ev.title)}</b></p>
<p style="margin:0">${escHtml(whenText(ev))}</p>
${ev.location ? `<p style="margin:0">${escHtml(ev.location)}</p>` : ""}
${ev.description ? `<p style="white-space:pre-line">${escHtml(ev.description)}</p>` : ""}
<p>${escHtml(ask)}</p>
<p><a href="${escHtml(link)}" style="display:inline-block;background:#0b57d0;color:#fff;text-decoration:none;padding:10px 20px;border-radius:20px">${going ? "View event" : ev.mandatory ? "Respond or request an exemption" : "Respond"}</a></p>
<p style="color:#747775;font-size:12px">QUANTT Operations &amp; Marketing</p></div>`;
  return { from: env.EMAIL_FROM || "QUANTT <events@quantt.ca>", to: [person.email], subject, text: lines.join("\n"), html, ...(env.EMAIL_REPLY_TO ? { reply_to: env.EMAIL_REPLY_TO } : {}) };
}

async function sendBatch(env, msgs) {
  for (let i = 0; i < msgs.length; i += 100) {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify(msgs.slice(i, i + 100)),
    });
    if (!res.ok) throw new Error(`The email service refused the reminder (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
}

// A sample reminder to one address, so Ops can check how the emails look.
export async function sendTest(env, to) {
  if (!emailReady(env)) throw new Error("Reminder emails aren't set up yet (RESEND_API_KEY is missing).");
  const t = wallMinutes(nowWall()) + 2 * 1440, d = new Date(Math.floor(t / 1440) * 86400000).toISOString().slice(0, 10);
  const ev = { id: "test", title: "Sample event", start: `${d}T18:00`, end: `${d}T19:00`, location: "Goodes Hall", description: "This is a test of QUANTT reminder emails.", mandatory: true, responses: [] };
  await sendBatch(env, [message(env, ev, { name: "there", email: to })]);
}

export async function sendReminder(env, ev, { audience = "all", nudge = false } = {}) {
  if (!emailReady(env)) throw new Error("Reminder emails aren't set up yet (RESEND_API_KEY is missing).");
  const list = await recipients(env, ev, nudge ? "pending" : audience);
  await sendBatch(env, list.map((p) => message(env, ev, p, nudge)));
  return list.length;
}

// Cron: for each upcoming event, send the closest reminder that is due and not sent yet; earlier missed ones are skipped.
export async function runReminders(env) {
  if (!env.DB || !emailReady(env)) return [];
  const settings = await loadReminderSettings(env);
  if (!settings.enabled) return [];
  const now = nowWall(), nowMin = wallMinutes(now);
  const maxH = Math.max(0, ...settings.hours);
  const days = Math.max(Math.ceil(maxH / 24) + 2, settings.nudgeDays ? 60 : 0);
  const horizon = new Date((Math.floor(nowMin / 1440) + days) * 86400000).toISOString().slice(0, 10);
  const events = (await listEvents(env, { from: now.slice(0, 10), to: horizon })).filter((e) => e.reminders && wallMinutes(e.start) > nowMin);
  const done = [];
  const DB = await db(env);
  for (const ev of events) {
    const startMin = wallMinutes(ev.start);
    const sent = new Set(ev.remindersSent.map((r) => r.hours));
    const due = settings.hours.filter((h) => startMin - h * 60 <= nowMin && !sent.has(h));
    if (!due.length) {
      const nudged = await nudge(env, DB, ev, settings, nowMin);
      if (nudged) done.push(nudged);
      continue;
    }
    const h = Math.min(...due);
    let n = 0;
    try { n = await sendReminder(env, ev, { audience: settings.audience }); } catch (e) { console.log("reminder failed", ev.id, e.message); continue; }
    const at = new Date().toISOString();
    await DB.batch(due.map((x) => DB.prepare("INSERT OR IGNORE INTO reminders_sent (event_id, hours, sent_at, recipients) VALUES (?, ?, ?, ?)").bind(ev.id, x, at, x === h ? n : 0)));
    done.push({ id: ev.id, hours: h, recipients: n });
  }
  return done;
}

// "Please respond" emails to people who haven't answered, every nudgeDays days at nudgeHour, counted from the event's creation.
// Stored in reminders_sent with hours = -(day number), one row per day sent. Skipped on the event's own day and within 20 hours of another reminder.
async function nudge(env, DB, ev, settings, nowMin) {
  if (!settings.nudgeDays) return null;
  const today = Math.floor(nowMin / 1440);
  if (nowMin % 1440 < settings.nudgeHour * 60 || Math.floor(wallMinutes(ev.start) / 1440) <= today) return null;
  const nudges = ev.remindersSent.filter((r) => r.hours < 0).map((r) => -r.hours);
  const created = Math.floor(Date.parse(ev.created_at) / 86400000);
  const last = nudges.length ? Math.max(...nudges) : created;
  if (today - last < settings.nudgeDays) return null;
  if (ev.remindersSent.some((r) => r.hours >= 0 && Date.now() - Date.parse(r.sent_at) < 20 * 3600 * 1000)) return null;
  let n = 0;
  try { n = await sendReminder(env, ev, { nudge: true }); } catch (e) { console.log("nudge failed", ev.id, e.message); return null; }
  await DB.prepare("INSERT OR IGNORE INTO reminders_sent (event_id, hours, sent_at, recipients) VALUES (?, ?, ?, ?)").bind(ev.id, -today, new Date().toISOString(), n).run();
  return { id: ev.id, nudge: true, recipients: n };
}
