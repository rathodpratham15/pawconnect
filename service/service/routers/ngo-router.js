import express from "express";
import {
    registerNGO,
    getAllNGOs,
    getNGOById,
    updateNGOStatus,
    updateNGO,
    deleteNGO,
} from "../controllers/ngo-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Anyone can register an NGO (it stays "pending" until an admin verifies it) and list NGOs
router.post("/", registerNGO);
router.get("/", getAllNGOs);
router.get("/:id", getNGOById);

// Admin-only moderation
router.patch("/:id/status", authenticate, authorizeRoles("ADMIN"), updateNGOStatus);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateNGO);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteNGO);

export default router;
