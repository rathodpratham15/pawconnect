# Google AI Studio prompt – PawConnect UI

Paste everything below the line into Google AI Studio (Build mode).

---

Build the complete front-end UI for **PawConnect**, a pet adoption and pet care web app, as a **Next.js 15 (App Router) + React 19 + TypeScript** app with SEO as a first-class requirement. Use plain CSS / CSS modules for the public pages and Material UI (@mui/material, @mui/icons-material, with @mui/material-nextjs `AppRouterCacheProvider`) for the logged-in app, axios, react-i18next (English + French) and @react-google-maps/api. The UI is the only deliverable: a REST API already exists, so do NOT mock the backend or invent endpoints. Call the real API exactly as described below.

## Look & feel
Warm, friendly and trustworthy. Primary golden-amber (#ECC067 header, black/dark-brown text accents), soft cream backgrounds, rounded cards (12–16px), generous whitespace, paw-print motif (🐾) in the header title "Paw Connect". Fully responsive (mobile first), accessible (labels, focus states, aria-labels), loading skeletons/spinners, empty states, and inline error messages (no raw alerts except confirmations). Use pet-themed photography placeholders (Unsplash URLs) for hero/cards.

## Global shell
- Header: hamburger button (opens a slide-in sidebar), "🐾 Paw Connect" title, optional cart icon (links to /cart), language switcher (EN/FR).
- Sidebar links: Food Products, Diet Generator, Profile, Geolocation, Clipboard, Network, Bluetooth, Admin (only if role is ADMIN), Logout.
- Make every translatable string go through i18next (en + fr).

## API configuration (important)
- Base URL from `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:3002`), no trailing slash. Create one axios instance that adds `Authorization: Bearer <token>` from localStorage key `token`, and on any 401 while a token exists clears `token`/`user` and redirects to `/login`.
- Session: after login/registration store `token` and `user` (`{_id,name,email,address,role}`, role is `USER` | `NGO` | `ADMIN`) in localStorage.
- Google Maps key from `process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (libraries: `places`). Public site origin from `NEXT_PUBLIC_SITE_URL`.

## Architecture: public (SEO) pages vs private app
There are two kinds of pages. Keep them strictly separate.

**Public pages = React Server Components, no `"use client"` at page level, fully server-rendered HTML.** They fetch from the API on the server with `fetch(url, { next: { revalidate: 300 } })` (cache 5 min), never from `useEffect`, and must render useful content with JavaScript disabled:
`/` (landing), `/pets`, `/pets/[id]`, `/ngos`, `/ngos/[id]`, `/products`, `/products/[id]`, `/tips`, plus `/ngo-management`, `/login`, `/signup`.

**Private pages = client components** inside the route group `src/app/(app)/` whose `layout.tsx` wraps children in an `AuthGate` client component (checks the localStorage token in a `useEffect`, renders nothing until the check passes, redirects anonymous users to `/login?from=<path>` and users without the role to `/homepage`):
`/homepage`, `/petadopt`, `/foodproducts`, `/dietgenerator`, `/fundraisermanagement`, `/petsalon`, `/vet`, `/pettherapy`, `/ngo`, `/cart`, `/petcare`, `/profile`, `/geolocation`, `/clipboard`, `/network`, `/bluetooth`; and `/admin` (role ADMIN only, own layout). These pages export `metadata = { robots: { index: false, follow: false } }`.

## SEO requirements (must be implemented)
1. Every public route exports `metadata` or `generateMetadata`: unique `<title>` (root layout uses a title template `%s | PawConnect`), a 120–160 character `description`, `alternates.canonical`, OpenGraph and Twitter card tags (image = pet/product photo when present, otherwise a default). Set `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
2. Exactly one `<h1>` per page, semantic landmarks (`header`, `nav`, `main`, `article`, `section`, `footer`), breadcrumbs on detail pages, descriptive `alt` text on every image, real `<a>`/`next/link` links (no click handlers for navigation) so crawlers can follow them.
3. JSON-LD structured data (a `<JsonLd>` server component, escape `<`): landing = `WebSite` + `Organization` + `FAQPage`; list pages = `ItemList`; `/ngos/[id]` = `NGO` (address, geo, telephone); `/products/[id]` = `Product` with `Offer` (USD price); `/tips` = `Article`.
4. `app/sitemap.ts` (static routes + every pet, verified NGO and product from the API, `revalidate = 3600`, tolerate API failure) and `app/robots.ts` (allow `/`, disallow the private routes and `/login`, `/signup`, `/admin`, point to the sitemap).
5. Detail pages return a real 404 (`notFound()`) when the API answers 404/400, but must THROW (not 404) when the API is down so an outage is never cached as "not found"; list pages degrade to an empty state. Provide `not-found.tsx`.
6. Performance (Core Web Vitals): use `next/image` (or sized `<img>` with `loading="lazy"`) with explicit width/height or aspect-ratio to avoid layout shift, `next/font` for fonts, no render-blocking third-party scripts, load Google Maps only on the map pages. Public pages must not ship Material UI or Redux to the client.
7. `/login` and `/signup` are `noindex`. Logged-in users who open `/`, `/login` or `/signup` are redirected to `/homepage` by a tiny client component (`PublicOnly`), not by blocking the server render.
8. Old URLs: `/productdetails` → `/products` and `/productdetails/:id` → `/products/:id` (permanent redirects in `next.config`).

