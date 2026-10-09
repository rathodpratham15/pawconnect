// Vercel serverless entry point: every request is rewritten here (see vercel.json).
// For a regular long-running server (Render, Railway, local), use server.js instead.
import express from "express";
import initialize from "../service/app.js";

const app = express();
initialize(app);

export default app;
