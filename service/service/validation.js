const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.status = 400;
    }
}

export const isUuid = (value) => typeof value === "string" && UUID_RE.test(value);

export const isEmail = (value) => typeof value === "string" && EMAIL_RE.test(value);

const present = (value) => value !== undefined && value !== null;

// Each helper validates one field and returns the cleaned value.
// With `partial` set, a missing field is skipped (returns undefined) instead of rejected.
export const requiredString = (data, field, { partial = false } = {}) => {
    const value = data[field];
    if (!present(value)) {
        if (partial) return undefined;
        throw new ValidationError(`${field} is required`);
    }
    if (typeof value !== "string" || value.trim() === "") {
        throw new ValidationError(`${field} must be a non-empty string`);
    }
    return value.trim();
};

export const optionalString = (data, field) => {
    const value = data[field];
    if (!present(value)) return undefined;
    if (typeof value !== "string") throw new ValidationError(`${field} must be a string`);
    return value.trim();
};

export const requiredNumber = (data, field, { partial = false, min } = {}) => {
    const value = data[field];
    if (!present(value) || value === "") {
        if (partial) return undefined;
        throw new ValidationError(`${field} is required`);
    }
    const number = Number(value);
    if (!Number.isFinite(number)) throw new ValidationError(`${field} must be a number`);
    if (min !== undefined && number < min) throw new ValidationError(`${field} must be at least ${min}`);
    return number;
};

export const requiredBoolean = (data, field, { partial = false } = {}) => {
    const value = data[field];
    if (!present(value)) {
        if (partial) return undefined;
        throw new ValidationError(`${field} is required`);
    }
    if (typeof value !== "boolean") throw new ValidationError(`${field} must be true or false`);
    return value;
};

export const stringArray = (data, field) => {
    const value = data[field];
    if (!present(value)) return undefined;
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
        throw new ValidationError(`${field} must be an array of strings`);
    }
    return value.map((item) => item.trim()).filter(Boolean);
};

// Drops undefined entries so only the fields the caller actually sent are updated
export const definedOnly = (object) =>
    Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
