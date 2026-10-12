# QUANTT Members

The shared member directory for every QUANTT site. Members sign in once with Cloudflare Access (one-time code by email, or Google/Microsoft), and each site asks this Worker who that email belongs to. A member is one record with a stable id, name, team, every email address they use, and a role per site, so the same person is the same identity everywhere.

## How it works
- `src/directory.js` keeps the directory in KV (`MEMBERS_KV`, key `directory`). Only names, teams and email addresses are kept from the contacts export; phone and student numbers are dropped.
- `src/worker.js` has two doors. Other Workers use the RPC entrypoint `Directory` through a service binding (`whoami(accessToken)` returns `{ id, name, email, team, lead, roles }`, or `{ email }` for someone not in the directory); it can't be reached over HTTP. members.quantt.ca serves the admin page.
- `src/access.js` checks the Cloudflare Access token: issuer `ACCESS_TEAM`, expiry, signature, and audience when `ACCESS_AUDS` is set.
- The admin page imports the Google Contacts CSV and sets each member's role per site (Calendar: Ops & Marketing or Admin; Directory: Admin). Re-importing keeps each person's id and roles when any of their addresses, or their name, still matches. People missing from the new file are removed.
- `ADMIN_EMAILS` (comma-separated) are admins everywhere, even before the first import.

Sites using it: calendar.quantt.ca (`../schedule`, binding `MEMBERS`).

## Cloudflare setup
1. Workers & Pages → Create → Import a repository → `quanttqueensu/quantt-website`, root directory `/members`, deploy command `npx wrangler deploy`. The KV namespace is created on the first deploy.
2. Zero Trust → Settings → Authentication → Login methods: One-time PIN on (Google or Azure AD optional).
3. Zero Trust → Access → Applications → Add → Self-hosted for `members.quantt.ca`, and one for each site that uses the directory (`calendar.quantt.ca`). Session duration 1 month. Policy Allow: emails ending in `@queensu.ca`. Copy each application's AUD tag.
4. Worker → Settings → Variables: `ACCESS_TEAM` (team name or `https://<team>.cloudflareaccess.com`), `ACCESS_AUDS` (the AUD tags, comma-separated), `ADMIN_EMAILS`.
5. Settings → Domains & Routes → custom domain `members.quantt.ca`.
6. Open members.quantt.ca, import the contacts CSV, and set roles.
