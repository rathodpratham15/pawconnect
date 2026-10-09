import express from "express";
import {
    createFundraiser,
    getFundraisers,
    updateFundraiser,
    deleteFundraiser,
} from "../controllers/fundraiser-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST: Create a fundraiser (NGO role or admin)
router.post("/", authenticate, authorizeRoles("NGO", "ADMIN"), createFundraiser);

// GET: Retrieve all fundraisers (accessible to all roles)
router.get("/", authenticate, authorizeRoles("USER", "NGO", "ADMIN"), getFundraisers);

// PATCH: Update a fundraiser (owner NGO or admin)
router.patch("/:id", authenticate, authorizeRoles("NGO", "ADMIN"), updateFundraiser);

// DELETE: Delete a fundraiser (owner NGO or admin)
router.delete("/:id", authenticate, authorizeRoles("NGO", "ADMIN"), deleteFundraiser);

export default router;
