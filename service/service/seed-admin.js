import { upsertAdmin } from "./services/user-service.js";

// Creates (or promotes) the admin account described by ADMIN_EMAIL / ADMIN_PASSWORD.
const seedAdmin = async () => {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

    try {
        const result = await upsertAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
        if (result === "created") console.log("Admin account created");
        if (result === "promoted") console.log("Existing account promoted to admin");
    } catch (error) {
        console.error("Failed to seed admin account:", error.message);
    }
};

export default seedAdmin;
