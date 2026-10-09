import { query } from "../db.js";
import { ValidationError, isUuid, optionalString } from "../validation.js";

const ADMIN_STATUSES = ["approved", "rejected"];

const mapRequest = (row, { includeUser = false } = {}) =>
    row && {
        _id: row.id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        pet: {
            _id: row.pet_id,
            name: row.pet_name ?? undefined,
            type: row.pet_type,
            breed: row.pet_breed,
            shelterLocation: row.pet_shelter_location,
            imageUrl: row.pet_image_url ?? undefined,
        },
        ...(includeUser && {
            user: { _id: row.user_id, name: row.user_name, email: row.user_email, address: row.user_address },
        }),
    };

const SELECT_REQUESTS = `
    SELECT r.*, p.name AS pet_name, p.type AS pet_type, p.breed AS pet_breed,
           p.shelter_location AS pet_shelter_location, p.image_url AS pet_image_url,
           u.name AS user_name, u.email AS user_email, u.address AS user_address
    FROM adoption_requests r
    JOIN pets p ON p.id = r.pet_id
    JOIN users u ON u.id = r.user_id`;

const getRequest = async (id, options) => {
    const { rows } = await query(`${SELECT_REQUESTS} WHERE r.id = $1`, [id]);
    return mapRequest(rows[0], options) ?? null;
};

// Returns null when the pet doesn't exist, or { duplicate: true } when a request is already open
export const createRequest = async (petId, userId, data) => {
    if (!isUuid(petId)) return null;
    const message = optionalString(data, "message") ?? "";
    if (message.length > 1000) throw new ValidationError("message must be at most 1000 characters");

    const pet = await query("SELECT id FROM pets WHERE id = $1", [petId]);
    if (pet.rowCount === 0) return null;

    try {
        const { rows } = await query(
            "INSERT INTO adoption_requests (pet_id, user_id, message) VALUES ($1, $2, $3) RETURNING id",
            [petId, userId, message]
        );
        return await getRequest(rows[0].id);
    } catch (error) {
        if (error.code === "23505") return { duplicate: true };
        throw error;
    }
};

export const getRequestsForUser = async (userId) => {
    const { rows } = await query(`${SELECT_REQUESTS} WHERE r.user_id = $1 ORDER BY r.created_at DESC`, [userId]);
    return rows.map((row) => mapRequest(row));
};

export const getAllRequests = async (status) => {
    if (status && !["pending", "approved", "rejected", "withdrawn"].includes(status)) {
        throw new ValidationError("Invalid status value");
    }
    const { rows } = status
        ? await query(`${SELECT_REQUESTS} WHERE r.status = $1 ORDER BY r.created_at DESC`, [status])
        : await query(`${SELECT_REQUESTS} ORDER BY r.created_at DESC`);
    return rows.map((row) => mapRequest(row, { includeUser: true }));
};

// Admin decision on a pending request; null when it doesn't exist
export const decideRequest = async (id, status) => {
    if (!ADMIN_STATUSES.includes(status)) throw new ValidationError("status must be 'approved' or 'rejected'");
    if (!isUuid(id)) return null;
    const { rowCount } = await query(
        "UPDATE adoption_requests SET status = $2, updated_at = now() WHERE id = $1 AND status = 'pending'",
        [id, status]
    );
    if (rowCount === 0) {
        const existing = await getRequest(id, { includeUser: true });
        if (!existing) return null;
        throw Object.assign(new ValidationError(`This request is already ${existing.status}`), { status: 409 });
    }
    return getRequest(id, { includeUser: true });
};

// The requester can withdraw their own pending request; null when it isn't theirs / doesn't exist
export const withdrawRequest = async (id, userId) => {
    if (!isUuid(id)) return null;
    const { rowCount } = await query(
        "UPDATE adoption_requests SET status = 'withdrawn', updated_at = now() WHERE id = $1 AND user_id = $2 AND status = 'pending'",
        [id, userId]
    );
    if (rowCount === 0) return null;
    return getRequest(id);
};
