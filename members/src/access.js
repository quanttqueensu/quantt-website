// Cloudflare Access sign-in: checks the token Access adds to every request and returns the viewer's email.
// Same check as strategy.quantt.ca (quantt_strategies functions/_lib/access.js), plus optional audience tags.

let certCache = { at: 0, team: "", keys: null };

function b64url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(s + "=".repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));
}

function cookie(request, name) {
  const m = (request.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

// ACCESS_TEAM may be given as "team", "team.cloudflareaccess.com" or the full https URL.
export function teamUrl(v) {
  let t = String(v).trim().toLowerCase().replace(/\/+$/, "");
  if (!t.includes(".")) t += ".cloudflareaccess.com";
  return t.startsWith("https://") ? t : "https://" + t.replace(/^http:\/\//, "");
}

export const requestToken = (request) => request.headers.get("cf-access-jwt-assertion") || cookie(request, "CF_Authorization") || "";

// Returns { email } for a valid Access token from `team` (and, when `auds` is non-empty, for one of those applications), otherwise { reason }.
export async function verify(token, team, auds = []) {
  if (!token) return { reason: "no Access token on the request" };
  const [h, p, s] = token.split(".");
  if (!s) return { reason: "malformed Access token" };
  let header, payload;
  try {
    header = JSON.parse(new TextDecoder().decode(b64url(h)));
    payload = JSON.parse(new TextDecoder().decode(b64url(p)));
  } catch {
    return { reason: "malformed Access token" };
  }
  if (payload.iss !== team) return { reason: `token issuer ${payload.iss} does not match ACCESS_TEAM ${team}` };
  if (!payload.exp || payload.exp * 1000 < Date.now()) return { reason: "Access token expired" };
  if (auds.length && ![].concat(payload.aud || []).some((a) => auds.includes(a))) return { reason: "token is for another Access application" };

  if (!certCache.keys || certCache.team !== team || Date.now() - certCache.at > 3_600_000) {
    const r = await fetch(`${team}/cdn-cgi/access/certs`);
    if (!r.ok) throw new Error(`Access certs: HTTP ${r.status}`);
    certCache = { at: Date.now(), team, keys: (await r.json()).keys };
  }
  const jwk = certCache.keys.find((k) => k.kid === header.kid);
  if (!jwk) return { reason: "token signing key not found for this team" };
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(s), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) return { reason: "token signature invalid" };
  if (!payload.email) return { reason: "token has no email" };
  return { email: String(payload.email).toLowerCase() };
}
