import express from "express";
import * as adoptionController from "../controllers/adoption-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Declared before "/:id" so "mine" isn't read as an id
router.get("/mine", authenticate, adoptionController.getMyRequests);

router.get("/", authenticate, authorizeRoles("ADMIN"), adoptionController.getAllRequests);
router.patch("/:id/status", authenticate, authorizeRoles("ADMIN"), adoptionController.decideRequest);
router.delete("/:id", authenticate, adoptionController.withdrawRequest);

export default router;
