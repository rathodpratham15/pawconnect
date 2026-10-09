import pg from "pg";
import { SCHEMA_SQL } from "./schema.js";
import seedAdmin from "./seed-admin.js";

const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET"];

export const assertEnv = () => {
    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
};

// Everything is cached on globalThis so serverless invocations that reuse a warm instance
// (and hot reloads) share one pool instead of opening new connections on every request.
const state = globalThis.__pawconnectDb ?? (globalThis.__pawconnectDb = { pool: null, ready: null });

const getPool = () => {
    if (!state.pool) {
        if (!process.env.DATABASE_URL) throw new Error("Missing required environment variable: DATABASE_URL");
        state.pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            max: Number(process.env.PG_POOL_MAX) || 5,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000,
        });
        // An idle client erroring (e.g. Neon suspending the compute) must not crash the process
        state.pool.on("error", (error) => console.error("Unexpected database error:", error.message));
    }
    return state.pool;
};

export const query = (text, params) => getPool().query(text, params);

// Creates the tables if needed. The advisory lock stops several cold-starting
// serverless instances from racing each other while creating them.
export const ensureSchema = async () => {
    const client = await getPool().connect();
    try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(727274)");
        await client.query(SCHEMA_SQL);
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        client.release();
    }
};

export const connectDB = () => {
    if (!state.ready) {
        state.ready = (async () => {
            assertEnv();
            await ensureSchema();
            console.log("Connected to PostgreSQL");
            await seedAdmin();
        })().catch((error) => {
            state.ready = null; // allow the next request to retry
            throw error;
        });
    }
    return state.ready;
};

export const closeDB = async () => {
    if (state.pool) await state.pool.end();
    state.pool = null;
    state.ready = null;
};
