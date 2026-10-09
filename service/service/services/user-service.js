import bcrypt from "bcryptjs";
import { query } from "../db.js";
import {
    ValidationError, definedOnly, isEmail, isUuid, optionalString, requiredString,
} from "../validation.js";

const mapUser = (row) =>
    row && {
        _id: row.id,
        name: row.name,
        email: row.email,
        address: row.address,
        role: row.role,
        ngo: row.ngo_id ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };

const validatedEmail = (data, partial) => {
    const email = requiredString(data, "email", { partial });
    if (email === undefined) return undefined;
    if (!isEmail(email)) throw new ValidationError("email is not valid");
    return email.toLowerCase();
};

const validatedPassword = (data, partial) => {
    const password = data.password;
    if (password === undefined || password === null) {
        if (partial) return undefined;
        throw new ValidationError("password is required");
    }
    if (typeof password !== "string" || password.length < 6) {
        throw new ValidationError("password must be at least 6 characters");
    }
    return password;
};

// Save a new user to the database
export const save = async (newUser) => {
    const name = requiredString(newUser, "name");
    const email = validatedEmail(newUser, false);
    const password = await bcrypt.hash(validatedPassword(newUser, false), 10);
    const address = optionalString(newUser, "address") ?? "";
    const role = ["USER", "NGO", "ADMIN"].includes(newUser.role) ? newUser.role : "USER";

    const { rows } = await query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, password, address, role]
    );
    return mapUser(rows[0]);
};

// Get a user by its ID (null when not found or the ID is malformed)
export const getUserById = async (userId) => {
    if (!isUuid(userId)) return null;
    const { rows } = await query("SELECT * FROM users WHERE id = $1", [userId]);
    return mapUser(rows[0]) ?? null;
};

// Get a user by email, including the password hash (null when not found)
export const getUserByEmail = async (email) => {
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [String(email).toLowerCase().trim()]);
    return rows[0] ? { ...mapUser(rows[0]), passwordHash: rows[0].password } : null;
};

export const checkPassword = (plainPassword, passwordHash) => bcrypt.compare(plainPassword, passwordHash);

// Update a user profile by user ID; only the fields that were sent change
export const updateUser = async (userId, data) => {
    if (!isUuid(userId)) return null;

    const changes = definedOnly({
        name: requiredString(data, "name", { partial: true }),
        email: validatedEmail(data, true),
        address: optionalString(data, "address"),
        password: validatedPassword(data, true),
    });
    if (changes.password) changes.password = await bcrypt.hash(changes.password, 10);

    const columns = Object.keys(changes);
    if (columns.length === 0) return getUserById(userId);

    const assignments = columns.map((column, index) => `${column} = $${index + 2}`).join(", ");
    const { rows } = await query(
        `UPDATE users SET ${assignments}, updated_at = now() WHERE id = $1 RETURNING *`,
        [userId, ...columns.map((column) => changes[column])]
    );
    return mapUser(rows[0]) ?? null;
};

// Delete user by ID (null when not found)
export const deleteUser = async (userId) => {
    if (!isUuid(userId)) return null;
    const { rows } = await query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);
    return mapUser(rows[0]) ?? null;
};

// Used at startup to create/promote the admin account
export const upsertAdmin = async (email, password) => {
    const existing = await getUserByEmail(email);
    if (!existing) {
        const passwordHash = await bcrypt.hash(password, 10);
        await query(
            "INSERT INTO users (name, email, password, role) VALUES ('Admin', $1, $2, 'ADMIN')",
            [email.toLowerCase(), passwordHash]
        );
        return "created";
    }
    if (existing.role !== "ADMIN") {
        await query("UPDATE users SET role = 'ADMIN', updated_at = now() WHERE id = $1", [existing._id]);
        return "promoted";
    }
    return "unchanged";
};
