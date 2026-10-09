// Fills an empty database with demo pets and food products.
// Safe to re-run: existing records (matched by name) are left untouched.
// Usage: npm run seed   (needs DATABASE_URL in the environment or .env)
import dotenv from "dotenv";
import { closeDB, ensureSchema, query } from "../service/db.js";
import * as petService from "../service/services/pet-service.js";
import * as foodProductService from "../service/services/foodProduct-service.js";
import { getDogImage } from "../service/services/breed-service.js";

dotenv.config();

const pets = [
    { name: "Buddy", type: "dog", breed: "labrador", age: 3, size: "large", disabilityStatus: false, healthConcerns: [], shelterLocation: "Boston, MA" },
    { name: "Luna", type: "dog", breed: "husky", age: 2, size: "large", disabilityStatus: false, healthConcerns: ["Needs lots of exercise"], shelterLocation: "Cambridge, MA" },
    { name: "Max", type: "dog", breed: "beagle", age: 5, size: "medium", disabilityStatus: false, healthConcerns: ["Mild arthritis"], shelterLocation: "Somerville, MA" },
    { name: "Daisy", type: "dog", breed: "pug", age: 4, size: "small", disabilityStatus: false, healthConcerns: ["Sensitive breathing"], shelterLocation: "Boston, MA" },
    { name: "Rocky", type: "dog", breed: "boxer", age: 6, size: "large", disabilityStatus: true, healthConcerns: ["Missing a hind leg"], shelterLocation: "Brookline, MA" },
    { name: "Coco", type: "dog", breed: "poodle", age: 1, size: "small", disabilityStatus: false, healthConcerns: [], shelterLocation: "Newton, MA" },
    { name: "Bella", type: "dog", breed: "corgi", age: 2, size: "medium", disabilityStatus: false, healthConcerns: [], shelterLocation: "Cambridge, MA" },
    { name: "Milo", type: "cat", breed: "siamese", age: 2, size: "small", disabilityStatus: false, healthConcerns: [], shelterLocation: "Boston, MA" },
    { name: "Nala", type: "cat", breed: "maine coon", age: 4, size: "large", disabilityStatus: false, healthConcerns: [], shelterLocation: "Somerville, MA" },
    { name: "Oliver", type: "cat", breed: "british shorthair", age: 7, size: "medium", disabilityStatus: true, healthConcerns: ["Deaf"], shelterLocation: "Newton, MA" },
    { name: "Whiskers", type: "cat", breed: "persian", age: 3, size: "medium", disabilityStatus: false, healthConcerns: ["Needs regular grooming"], shelterLocation: "Brookline, MA" },
    { name: "Kiwi", type: "parrot", breed: "parakeet", age: 1, size: "small", disabilityStatus: false, healthConcerns: [], shelterLocation: "Boston, MA" },
];

const foodProducts = [
    { name: "RawBlends Dog Food", brand: "RawBlends", price: 34.99, description: "Raw-inspired kibble with freeze-dried chicken.", nutritionDetails: "Protein 32%, Fat 18%, Fiber 4%, Moisture 10%", sold: 120 },
    { name: "Hills Cat Food", brand: "Hill's Science Diet", price: 29.5, description: "Balanced adult cat nutrition with natural fibers.", nutritionDetails: "Protein 30%, Fat 15%, Fiber 3%, Moisture 10%", sold: 210 },
    { name: "3D Parrot Food", brand: "3D Pets", price: 14.25, description: "Seed and pellet mix for parrots and conures.", nutritionDetails: "Protein 14%, Fat 8%, Fiber 10%, Moisture 11%", sold: 45 },
    { name: "Maxime Dog Food", brand: "Maxime", price: 27.0, description: "Everyday adult dog food with lamb and rice.", nutritionDetails: "Protein 25%, Fat 14%, Fiber 4%, Moisture 10%", sold: 96 },
    { name: "NoIssue Pet Food", brand: "NoIssue", price: 12.99, description: "Soft training treats for dogs of all sizes.", nutritionDetails: "Protein 22%, Fat 12%, Fiber 3%, Moisture 14%", sold: 150 },
    { name: "Parakreet Dog Food", brand: "Parakreet", price: 31.75, description: "Grain-free recipe for sensitive stomachs.", nutritionDetails: "Protein 28%, Fat 16%, Fiber 5%, Moisture 10%", sold: 64 },
    { name: "Sheba Cat Food", brand: "Sheba", price: 18.4, description: "Premium wet food trays with real fish.", nutritionDetails: "Protein 11%, Fat 5%, Fiber 1%, Moisture 78%", sold: 305 },
    { name: "Yum Yum Dog Food", brand: "Yum Yum", price: 24.9, description: "Tasty beef and vegetable dinner for dogs.", nutritionDetails: "Protein 24%, Fat 13%, Fiber 4%, Moisture 10%", sold: 80 },
];

const seedCollection = async (table, save, items, label) => {
    let created = 0;
    for (const item of items) {
        const { rowCount } = await query(`SELECT 1 FROM ${table} WHERE name = $1`, [item.name]);
        if (rowCount === 0) {
            await save(item);
            created += 1;
        }
    }
    console.log(`${label}: ${created} created, ${items.length - created} already present`);
};

const run = async () => {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }
    await ensureSchema();

    // Dog photos come from dog.ceo; other pets simply have no photo
    for (const pet of pets) {
        if (pet.type === "dog") pet.imageUrl = (await getDogImage(pet.breed)) ?? undefined;
    }

    await seedCollection("pets", petService.save, pets, "Pets");
    await seedCollection("food_products", foodProductService.save, foodProducts, "Food products");
    await closeDB();
};

run().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
