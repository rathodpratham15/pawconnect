import initializeRoutes from "./routers/index.js";
import cors from "cors";
import express from "express";
import { connectDB } from "./db.js";

const initialize = (app) => {
    // Middleware for CORS and parsing requests
    const origins = (process.env.CORS_ORIGIN || "*")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use(cors({ origin: origins.includes("*") ? true : origins }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Health check (used by hosting platforms)
    app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

    // Make sure the database is connected before any route runs
    // (a no-op once connected; needed for serverless cold starts)
    app.use(async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch (error) {
            console.error("Database connection failed:", error.message);
            res.status(503).json({ message: "Service temporarily unavailable" });
        }
    });

    // Initialize routes
    initializeRoutes(app);

    // Catch-all route for undefined endpoints
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            code: "NotFound",
            message: "The requested resource was not found.",
        });
    });

    // Global error handling middleware
    app.use((err, req, res, next) => {
        console.error("An error occurred:", err.stack);
        res.status(err.status || 500).json({
            message: err.message || "Internal Server Error",
        });
    });
};

export default initialize;
