# QUANTT Schedule

Team availability for schedule.quantt.ca. One Mon–Sun week, 8 AM–10 PM in half hours, built from each member's class-schedule calendar link (Queen's timetable or Outlook `.ics`). Darker blue means more people are in class; click a slot to see who is free and who is busy.

This folder is a standalone Vercel project and does not touch the main website.

## How it works
- `index.html` is the whole front end (no build step).
- `api/busy.js` fetches every member's calendar on the server, expands the recurring classes for the requested week, and returns only names and class titles per half hour.
- `api/members.js` lists, adds and removes members. Calendar links are stored in a private Vercel Blob store and never sent to the browser or committed to this repo.
- Every API call needs the team password (`x-schedule-key` header). The sign-in screen asks for it once per browser.

## Vercel setup
- Project root directory: `schedule`. Framework preset: Other.
- Environment variables:
  - `SCHEDULE_PASSWORD`: the team password.
  - `BLOB_READ_WRITE_TOKEN`: added automatically when a private Blob store is connected to the project.
- Domain: add `schedule.quantt.ca` under Project → Settings → Domains, then create the CNAME record Vercel shows (usually `cname.vercel-dns.com`).

## Limits
- Recurring events with weekly or daily rules are expanded (including `UNTIL`, `COUNT`, `EXDATE`). Monthly and yearly rules show only their first occurrence.
- Feeds are cached for 15 minutes per server instance; the reload button in the header fetches fresh data.