## Routing & redirects (must be implemented exactly)
- Login redirect: after login go to the `from` query parameter if it is a same-site path (starts with `/`, not `//`), else `/homepage`.
- Use `next/link` and `useRouter` from `next/navigation` for all internal navigation; route segment names are lowercase exactly as listed above.
- Unknown URLs show the 404 page with a link home.
- Do NOT create `vercel.json` rewrites (Next.js handles routing); deployment is a normal Vercel Next.js project.

## Project structure
`src/app/layout.tsx` (fonts, metadata, `Providers` client component with MUI cache provider + Redux + i18n), `src/app/page.tsx`, one folder per route as above, `src/app/(app)/…`, `src/app/admin/…`, `src/components/` (`SiteHeader`, `SiteFooter`, `JsonLd`, `AuthGate`, `PublicOnly`, private-app `Header`/`Sidebar`), `src/lib/server-api.ts` (typed server-side `apiGet` returning null on 404/400 and throwing otherwise, and `apiList` returning `[]` on failure), `src/api.ts` (browser axios instance), `src/auth.ts` (SSR-safe: guard every `localStorage` access with `typeof window`), `src/locales/{en,fr}.json`, `public/`.

## Pages
Public pages (server-rendered) are listed first; the numbered list below describes every page's content. Pet, NGO and product detail pages (`/pets/[id]`, `/ngos/[id]` – verified NGOs only, `/products/[id]`) show all fields from the API, breadcrumbs, and a call-to-action that links to `/login?from=...`. The old client-side product details page is replaced by `/products/[id]`.
1. **Login** – email + password, error message from `response.data.message`, link to Sign-up. Full-bleed pet photo background with a translucent card.
2. **Sign-up** – name, email, password (min 6), address; optional radio "I'm a regular user / I'm an NGO representative" (sends `role`: `USER` or `NGO`). Success logs the user in and goes to `/homepage`. Link to Login and to "Are you an NGO? Sign up as NGO" (`/ngo-management`).
3. **Home** – hero with mission statement and three big action cards: Adopt a Pet (`/petadopt`), Search NGOs (`/ngo`), Pet Care (`/petcare`); a donation call-to-action ("Donate now" → `/ngo-management`); highlights of features.
4. **Pet Adoption** – filter bar (type, breed, size, max age slider, all client-side), grid of pet cards (image, name, type, breed, age, size, shelter, health concerns, disability badge, "Adopt" button that shows a confirmation toast), "Add pet" dialog/form (type, breed, age, size, disabilityStatus switch, healthConcerns comma list, shelterLocation, optional name/imageUrl).
5. **NGO Management** – grid of verified NGOs, plus "Register NGO" form: name (≥5 chars), registrationId, address, latitude, longitude with a "Detect my location" button (browser geolocation), country-code select (+1, +91, +44) + numeric phone, description (≥5 chars). After submit show "Submitted – it will appear after admin approval".
6. **Admin Dashboard** – cards of pending NGOs (name, registration id, address, lat/lng, contact, description) with Approve / Reject buttons; removes the card on success.
7. **Fundraiser Management** – list of fundraiser cards (title, description, NGO name, progress bar collected/target). If the user's role is `NGO` (or `ADMIN`) show "Add fundraiser" form (title, description, targetAmount, NGO select from verified NGOs).
8. **Food Products** – sort select (Product Name, Price Low→High, Price High→Low, Best Sellers), product grid (image, name, price), card click → `/productdetails/:id`.
9. **Product Details** – image, name, brand, price, description, nutrition details, quantity stepper, "Add to cart" (client-side only).
10. **Diet Generator** – client-side form (pet type, breed, weight, age, health conditions) that renders a personalised daily diet plan (generate it with plain logic, no API).
11. **Pet Care hub** – banner + cards linking to Vet, Pet Salon, Food Products, Diet Generator, Pet Therapy.
12. **Vet / Pet Salon / Pet Therapy / NGO Near Me** (four pages, same layout, different `keyword`) – ask for browser geolocation, show Google Map with markers, list of nearby places (Places `nearbySearch`, radius 5000), InfoWindow with name/address and a "Get directions" button opening `https://www.google.com/maps/dir/?api=1&destination=lat,lng`. Handle denied permission and API errors.
13. **Tips** – editorial page with four alternating image/text sections (Hygiene, Food, Exercise, Safety), each with bullet points and a pull-quote.
14. **Profile** – load `GET /user/:id` for the logged-in user, editable name/email/address, "Update profile", and a "Delete account" button with confirm dialog (then clears session and goes to `/login`).
15. **Cart** – simple client-side cart page (items, quantity, total).
16. **Device utility pages** – Geolocation (show lat/lng + save to file via File System Access API when available), Clipboard (copy/paste text), Network (online/offline + effective connection type), Bluetooth (request device, read battery level). Each must feature-detect and show a friendly "not supported" message.

