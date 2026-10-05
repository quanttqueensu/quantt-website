# QUANTT Schedule

Team availability for calendar.quantt.ca. One Mon–Sun week, 8 AM–10 PM in half hours, built from each member's class-schedule calendar link (Queen's timetable or Outlook `.ics`). Darker blue means more people are in class; click a slot to see who is free and who is busy.

This folder is a standalone Cloudflare Worker (`quantt-calendar`) with static assets and does not touch the main website.

## How it works
- `public/index.html` is the whole front end (no build step).
- `src/worker.js` sends `/api/*` to the handlers below and serves everything else from `public/`.
- `src/api/busy.js` fetches every member's calendar on the server, expands the recurring classes for the requested week, and returns only names and class titles per half hour. Feeds are cached at the edge for 15 minutes; the reload button in the header bypasses the cache.
- `src/api/members.js` lists, adds and removes members. Calendar links are stored in a Cloudflare KV namespace and are never sent to the browser or committed to this repo.
- Every API call needs a password (`x-schedule-key` header). The team password can view; the admin password can also add calendars (by link or by uploading an `.ics` file, stored in KV) and remove them. The sign-in screen accepts either.
- Admins can import the club's contacts export (Google Contacts CSV) from the sidebar. Members are renamed to their contact name and grouped by team: Co-Chairs, Quant Trading (the CIO, then each PM's team), Research & Dev (Quant Research under the COO, Quant Development under the CTO) and Operations & Marketing (under the CMO). Leads are listed first, and people without a calendar yet show greyed out. Only names, teams and lead flags are kept, in KV; nothing else from the file is stored.

## Cloudflare Worker setup
1. Workers & Pages → Create → Import a repository → `quanttqueensu/quantt-website`, **root directory `/schedule`**, deploy command `npx wrangler deploy`. The Worker name, assets and KV binding come from `wrangler.toml`.
2. Settings → Variables and Secrets: add `SCHEDULE_PASSWORD` (team password, view only) and `ADMIN_PASSWORD` (can add and remove calendars) as secrets.
3. The `SCHEDULE_KV` namespace has no id in `wrangler.toml`, so `wrangler deploy` creates it in the Worker's account on the first deploy and reuses it after that.
4. Settings → Domains & Routes → add custom domain `calendar.quantt.ca`.
5. Once this is merged, set the production branch to `main`.

## Local development
```
npx wrangler dev
```
with a `.dev.vars` file containing `SCHEDULE_PASSWORD=...` and `ADMIN_PASSWORD=...`.

## Limits
- Recurring events with weekly or daily rules are expanded (including `UNTIL`, `COUNT`, `EXDATE`). Monthly and yearly rules show only their first occurrence.
- Cloudflare's free plan allows 50 outbound requests per call, so the free plan supports up to about 50 calendars.
