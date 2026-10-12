// The shared member directory: one record per QUANTT member, used by every site to know who a signed-in email is.
// Stored in KV (binding MEMBERS_KV, key "directory"): { members: [{ id, name, team, lead, emails: [...], roles: { calendar: "ops" } }], updated }.
// Only names, teams and email addresses are kept from the contacts file; phone and student numbers are dropped.
import { rosterFromContacts, contactEmails, normName } from "../../schedule/src/core.js";
import { verify, teamUrl } from "./access.js";

const KEY = "directory";
// Roles each site understands. A member with no role on a site is a regular member there.
export const APPS = { calendar: ["ops", "admin"], directory: ["admin"] };

export async function load(env) {
  const d = await env.MEMBERS_KV.get(KEY, "json");
  return d && Array.isArray(d.members) ? d : { members: [], updated: null };
}
const save = (env, d) => env.MEMBERS_KV.put(KEY, JSON.stringify({ ...d, updated: new Date().toISOString() }));

const split = (v) => String(v || "").split(",").map((x) => x.trim()).filter(Boolean);
const list = (v) => split(v).map((x) => x.toLowerCase());
const newId = () => "m_" + crypto.randomUUID().replace(/-/g, "").slice(0, 12);

// ADMIN_EMAILS: people who are admin everywhere, even before the first import.
function withRoles(env, m, email) {
  if (!list(env.ADMIN_EMAILS).includes(email)) return m;
  return { ...m, roles: Object.fromEntries(Object.keys(APPS).map((a) => [a, "admin"])) };
}

// Who a signed-in email belongs to: { id, name, email, team, lead, roles } for a member, { email } for anyone else.
export async function lookup(env, email) {
  email = String(email || "").toLowerCase();
  const m = (await load(env)).members.find((x) => x.emails.includes(email));
  if (m) return withRoles(env, { id: m.id, name: m.name, email, team: m.team || null, lead: !!m.lead, roles: m.roles || {} }, email);
  return list(env.ADMIN_EMAILS).includes(email) ? withRoles(env, { id: `admin:${email}`, name: null, email, team: null, lead: false, roles: {} }, email) : { email };
}

// Checks a Cloudflare Access token from any QUANTT site and returns lookup() for its email, or null.
export async function whoami(env, token) {
  if (!env.ACCESS_TEAM) return null;
  const v = await verify(token, teamUrl(env.ACCESS_TEAM), split(env.ACCESS_AUDS));
  return v.email ? lookup(env, v.email) : null;
}

// Re-import from the Google Contacts export. A person keeps their id and roles when any of their addresses, or their name, matches.
export async function importContacts(env, csv) {
  const teams = new Map(rosterFromContacts(csv).map((p) => [normName(p.name), p]));
  const people = contactEmails(csv);
  if (!people.length) throw new Error("That file doesn't look like a contacts export.");
  const old = (await load(env)).members;
  const members = people.map((p) => {
    const prev = old.find((o) => o.emails.some((e) => p.emails.includes(e))) || old.find((o) => normName(o.name) === normName(p.name));
    const t = teams.get(normName(p.name)) || {};
    return { id: prev?.id || newId(), name: p.name, team: t.team || null, lead: !!t.lead, emails: p.emails, roles: prev?.roles || {} };
  });
  // Each address belongs to one person only.
  const seen = new Map();
  for (const m of members) m.emails = m.emails.filter((e) => !seen.has(e) && seen.set(e, m.id));
  members.sort((a, b) => a.name.localeCompare(b.name));
  await save(env, { members });
  return { members: members.length, emails: seen.size, removed: old.filter((o) => !members.some((m) => m.id === o.id)).map((o) => o.name) };
}

export async function setRole(env, id, app, role) {
  if (!APPS[app]) throw new Error("Unknown site.");
  if (role && !APPS[app].includes(role)) throw new Error("Unknown role.");
  const d = await load(env);
  const m = d.members.find((x) => x.id === id);
  if (!m) throw new Error("That member no longer exists.");
  m.roles = { ...(m.roles || {}) };
  if (role) m.roles[app] = role; else delete m.roles[app];
  await save(env, d);
  return m;
}
