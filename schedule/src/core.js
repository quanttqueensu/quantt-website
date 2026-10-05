// Shared helpers for the schedule API: auth, member storage, ICS parsing.
// Runs in a Cloudflare Worker. Bindings: SCHEDULE_KV (KV namespace), SCHEDULE_PASSWORD (secret).

const STORE_KEY = "members";
const ALLOWED_HOSTS = ["mytimetable.queensu.ca", "outlook.office365.com", "outlook.live.com", "calendar.google.com"];
const FEED_TTL_S = 15 * 60;

export const START_MIN = 8 * 60;
export const SLOT_MIN = 30;
export const SLOTS = 28; // 8:00 to 22:00

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export function authorized(request, env) {
  const expected = env.SCHEDULE_PASSWORD;
  if (!expected) return false;
  return request.headers.get("x-schedule-key") === expected;
}

/* ---------- member storage (Cloudflare KV, never sent to the browser) ---------- */

export async function loadMembers(env) {
  const data = await env.SCHEDULE_KV.get(STORE_KEY, "json");
  return Array.isArray(data) ? data : [];
}

export async function saveMembers(env, members) {
  await env.SCHEDULE_KV.put(STORE_KEY, JSON.stringify(members));
}

export function validFeedUrl(raw) {
  let url;
  try {
    url = new URL(String(raw).trim().replace(/^webcal:\/\//i, "https://"));
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.includes(url.hostname)) return null;
  return url.toString();
}

export const newId = () => Math.random().toString(36).slice(2, 10);

// Adds or renames members by calendar link. Returns { added } or { error }.
export async function addMembers(env, items) {
  const members = await loadMembers(env);
  const added = [];
  for (const item of items) {
    const name = String(item?.name || "").trim().slice(0, 80);
    const url = validFeedUrl(item?.url);
    if (!name) return { error: "Enter a name." };
    if (!url) return { error: "Use a Queen's timetable or Outlook calendar link (https://…)." };
    const existing = members.find((m) => m.url === url);
    if (existing) { existing.name = name; added.push(existing); continue; }
    const m = { id: newId(), name, url, added: new Date().toISOString() };
    members.push(m);
    added.push(m);
  }
  members.sort((a, b) => a.name.localeCompare(b.name));
  await saveMembers(env, members);
  return { added };
}

/* ---------- feed fetching (cached at the edge for 15 minutes) ---------- */

export async function fetchFeed(url, fresh = false) {
  const res = await fetch(url, {
    headers: { accept: "text/calendar" },
    signal: AbortSignal.timeout(10000),
    cf: fresh ? { cacheTtl: 0 } : { cacheTtl: FEED_TTL_S, cacheEverything: true },
  });
  const text = await res.text();
  if (!res.ok || !text.includes("BEGIN:VCALENDAR")) throw new Error("bad feed " + res.status);
  return text;
}

/* ---------- ICS parsing (wall-clock Toronto times; day numbers = days since epoch) ---------- */

const WD = { MO: 0, TU: 1, WE: 2, TH: 3, FR: 4, SA: 5, SU: 6 };
export const dayNum = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d) / 86400000);
const weekday = (n) => (((n + 3) % 7) + 7) % 7; // Mon = 0
const mondayOf = (n) => n - weekday(n);
const torontoFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto", hourCycle: "h23",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

function toToronto(date) {
  const p = Object.fromEntries(torontoFmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { day: dayNum(+p.year, +p.month, +p.day), min: +p.hour * 60 + +p.minute };
}

function parseDT(val, params) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(val.trim());
  if (!m) return null;
  const [, Y, Mo, D, h, mi, , z] = m;
  if (h === undefined) return { day: dayNum(+Y, +Mo, +D), min: 0, allDay: true };
  if (z || /TZID=(UTC|GMT|Etc\/UTC)/i.test(params)) return toToronto(new Date(Date.UTC(+Y, +Mo - 1, +D, +h, +mi)));
  return { day: dayNum(+Y, +Mo, +D), min: +h * 60 + +mi };
}

