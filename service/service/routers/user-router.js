import express from 'express';
import * as userController from "../controllers/user-controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST route to register a new user
router.route('/')
    .post(userController.post);

// POST route for user login
router.route("/login")
    .post(userController.loginUser);

// GET route for the logged-in user's own profile (must be declared before "/:userId")
router.route("/profile")
    .get(authenticate, userController.getProfile);

// Retrieve, update or delete a user by its ID (owner or admin only)
router.route("/:userId")
    .get(authenticate, userController.getUserById)
    .put(authenticate, userController.updateUser)
    .delete(authenticate, userController.deleteUser);

export default router;
