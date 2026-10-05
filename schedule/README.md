# QUANTT Schedule

Team availability for schedule.quantt.ca. One Mon–Sun week, 8 AM–10 PM in half hours, built from each member's class-schedule calendar link (Queen's timetable or Outlook `.ics`). Darker blue means more people are in class; click a slot to see who is free and who is busy.

This folder is a standalone Cloudflare Pages project and does not touch the main website.

## How it works
- `public/index.html` is the whole front end (no build step).
- `functions/api/busy.js` fetches every member's calendar on the server, expands the recurring classes for the requested week, and returns only names and class titles per half hour. Feeds are cached at the edge for 15 minutes; the reload button in the header bypasses the cache.
- `functions/api/members.js` lists, adds and removes members. Calendar links are stored in a Cloudflare KV namespace and are never sent to the browser or committed to this repo.
- Every API call needs the team password (`x-schedule-key` header). The sign-in screen asks for it once per browser.

## Cloudflare Pages setup
1. Workers & Pages → Create → Pages → Connect to Git → `quanttqueensu/quantt-website`.
2. Production branch `main`, framework preset None, build command empty, **root directory `schedule`**, build output directory `public`.
3. Settings → Variables and Secrets: add `SCHEDULE_PASSWORD` as a secret (the team password).
4. The KV binding `SCHEDULE_KV` comes from `wrangler.toml`. If the namespace there is not in your account, create one and bind it as `SCHEDULE_KV` under Settings → Bindings.
5. Custom domains → add `schedule.quantt.ca`.

## Local development
```
npx wrangler pages dev public --kv SCHEDULE_KV
```
with a `.dev.vars` file containing `SCHEDULE_PASSWORD=...`.

## Limits
- Recurring events with weekly or daily rules are expanded (including `UNTIL`, `COUNT`, `EXDATE`). Monthly and yearly rules show only their first occurrence.
- Cloudflare's free plan allows 50 outbound requests per call, so the free plan supports up to about 50 calendars.
