// Breed data comes from dog.ceo (free, no key). Cats use a static list.
// Results are cached in memory so the free API isn't hit on every request,
// and static fallbacks keep the endpoints working when it is unreachable.
const DOG_API = "https://dog.ceo/api";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5000;

const FALLBACK_DOG_BREEDS = [
    "beagle", "boxer", "bulldog", "chihuahua", "corgi", "dachshund", "doberman",
    "german shepherd", "golden retriever", "husky", "labrador", "pomeranian",
    "poodle", "pug", "rottweiler", "shih tzu",
];

export const CAT_BREEDS = [
    "abyssinian", "bengal", "birman", "british shorthair", "burmese", "maine coon",
    "norwegian forest", "persian", "ragdoll", "russian blue", "scottish fold",
    "siamese", "sphynx", "domestic shorthair",
];

const cache = new Map();

const getJson = async (url) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!response.ok) throw new Error(`Upstream responded with ${response.status}`);
    return response.json();
};

const cached = async (key, loader) => {
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = await loader();
    cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
    return value;
};

// dog.ceo groups sub-breeds ("retriever": ["golden"]); flatten to "golden retriever"
const flattenDogBreeds = (message) =>
    Object.entries(message).flatMap(([breed, subBreeds]) =>
        subBreeds.length ? subBreeds.map((sub) => `${sub} ${breed}`) : [breed]
    );

export const getBreeds = async (species) => {
    if (species === "cat") return CAT_BREEDS;
    if (species !== "dog") return null;

    try {
        return await cached("dog-breeds", async () => {
            const data = await getJson(`${DOG_API}/breeds/list/all`);
            return flattenDogBreeds(data.message).sort();
        });
    } catch (error) {
        console.error("Falling back to static dog breeds:", error.message);
        return FALLBACK_DOG_BREEDS;
    }
};

// Returns a random photo URL for a dog breed, or null when none is available
export const getDogImage = async (breed) => {
    // "golden retriever" -> "retriever/golden"
    const parts = String(breed).toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return null;
    const path = parts.length === 1 ? parts[0] : `${parts[parts.length - 1]}/${parts.slice(0, -1).join("-")}`;

    try {
        return await cached(`dog-image:${path}`, async () => {
            const data = await getJson(`${DOG_API}/breed/${path}/images/random`);
            return data.status === "success" ? data.message : null;
        });
    } catch {
        return null;
    }
};
