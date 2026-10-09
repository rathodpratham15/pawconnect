// Imports real animal-welfare nonprofits from the Every.org Charity API into the ngos table.
//
//   npm run import:ngos                    (needs EVERY_ORG_API_KEY and DATABASE_URL, e.g. in service/.env)
//   npm run import:ngos -- --limit 100     (how many NGOs to import at most; default 60)
//
// Safe to re-run: NGOs are matched by EIN, their details are refreshed, and their status is never
// changed (so an NGO you rejected stays rejected). Imported NGOs are stored as source "every_org"
// and marked verified, since Every.org only lists IRS-registered nonprofits.
//
// Every.org's terms ask that users see the nonprofit's name and logo and are sent to its
// profile page (stored as donate_url) to donate.
import dotenv from "dotenv";
import { closeDB, ensureSchema, query } from "../service/db.js";

dotenv.config();

const BASE_URL = (process.env.EVERY_ORG_BASE_URL || "https://partners.every.org").replace(/\/$/, "");
const API_KEY = process.env.EVERY_ORG_API_KEY;
const SOURCE = "every_org";
// Details are limited to 100 requests/minute per key, so stay comfortably under it
const DETAIL_DELAY_MS = 750;
const SEARCH_TERMS = ["animal shelter", "humane society", "dog rescue", "cat rescue", "spca", "pet adoption", "animal rescue"];

const argValue = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);
    return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};
const LIMIT = Number(argValue("limit", 60));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getJson = async (path, params = {}) => {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set("apiKey", API_KEY);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (response.status === 401 || response.status === 403) {
        throw new Error("Every.org rejected the API key (check EVERY_ORG_API_KEY)");
    }
    if (response.status === 429) throw new Error("Every.org rate limit reached, try again in a minute");
    if (!response.ok) throw new Error(`Every.org responded with ${response.status} for ${path}`);
    return response.json();
};

// Search several terms within the "animals" cause and merge the results by EIN
const findCandidates = async () => {
    const byEin = new Map();
    for (const term of SEARCH_TERMS) {
        const data = await getJson(`/v0.2/search/${encodeURIComponent(term)}`, { causes: "animals", take: 50 });
        for (const nonprofit of data.nonprofits ?? []) {
            if (nonprofit.ein && !byEin.has(nonprofit.ein)) byEin.set(nonprofit.ein, nonprofit);
        }
        console.log(`  "${term}": ${byEin.size} unique candidates so far`);
    }
    return [...byEin.values()];
};

const upsertNgo = async (summary, details) => {
    const ein = summary.ein;
    const name = details?.name ?? summary.name;
    const description = details?.description ?? summary.description ?? name;
    const websiteUrl = details?.websiteUrl ?? summary.websiteUrl ?? null;
    const profileUrl = details?.profileUrl ?? summary.profileUrl ?? null;

    const { rows } = await query(
        `INSERT INTO ngos
            (name, registration_id, address, contact_info, description, status, source, external_id,
             website_url, logo_url, cover_image_url, donate_url)
         VALUES ($1, $2, $3, $4, $5, 'verified', $6, $2, $7, $8, $9, $10)
         ON CONFLICT (source, external_id) WHERE external_id IS NOT NULL DO UPDATE SET
            name = EXCLUDED.name, description = EXCLUDED.description, address = EXCLUDED.address,
            contact_info = EXCLUDED.contact_info, website_url = EXCLUDED.website_url,
            logo_url = EXCLUDED.logo_url, cover_image_url = EXCLUDED.cover_image_url,
            donate_url = EXCLUDED.donate_url
         RETURNING (xmax = 0) AS inserted`,
        [
            name,
            ein,
            details?.locationAddress ?? "United States",
            websiteUrl ?? profileUrl ?? "See profile",
            description,
            SOURCE,
            websiteUrl,
            details?.logoUrl ?? summary.logoUrl ?? null,
            details?.coverImageUrl ?? null,
            profileUrl,
        ]
    );
    return rows[0].inserted;
};

const run = async () => {
    if (!API_KEY) {
        console.error("EVERY_ORG_API_KEY is not set");
        process.exit(1);
    }
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    await ensureSchema();

    console.log("Searching Every.org for animal shelters and rescues...");
    const candidates = (await findCandidates()).slice(0, LIMIT);
    console.log(`Importing ${candidates.length} nonprofits (about ${Math.ceil((candidates.length * DETAIL_DELAY_MS) / 1000)}s)...`);

    let created = 0;
    let updated = 0;
    let failed = 0;
    for (const candidate of candidates) {
        try {
            // The search result has no address, so fetch the full profile
            const details = (await getJson(`/v0.2/nonprofit/${candidate.ein}`)).data?.nonprofit;
            if (await upsertNgo(candidate, details)) created += 1;
            else updated += 1;
        } catch (error) {
            failed += 1;
            console.warn(`  skipped ${candidate.name} (${candidate.ein}): ${error.message}`);
            if (error.message.includes("rate limit") || error.message.includes("API key")) break;
        }
        await sleep(DETAIL_DELAY_MS);
    }

    console.log(`Done: ${created} created, ${updated} updated, ${failed} skipped`);
    await closeDB();
};

run().catch(async (error) => {
    console.error("Import failed:", error.message);
    await closeDB();
    process.exit(1);
});
