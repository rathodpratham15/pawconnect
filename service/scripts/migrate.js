// Creates the database tables. The API also does this automatically on first connect,
// so running this is optional (e.g. to prepare a fresh Neon database before the first deploy).
import dotenv from "dotenv";
import { closeDB, ensureSchema } from "../service/db.js";

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

ensureSchema()
    .then(() => console.log("Schema is up to date"))
    .catch((error) => {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;
    })
    .finally(closeDB);
