// Imports real adoptable pets from RescueGroups.org (API v5) into the pets table.
//
//   npm run import:pets                                   (needs RESCUEGROUPS_API_KEY and DATABASE_URL, e.g. in service/.env)
//   npm run import:pets -- --limit 60                     (pets per species; default 60)
//   npm run import:pets -- --species dogs,cats,rabbits    (species views; default dogs,cats)
//   npm run import:pets -- --zip 02115 --miles 50         (only pets near a US/Canadian postal code)
//   npm run import:pets -- --keep-stale                   (don't remove imported pets that are no longer listed)
//
// Pets are matched by RescueGroups id, so re-running refreshes them. Imported pets keep a link to the
// shelter's own page: adoption is arranged there, not through PawConnect. After a complete run, imported
// pets of the species that were fetched and are no longer available (adopted, removed) are deleted, so the
// site doesn't show stale animals. Species you didn't fetch in that run (e.g. cats on a dogs-only run) are left alone.
import dotenv from "dotenv";
import { closeDB, ensureSchema, query } from "../service/db.js";

dotenv.config();

const BASE_URL = (process.env.RESCUEGROUPS_BASE_URL || "https://api.rescuegroups.org/v5").replace(/\/$/, "");
const API_KEY = process.env.RESCUEGROUPS_API_KEY;
const SOURCE = "rescuegroups";
const PAGE_SIZE = 100; // the API allows up to 250 per page

const argValue = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);
    return index !== -1 && process.argv[index + 1] && !process.argv[index + 1].startsWith("--")
        ? process.argv[index + 1]
        : fallback;
};
const LIMIT = Number(argValue("limit", 60));
const SPECIES = argValue("species", "dogs,cats").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const ZIP = argValue("zip", null);
const MILES = Number(argValue("miles", 50));
const KEEP_STALE = process.argv.includes("--keep-stale");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (path, { zip } = {}) => {
    const options = {
        headers: { Authorization: API_KEY, "Content-Type": "application/vnd.api+json" },
        signal: AbortSignal.timeout(30000),
    };
    if (zip) {
        // Distance searches are POSTs with a filterRadius object
        options.method = "POST";
        options.body = JSON.stringify({ data: { filterRadius: { miles: MILES, postalcode: zip } } });
    }
    const response = await fetch(`${BASE_URL}${path}`, options);
    if (response.status === 401 || response.status === 403) {
        throw new Error("RescueGroups rejected the API key (check RESCUEGROUPS_API_KEY)");
    }
    if (response.status === 429) throw new Error("RescueGroups rate limit reached, try again later");
    if (!response.ok) {
        const body = (await response.text()).slice(0, 300);
        throw new Error(`RescueGroups responded with ${response.status} for ${path}: ${body}`);
    }
    return response.json();
};

const AGE_GROUP_YEARS = { baby: 0.5, young: 1.5, adult: 4, senior: 9 };

