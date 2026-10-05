// Cloudflare Worker entry: /api/* goes to the handlers, everything else is a static file from public/.
import * as members from "./api/members.js";
import * as busy from "./api/busy.js";
import * as session from "./api/session.js";
import * as roster from "./api/roster.js";

const routes = { "/api/members": members, "/api/busy": busy, "/api/session": session, "/api/roster": roster };
const METHOD = { GET: "onRequestGet", POST: "onRequestPost", DELETE: "onRequestDelete" };

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const mod = routes[pathname];
    if (mod) {
      const handler = mod[METHOD[request.method]];
      if (!handler) return new Response("Method not allowed", { status: 405 });
      return handler({ request, env });
    }
    if (pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