function unescapeText(v) {
  return v.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1").trim();
}

export function parseICS(text) {
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = { ex: new Set(), title: "Busy" }; continue; }
    if (line === "END:VEVENT") {
      if (cur && cur.start && cur.end && !cur.start.allDay && !cur.cancelled && !cur.transparent) events.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const [name, ...pp] = line.slice(0, i).split(";");
    const params = pp.join(";");
    const val = line.slice(i + 1);
    switch (name.toUpperCase()) {
      case "SUMMARY": cur.title = unescapeText(val) || "Busy"; break;
      case "DTSTART": cur.start = parseDT(val, params); break;
      case "DTEND": cur.end = parseDT(val, params); break;
      case "STATUS": if (/CANCELLED/i.test(val)) cur.cancelled = true; break;
      case "TRANSP": if (/TRANSPARENT/i.test(val)) cur.transparent = true; break;
      case "EXDATE":
        for (const v of val.split(",")) { const d = parseDT(v, params); if (d) cur.ex.add(d.day); }
        break;
      case "RRULE": {
        const r = Object.fromEntries(val.split(";").map((kv) => kv.split("=")));
        const until = r.UNTIL ? parseDT(r.UNTIL, "") : null;
        cur.rule = {
          freq: r.FREQ,
          interval: +(r.INTERVAL || 1),
          byday: r.BYDAY ? r.BYDAY.split(",").map((s) => WD[s.slice(-2)]).filter((x) => x !== undefined) : null,
          until: until ? until.day : Infinity,
          count: r.COUNT ? +r.COUNT : null,
        };
        break;
      }
    }
  }
  return events.map((e) => ({
    title: e.title,
    startDay: e.start.day,
    startMin: e.start.min,
    dur: Math.max(0, (e.end.day - e.start.day) * 1440 + e.end.min - e.start.min),
    rule: e.rule,
    ex: e.ex,
  }));
}

function matchesRule(e, d) {
  const r = e.rule;
  if (r.freq === "WEEKLY") {
    const days = r.byday && r.byday.length ? r.byday : [weekday(e.startDay)];
    return days.includes(weekday(d)) && Math.floor((mondayOf(d) - mondayOf(e.startDay)) / 7) % r.interval === 0;
  }
  if (r.freq === "DAILY") return (d - e.startDay) % r.interval === 0;
  return d === e.startDay; // monthly and yearly rules are not expanded
}

function occursOn(e, d) {
  if (d < e.startDay || e.ex.has(d)) return false;
  const r = e.rule;
  if (!r) return d === e.startDay;
  if (d > r.until || !matchesRule(e, d)) return false;
  if (r.count) {
    let n = 0;
    for (let x = e.startDay; x <= d && n <= r.count; x++) if (matchesRule(e, x)) n++;
    return n <= r.count;
  }
  return true;
}

// busy[day 0-6][slot 0-27] = event title or null, for the week starting at monday (day number)
export function busyGrid(events, monday) {
  const grid = [];
  for (let di = 0; di < 7; di++) {
    const d = monday + di;
    const spans = [];
    for (const e of events) {
      // events that start the previous day and run past midnight
      if (occursOn(e, d)) spans.push({ s: e.startMin, e: e.startMin + e.dur, t: e.title });
      if (e.startMin + e.dur > 1440 && occursOn(e, d - 1)) spans.push({ s: 0, e: e.startMin + e.dur - 1440, t: e.title });
    }
    const col = [];
    for (let si = 0; si < SLOTS; si++) {
      const a = START_MIN + si * SLOT_MIN;
      const b = a + SLOT_MIN;
      const hit = spans.find((x) => x.s < b && x.e > a);
      col.push(hit ? hit.t : null);
    }
    grid.push(col);
  }
  return grid;
}

export function parseWeek(param) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(param || "");
  const n = m ? dayNum(+m[1], +m[2], +m[3]) : toToronto(new Date()).day;
  return mondayOf(n);
}
