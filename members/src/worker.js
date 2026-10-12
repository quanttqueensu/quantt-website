// quantt-members: the shared member directory behind QUANTT's Cloudflare Access sign-in.
// Other Workers ask it who is signed in through the RPC entrypoint Directory (service binding, never reachable over HTTP).
// members.quantt.ca (behind Access) serves the admin page: import the contacts file and set each member's role per site.
import { WorkerEntrypoint } from "cloudflare:workers";
import { whoami, load, importContacts, setRole, APPS } from "./directory.js";
import { requestToken } from "./access.js";

export class Directory extends WorkerEntrypoint {
  // token: the caller's Cloudflare Access token (Cf-Access-Jwt-Assertion). Returns { id, name, email, team, lead, roles }, { email } or null.
  async whoami(token) { return whoami(this.env, token); }
}

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    let me;
    try { me = await whoami(env, requestToken(request)); }
    catch { return json({ error: "Couldn't check your sign-in. Try again." }, 503); }
    if (!me) return json({ error: "Sign in again." }, 401);
    if (pathname === "/api/me") return json(me);
    if (me.roles?.directory !== "admin") return json({ error: "Only directory admins can see this." }, 403);
    try {
      if (pathname === "/api/members" && request.method === "GET") { const d = await load(env); return json({ ...d, apps: APPS }); }
      const body = await request.json().catch(() => ({}));
      if (pathname === "/api/import" && request.method === "POST") return json(await importContacts(env, body.csv || ""));
      if (pathname === "/api/role" && request.method === "POST") return json(await setRole(env, body.id, body.app, body.role || ""));
    } catch (e) { return json({ error: e.message || "Something went wrong." }, 400); }
    return json({ error: "Not found" }, 404);
  },
};