const ageInYears = (animal) => {
    if (animal.birthDate) {
        const years = (Date.now() - new Date(animal.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000);
        if (Number.isFinite(years) && years >= 0) return Math.round(years * 10) / 10;
    }
    return AGE_GROUP_YEARS[String(animal.ageGroup || "").toLowerCase()] ?? 2;
};

const sizeOf = (animal) => {
    const size = String(animal.sizeGroup || "").toLowerCase();
    if (size.includes("small")) return "small";
    if (size.includes("large")) return "large"; // covers "Large" and "X-Large"
    return "medium";
};

// Turns one JSON:API animal (plus its included orgs/pictures/species) into a pets row, or null to skip it
const toPet = (resource, included) => {
    const animal = resource.attributes ?? {};
    const related = (type) =>
        (resource.relationships?.[type]?.data ?? []).map((ref) => included.get(`${ref.type}:${ref.id}`)).filter(Boolean);

    const org = related("orgs")[0]?.attributes ?? {};
    const species = related("species")[0]?.attributes ?? {};
    const pictures = related("pictures")
        .map((p) => p.attributes)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const imageUrl = pictures[0]?.large ?? pictures[0]?.original ?? pictures[0]?.small ?? animal.pictureThumbnailUrl;
    if (!animal.name || !imageUrl) return null; // a listing without a photo isn't useful on the site

    return {
        externalId: String(resource.id),
        name: animal.name.trim(),
        type: String(species.singular || "pet").toLowerCase(),
        breed: String(animal.breedPrimary || animal.breedString || "mixed").toLowerCase(),
        age: ageInYears(animal),
        size: sizeOf(animal),
        disabilityStatus: animal.isSpecialNeeds === true,
        healthConcerns: animal.specialNeedsDetails ? [String(animal.specialNeedsDetails).trim().slice(0, 300)] : [],
        shelterLocation: org.citystate || org.city || "Location not listed",
        imageUrl,
        externalUrl: animal.url || org.adoptionUrl || org.url || null,
        description: animal.descriptionText ? String(animal.descriptionText).trim().slice(0, 2000) : null,
        organizationName: org.name || null,
    };
};

const upsertPet = async (pet) => {
    const { rows } = await query(
        `INSERT INTO pets
            (name, type, breed, age, size, disability_status, health_concerns, shelter_location, image_url,
             source, external_id, external_url, description, organization_name, last_seen_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now())
         ON CONFLICT (source, external_id) WHERE external_id IS NOT NULL DO UPDATE SET
            name = EXCLUDED.name, type = EXCLUDED.type, breed = EXCLUDED.breed, age = EXCLUDED.age,
            size = EXCLUDED.size, disability_status = EXCLUDED.disability_status,
            health_concerns = EXCLUDED.health_concerns, shelter_location = EXCLUDED.shelter_location,
            image_url = EXCLUDED.image_url, external_url = EXCLUDED.external_url,
            description = EXCLUDED.description, organization_name = EXCLUDED.organization_name,
            last_seen_at = now()
         RETURNING (xmax = 0) AS inserted`,
        [
            pet.name, pet.type, pet.breed, pet.age, pet.size, pet.disabilityStatus, pet.healthConcerns,
            pet.shelterLocation, pet.imageUrl, SOURCE, pet.externalId, pet.externalUrl, pet.description,
            pet.organizationName,
        ]
    );
    return rows[0].inserted;
};

// Pages through one species until `LIMIT` usable pets have been collected or the results run out
const fetchSpecies = async (species) => {
    const pets = [];
    let skipped = 0;
    for (let page = 1; pets.length < LIMIT; page += 1) {
        const path = `/public/animals/search/available/${species}/?limit=${PAGE_SIZE}&page=${page}&include=pictures,orgs,species`;
        const data = await request(path, { zip: ZIP });
        const included = new Map((data.included ?? []).map((item) => [`${item.type}:${item.id}`, item]));
        for (const resource of data.data ?? []) {
            const pet = toPet(resource, included);
            if (pet) pets.push(pet);
            else skipped += 1;
            if (pets.length >= LIMIT) break;
        }
        const pages = data.meta?.pages ?? data.meta?.pageTotal ?? page;
        if ((data.data ?? []).length === 0 || page >= pages) break;
        await sleep(500);
    }
    return { pets, skipped };
};

const run = async () => {
    if (!API_KEY) {
        console.error("RESCUEGROUPS_API_KEY is not set");
        process.exit(1);
    }
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    await ensureSchema();
    const startedAt = new Date();
    console.log(`Importing available ${SPECIES.join(", ")} (up to ${LIMIT} each)${ZIP ? ` within ${MILES} miles of ${ZIP}` : " nationwide"}...`);

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const fetchedTypes = new Set();
    for (const species of SPECIES) {
        const result = await fetchSpecies(species);
        skipped += result.skipped;
        for (const pet of result.pets) {
            fetchedTypes.add(pet.type);
            if (await upsertPet(pet)) created += 1;
            else updated += 1;
        }
        console.log(`  ${species}: ${result.pets.length} imported${result.skipped ? `, ${result.skipped} skipped (no photo/name)` : ""}`);
    }
    console.log(`Done: ${created} created, ${updated} updated, ${skipped} skipped`);

    // Only after a complete run: drop imported pets of the fetched species that weren't seen this time
    if (!KEEP_STALE && fetchedTypes.size > 0) {
        const { rowCount } = await query(
            "DELETE FROM pets WHERE source = $1 AND type = ANY($2) AND (last_seen_at IS NULL OR last_seen_at < $3)",
            [SOURCE, [...fetchedTypes], startedAt]
        );
        if (rowCount > 0) console.log(`Removed ${rowCount} imported pets that are no longer listed`);
    }
    await closeDB();
};

run().catch(async (error) => {
    console.error("Import failed:", error.message);
    await closeDB();
    process.exit(1);
});
