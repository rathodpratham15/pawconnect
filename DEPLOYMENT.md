# PawConnect – Deployment

Two pieces: the Express API (`service/`) and the Next.js web app (`web/`).

## 1. Database (Neon PostgreSQL)
Create a free project at neon.tech and copy the **pooled** connection string (the host contains `-pooler`; Dashboard → Connect → enable "Connection pooling"). It looks like `postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require` and becomes `DATABASE_URL`. Change `sslmode=require` to `sslmode=verify-full` and remove `&channel_binding=require` if present (same security, avoids a driver warning).

The tables are created automatically the first time the API connects (or run `npm run migrate` in `service/`). Neon's free compute suspends when idle, so the first request after a pause takes about a second longer.

## 2a. API on Vercel (recommended – everything in one place)
Create a **separate Vercel project** from the same repo with **Root Directory = `service`** (framework preset: Other, no build command). `service/vercel.json` rewrites every path to the serverless entry `service/api/index.js`, which reuses a cached Postgres pool between requests. Add the environment variables from the table below, deploy, and open `<api-url>/health` – it should return `{"status":"ok"}`. Then use `<api-url>` (no trailing slash) as `NEXT_PUBLIC_API_URL` for the frontend project.

Notes: the first request after idle is a cold start (about 1–2 s); Neon accepts connections from Vercel without any IP allow-listing.

## 2b. API on Render / Railway / Fly (alternative – any long-running Node host)
- Root directory: `service` · Build: `npm install` · Start: `npm start` · Health check: `/health`
- Environment variables (see `service/.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Neon pooled connection string |
| `JWT_SECRET` | yes | long random string |
| `CORS_ORIGIN` | recommended | the deployed frontend URL, e.g. `https://pawconnect.vercel.app` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | recommended | creates the admin account used by `/admin` |
| `NODE_ENV` | recommended | `production` (hides stack traces in errors) |
| `PORT` | no | set by the host |

### Demo data
Run `npm run seed` in `service/` once (with `DATABASE_URL` set, e.g. from the host's shell) to add demo pets and food products. It is safe to re-run. Breed lists and dog photos come from dog.ceo (free, cached, with offline fallbacks) via `GET /breeds/dog|cat`.

### Real NGOs (optional, Every.org)
Put `DATABASE_URL` and `EVERY_ORG_API_KEY` in `service/.env` (gitignored, never commit it) and run `npm run import:ngos -- --limit 60` from `service/`. It searches Every.org's animal-welfare nonprofits, fetches each profile (address, logo, website, donate link) and stores them as verified NGOs with source `every_org`. Re-running refreshes them and never changes a status you set (a rejected NGO stays rejected). Imported NGOs have no map coordinates; per Every.org's terms the UI shows their name and logo and sends donations to their Every.org profile.

## 3. Frontend (`web/`, Next.js) – Vercel
- Root directory: `web` · Framework preset: Next.js (auto-detected) · no `vercel.json` needed.
- Environment variables (see `web/.env.example`; `NEXT_PUBLIC_*` are baked in at build time, so redeploy after changing them):

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | the deployed API URL, no trailing slash. The API must be live before this build so the landing page and sitemap pick up real data |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps JavaScript + Places key, restricted to the frontend domain |
| `NEXT_PUBLIC_SITE_URL` | the final public URL (e.g. `https://pawconnect.vercel.app` or your custom domain) – used for canonical links, the sitemap and social previews |

- `web/` replaces the old Vite app in `app/`, which is kept only for reference and can be deleted.
- After deploying, submit `<site-url>/sitemap.xml` in Google Search Console and check a pet page with a social-preview/rich-results test.

## SEO notes
- Public, indexable pages are server-rendered: `/`, `/pets`, `/pets/[id]`, `/ngos`, `/ngos/[id]`, `/products`, `/products/[id]`, `/tips`. They carry unique titles/descriptions, canonical URLs, Open Graph tags, JSON-LD, `sitemap.xml` and `robots.txt`.
- Logged-in pages are `noindex` and disallowed in `robots.txt`; only verified NGOs are public.
- API responses used by public pages are cached for 5 minutes, so new pets appear within that window.

## Roles & redirects
- `USER` (default) and `NGO` can be chosen at sign-up (`role` field); `ADMIN` only comes from `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- Anonymous visitors on private pages are redirected to `/login?from=<page>` and returned there after signing in; logged-in users hitting `/`, `/login` or `/signup` go to `/homepage`; `/admin` is admin-only; unknown URLs show a 404 page.
- Public NGO sign-ups stay `pending` until an admin approves them on `/admin`.
