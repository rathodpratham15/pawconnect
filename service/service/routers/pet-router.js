import express from "express";
import * as PetController from "../controllers/pet-controller.js";
import * as AdoptionController from "../controllers/adoption-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Fetch all pets / register a new pet
router.route("/")
    .get(PetController.getAllPets)
    .post(authenticate, PetController.post);

// Ask to adopt a pet (any logged-in user)
router.post("/:petId/adopt", authenticate, AdoptionController.requestAdoption);

// Fetch, update or delete a pet by ID
router.route("/:petId")
    .get(PetController.getPetById)
    .put(authenticate, authorizeRoles("ADMIN", "NGO"), PetController.updatePetById)
    .delete(authenticate, authorizeRoles("ADMIN", "NGO"), PetController.deletePetById);

export default router;
