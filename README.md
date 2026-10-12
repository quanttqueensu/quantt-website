# Quantt Website Repo

## Hosting: Cloudflare

quantt.ca is a static Next.js export (`output: "export"` in `next.config.ts`, written to `out/`) served by the Cloudflare Worker `quantt-website` (`wrangler.jsonc`).

1. Workers & Pages → Create → Import a repository → `quanttqueensu/quantt.ca`. Name `quantt-website`, build command `npm run build`, deploy command `npx wrangler deploy`, production branch `main`.
2. Settings → Domains & Routes → add `quantt.ca` and `www.quantt.ca` (remove them from Netlify first).

Preview locally: `npm run build && npx wrangler dev`.
