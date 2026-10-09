import express from "express";
import * as foodProductController from "./../controllers/foodProduct-controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route('/')
    .get(foodProductController.getAllFoodProducts)
    .post(authenticate, authorizeRoles("ADMIN"), foodProductController.post);

// GET route to retrieve a food product by its ID
router.route("/:foodProductId")
    .get(foodProductController.getFoodProductById);

export default router;
