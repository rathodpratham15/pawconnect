import express from "express";
import * as breedController from "../controllers/breed-controller.js";

const router = express.Router();

// Declared before "/:species" so "dog/image" isn't read as a species
router.get("/dog/image", breedController.getDogImage);
router.get("/:species", breedController.getBreeds);

export default router;
