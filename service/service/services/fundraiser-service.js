import { query } from "../db.js";
import { definedOnly, isUuid, requiredNumber, requiredString } from "../validation.js";
import { mapNgo } from "./ngo-service.js";

const mapFundraiser = (row, ngo) =>
    row && {
        _id: row.id,
        title: row.title,
        description: row.description,
        targetAmount: row.target_amount,
        collectedAmount: row.collected_amount,
        ngo,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };

// collectedAmount is server-controlled and always starts at 0
export const createFundraiser = async ({ title, description, targetAmount }, ngoId) => {
    const { rows } = await query(
        `INSERT INTO fundraisers (title, description, target_amount, ngo_id)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [
            requiredString({ title }, "title"),
            requiredString({ description }, "description"),
            requiredNumber({ targetAmount }, "targetAmount", { min: 0 }),
            ngoId,
        ]
    );
    return mapFundraiser(rows[0], rows[0].ngo_id);
};

// Every fundraiser with its NGO embedded
export const getFundraisers = async () => {
    const { rows } = await query(
        `SELECT f.*, n.id AS n_id, n.name AS n_name, n.registration_id AS n_registration_id,
                n.latitude AS n_latitude, n.longitude AS n_longitude, n.address AS n_address,
                n.contact_info AS n_contact_info, n.description AS n_description, n.status AS n_status
         FROM fundraisers f JOIN ngos n ON n.id = f.ngo_id
         ORDER BY f.created_at DESC`
    );
    return rows.map((row) =>
        mapFundraiser(row, mapNgo({
            id: row.n_id, name: row.n_name, registration_id: row.n_registration_id,
            latitude: row.n_latitude, longitude: row.n_longitude, address: row.n_address,
            contact_info: row.n_contact_info, description: row.n_description, status: row.n_status,
        }))
    );
};

export const getFundraiserById = async (id) => {
    if (!isUuid(id)) return null;
    const { rows } = await query("SELECT * FROM fundraisers WHERE id = $1", [id]);
    return mapFundraiser(rows[0], rows[0]?.ngo_id) ?? null;
};

export const updateFundraiser = async (id, data) => {
    if (!isUuid(id)) return null;
    const changes = definedOnly({
        title: requiredString(data, "title", { partial: true }),
        description: requiredString(data, "description", { partial: true }),
        target_amount: requiredNumber(data, "targetAmount", { partial: true, min: 0 }),
    });
    const columns = Object.keys(changes);
    if (columns.length === 0) return getFundraiserById(id);

    const assignments = columns.map((column, index) => `${column} = $${index + 2}`).join(", ");
    const { rows } = await query(
        `UPDATE fundraisers SET ${assignments}, updated_at = now() WHERE id = $1 RETURNING *`,
        [id, ...columns.map((column) => changes[column])]
    );
    return mapFundraiser(rows[0], rows[0]?.ngo_id) ?? null;
};

export const deleteFundraiser = async (id) => {
    if (!isUuid(id)) return null;
    const { rows } = await query("DELETE FROM fundraisers WHERE id = $1 RETURNING id", [id]);
    return rows[0] ? { _id: rows[0].id } : null;
};
