import { query } from "../db.js";
import {
    ValidationError, definedOnly, isUuid, requiredNumber, requiredString,
} from "../validation.js";

export const mapNgo = (row) =>
    row && {
        _id: row.id,
        name: row.name,
        registrationId: row.registration_id,
        location: { latitude: row.latitude, longitude: row.longitude, address: row.address },
        contactInfo: row.contact_info,
        description: row.description,
        status: row.status,
        source: row.source,
        // Only set for NGOs imported from an external directory
        websiteUrl: row.website_url ?? undefined,
        logoUrl: row.logo_url ?? undefined,
        coverImageUrl: row.cover_image_url ?? undefined,
        donateUrl: row.donate_url ?? undefined,
    };

const validatedLocation = (data, partial) => {
    const location = data.location;
    if (location === undefined || location === null) {
        if (partial) return {};
        throw new ValidationError("location is required");
    }
    if (typeof location !== "object") throw new ValidationError("location must be an object");
    return {
        latitude: requiredNumber(location, "latitude"),
        longitude: requiredNumber(location, "longitude"),
        address: requiredString(location, "address"),
    };
};

const validatedNgo = (data, partial) =>
    definedOnly({
        name: requiredString(data, "name", { partial }),
        registration_id: requiredString(data, "registrationId", { partial }),
        ...validatedLocation(data, partial),
        contact_info: requiredString(data, "contactInfo", { partial }),
        description: requiredString(data, "description", { partial }),
    });

const createNGO = async (ngoData) => {
    // New registrations always start as pending, whatever the client sends
    const ngo = validatedNgo(ngoData, false);
    const columns = Object.keys(ngo);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    const { rows } = await query(
        `INSERT INTO ngos (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        columns.map((column) => ngo[column])
    );
    return mapNgo(rows[0]);
};

const findNGOById = async (ngoId) => {
    if (!isUuid(ngoId)) return null;
    const { rows } = await query("SELECT * FROM ngos WHERE id = $1", [ngoId]);
    return mapNgo(rows[0]) ?? null;
};

// `filter` may contain a status to narrow the list
const findAllNGOs = async (filter = {}) => {
    const { rows } = filter.status
        ? await query("SELECT * FROM ngos WHERE status = $1 ORDER BY created_at DESC", [filter.status])
        : await query("SELECT * FROM ngos ORDER BY created_at DESC");
    return rows.map(mapNgo);
};

const updateNGOStatus = async (ngoId, status) => {
    if (!isUuid(ngoId)) return null;
    const { rows } = await query("UPDATE ngos SET status = $2 WHERE id = $1 RETURNING *", [ngoId, status]);
    return mapNgo(rows[0]) ?? null;
};

const updateNGO = async (ngoId, ngoData) => {
    if (!isUuid(ngoId)) return null;
    const ngo = validatedNgo(ngoData, true);
    const columns = Object.keys(ngo);
    if (columns.length === 0) return findNGOById(ngoId);

    const assignments = columns.map((column, index) => `${column} = $${index + 2}`).join(", ");
    const { rows } = await query(
        `UPDATE ngos SET ${assignments} WHERE id = $1 RETURNING *`,
        [ngoId, ...columns.map((column) => ngo[column])]
    );
    return mapNgo(rows[0]) ?? null;
};

const deleteNGO = async (ngoId) => {
    if (!isUuid(ngoId)) return null;
    const { rows } = await query("DELETE FROM ngos WHERE id = $1 RETURNING *", [ngoId]);
    return mapNgo(rows[0]) ?? null;
};

export default { createNGO, findNGOById, findAllNGOs, updateNGOStatus, updateNGO, deleteNGO };
