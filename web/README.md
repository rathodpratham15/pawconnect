# PawConnect UI

**PawConnect** is a comprehensive, SEO-optimized pet adoption, pet wellness care, and verified NGO support web application built with **Next.js 15 (App Router)**, **React 19**, and **TypeScript**.

## Key Features

- **Public SEO Architecture**: Fully server-rendered HTML for search crawlers (Google, Bing) with unique metadata, canonical links, OpenGraph/Twitter social cards, and Schema.org structured data (JSON-LD: `WebSite`, `Organization`, `FAQPage`, `ItemList`, `NGO`, `Product`, `Article`).
- **Private Authenticated App**: Protected by `AuthGate` client-side validation (`(app)` route group and `/admin` role check) with Material UI (`@mui/material`, `@mui/material-nextjs`).
- **Pet Adoption Hub**: Filter adoptable rescues by species, breed, size, and age slider; dynamically populates breeds from `GET /breeds/{type}` and provides an Add Pet modal.
- **Diet Generator**: Science-backed daily caloric target and macronutrient ratio calculator for dogs and cats based on resting energy requirement (RER) physiology.
- **Local Care Maps**: Integrated Google Maps Platform (`@react-google-maps/api`) with browser geolocation to locate nearby veterinarians, grooming salons, pet therapy centers, and rescue shelters with 1-click turn-by-turn directions.
- **NGO Shelter Verification**: Public registration portal for non-profit shelters with admin moderation dashboard to approve or reject organizations.
- **Emergency Rescue Fundraisers**: Transparent campaigns with real-time target and collected progress indicators.
- **Device Hardware Integrations**: Geolocation with File System Access API coordinate export, Clipboard copy/paste, Network information status, and Web Bluetooth BLE device scanner.
- **Internationalization**: Full bilingual English (`en`) and French (`fr`) translation via `i18next` and `react-i18next`.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3002"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Running the Application

Install dependencies and start development server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```
