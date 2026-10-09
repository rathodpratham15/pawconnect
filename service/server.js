import dotenv from "dotenv";
import express from "express";
import initialize from "./service/app.js";
import { assertEnv, connectDB } from "./service/db.js";

dotenv.config();

try {
    assertEnv();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3002;

initialize(app);

// Connect eagerly so problems show up at startup (requests also connect on demand)
connectDB().catch((error) => console.error("Database connection error:", error.message));

// On Vercel the platform runs the exported app itself; everywhere else we listen on a port
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Listening to port ${port}`);
    });
}

export default app;
