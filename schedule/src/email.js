// New form submissions arrive by email (Power Automate → Cloudflare Email Routing → this Worker).
// Subject: "<team password> | <name> | <calendar link>"
import { addMembers } from "./core.js";

// Decodes RFC 2047 encoded words (=?utf-8?B?…?= / =?utf-8?Q?…?=) so accented names survive.
export function decodeHeader(value) {
  return String(value || "")
    .replace(/\r?\n[ \t]+/g, " ")
    .replace(/\?=\s+=\?/g, "?==?")
    .replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g, (_, charset, enc, text) => {
      const bytes = enc.toUpperCase() === "B"
        ? Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
        : Uint8Array.from(
            text.replace(/_/g, " ").replace(/=([0-9A-Fa-f]{2})/g, (_m, h) => String.fromCharCode(parseInt(h, 16))),
            (c) => c.charCodeAt(0),
          );
      try { return new TextDecoder(charset).decode(bytes); } catch { return new TextDecoder().decode(bytes); }
    });
}

export function parseSubmission(subject, password) {
  const parts = decodeHeader(subject).split("|").map((s) => s.trim());
  if (parts.length < 3 || !password || parts[0] !== password) return null;
  return { name: parts[1], url: parts.slice(2).join("|") };
}

export async function handleEmail(message, env) {
  const item = parseSubmission(message.headers.get("subject"), env.SCHEDULE_PASSWORD);
  if (!item) { message.setReject("Not a calendar submission"); return; }
  const { error } = await addMembers(env, [item]);
  if (error) message.setReject(error);
}
