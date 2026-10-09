import { query } from "../db.js";
import {
    definedOnly, isUuid, optionalString, requiredBoolean, requiredNumber, requiredString, stringArray,
} from "../validation.js";

const mapPet = (row) =>
    row && {
        _id: row.id,
        name: row.name ?? undefined,
        type: row.type,
        breed: row.breed,
        age: row.age,
        size: row.size,
        disabilityStatus: row.disability_status,
        healthConcerns: row.health_concerns,
        shelterLocation: row.shelter_location,
        imageUrl: row.image_url ?? undefined,
    };

// Validates the fields present in `data`; with `partial` only those fields are required to be valid
const validatedPet = (data, partial) =>
    definedOnly({
        name: optionalString(data, "name"),
        type: requiredString(data, "type", { partial }),
        breed: requiredString(data, "breed", { partial }),
        age: requiredNumber(data, "age", { partial, min: 0 }),
        size: requiredString(data, "size", { partial }),
        disability_status: requiredBoolean(data, "disabilityStatus", { partial }),
        health_concerns: stringArray(data, "healthConcerns"),
        shelter_location: requiredString(data, "shelterLocation", { partial }),
        image_url: optionalString(data, "imageUrl"),
    });

// Service to fetch all pets
export const getAllPets = async () => {
    const { rows } = await query("SELECT * FROM pets ORDER BY name NULLS LAST, id");
    return rows.map(mapPet);
};

// Service to fetch a pet by its ID
export const getPetById = async (id) => {
    if (!isUuid(id)) return null;
    const { rows } = await query("SELECT * FROM pets WHERE id = $1", [id]);
    return mapPet(rows[0]) ?? null;
};

// Service to save a new pet
export const save = async (petData) => {
    const pet = validatedPet(petData, false);
    const columns = Object.keys(pet);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    const { rows } = await query(
        `INSERT INTO pets (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        columns.map((column) => pet[column])
    );
    return mapPet(rows[0]);
};

// Service to update a pet by ID
export const updatePetById = async (id, updates) => {
    if (!isUuid(id)) return null;
    const pet = validatedPet(updates, true);
    const columns = Object.keys(pet);
    if (columns.length === 0) return getPetById(id);

    const assignments = columns.map((column, index) => `${column} = $${index + 2}`).join(", ");
    const { rows } = await query(
        `UPDATE pets SET ${assignments} WHERE id = $1 RETURNING *`,
        [id, ...columns.map((column) => pet[column])]
    );
    return mapPet(rows[0]) ?? null;
};

// Service to delete a pet by ID
export const deletePetById = async (id) => {
    if (!isUuid(id)) return null;
    const { rows } = await query("DELETE FROM pets WHERE id = $1 RETURNING *", [id]);
    return mapPet(rows[0]) ?? null;
};