## REST API contract (use exactly)
Errors are `{ "message": string }`.
- `POST /user/login` `{email,password}` → `{message,userId,token,user}`; 401 for bad credentials.
- `POST /user` `{name,email,password,address,role?}` → 201 `{message,userId,token,user}`; 409 duplicate email.
- `GET /user/profile` (auth) → current user. `GET|PUT|DELETE /user/:id` (auth, owner or admin); PUT body `{name,email,address,password?}`.
- `GET /pets` → `Pet[]`; `POST /pets` (auth) → 201 `Pet`. `Pet = {_id,name?,type,breed,age:number,size,disabilityStatus:boolean,healthConcerns:string[],shelterLocation,imageUrl?}`.
- `GET /ngos?status=verified|pending|rejected` → `NGO[]`; `POST /ngos` (public) → 201 `NGO` (always starts `pending`); `PATCH /ngos/:id/status` (ADMIN) body `{status:"verified"|"rejected"}`. `NGO = {_id,name,registrationId,location:{latitude,longitude,address},contactInfo,description,status}`.
- `GET /api/fundraisers` (auth) → `Fundraiser[]` with `ngo` populated; `POST /api/fundraisers` (auth, role NGO/ADMIN) `{title,description,targetAmount,ngo}` → 201. `Fundraiser = {_id,title,description,targetAmount,collectedAmount,ngo:NGO}`.
- `GET /foodProduct` → `FoodProduct[]`; `GET /foodProduct/:id`. `FoodProduct = {_id,name,brand,price,description?,nutritionDetails,sold?,image?}`.

- Adoption requests (auth required): `POST /pets/:id/adopt` `{message?}` → 201 request, 409 if the user already has a pending request for that pet; `GET /adoption-requests/mine` → the user's requests; `DELETE /adoption-requests/:id` withdraws a pending request of your own; admin only: `GET /adoption-requests?status=pending` and `PATCH /adoption-requests/:id/status` `{status:"approved"|"rejected"}`. `AdoptionRequest = {_id,status:"pending"|"approved"|"rejected"|"withdrawn",message,createdAt,updatedAt,pet:{_id,name?,type,breed,shelterLocation,imageUrl?},user?:{_id,name,email,address?}}` (`user` only in the admin list). The "Adopt" button must call this API and only show a success message after it succeeds; add a private page `/adoptions` ("My adoption requests") and an admin section for reviewing requests.
- `GET /breeds/dog` and `GET /breeds/cat` (public) → `string[]` of breed names. Use them for the breed select in the Add-pet form and the breed filter instead of hardcoding breeds. `GET /breeds/dog/image?breed=golden%20retriever` → `{breed,imageUrl|null}` (use as a photo preview/fallback when a pet has no `imageUrl`).
- The database is pre-seeded with demo pets and food products, so design for realistic, populated lists (and still handle empty states).
- NGOs may also come from Every.org: they have `source:"every_org"`, `location.latitude/longitude` can be `null`, and extra optional fields `websiteUrl`, `logoUrl`, `coverImageUrl`, `donateUrl`. Always show the NGO `logoUrl` when present, and for these NGOs show a "Donate via Every.org" button linking to `donateUrl` (opens in a new tab) with the credit "Listing information provided by Every.org". Never assume coordinates exist (no map pin or `toFixed` without a check).

## Deliverables
A complete Next.js project (`package.json` with next@15, react@19, @mui/material, @mui/material-nextjs, axios, i18next, react-i18next, react-redux, @reduxjs/toolkit, @react-google-maps/api; `next.config.mjs` with the redirects; `tsconfig.json`), `.env.example` (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SITE_URL`), and a short README. `npm run build` must pass with no type errors and without the API running (public data fetches must tolerate failure at build time). No mock data layers, no hardcoded localhost URLs outside the env default.
