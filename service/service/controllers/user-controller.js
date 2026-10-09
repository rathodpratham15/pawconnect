import jwt from "jsonwebtoken";
import * as userService from "../services/user-service.js";
import { setSuccess, setError } from "./response-handler.js";

const TOKEN_TTL = "7d";

const pick = (source, fields) =>
    Object.fromEntries(fields.filter((field) => source[field] !== undefined).map((field) => [field, source[field]]));

// Only the owner of a profile (or an admin) may read or change it
const canAccess = (requester, userId) =>
    requester.role === "ADMIN" || requester._id === userId;

// POST request - Register a new user
export const post = async (request, response) => {
    try {
        const newUser = pick(request.body, ["name", "email", "password", "address"]);
        // Public sign-up may only create regular or NGO accounts, never admins
        newUser.role = request.body.role === "NGO" ? "NGO" : "USER";

        const user = await userService.save(newUser);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
        setSuccess({ message: "User registered", userId: user._id, token, user }, response, 201);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve the profile of the logged-in user
export const getProfile = async (request, response) => {
    setSuccess(request.user, response);
};

// GET request - Retrieve a user profile by ID
export const getUserById = async (request, response) => {
    try {
        const { userId } = request.params;
        if (!canAccess(request.user, userId)) {
            return response.status(403).json({ message: "You do not have permission to view this user" });
        }
        const user = await userService.getUserById(userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        setSuccess(user, response);
    } catch (error) {
        setError(error, response);
    }
};

// POST request - Login user
export const loginUser = async (request, response) => {
    try {
        const { email, password } = request.body;

        // Ensure both email and password are provided
        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }

        // Same response for unknown email and wrong password to avoid leaking which accounts exist
        const user = await userService.getUserByEmail(email);
        if (!user || !(await userService.checkPassword(password, user.passwordHash))) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
        setSuccess({
            message: "Login successful",
            userId: user._id,
            token,
            user: { _id: user._id, name: user.name, email: user.email, address: user.address, role: user.role },
        }, response);
    } catch (error) {
        setError(error, response);
    }
};

// PUT request - Update a user profile
export const updateUser = async (request, response) => {
    try {
        const { userId } = request.params;
        if (!canAccess(request.user, userId)) {
            return response.status(403).json({ message: "You do not have permission to update this user" });
        }

        // Role and NGO link are deliberately not updatable here
        const updatedData = pick(request.body, ["name", "email", "address", "password"]);
        const updatedUser = await userService.updateUser(userId, updatedData);
        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }
        setSuccess(updatedUser, response);
    } catch (error) {
        setError(error, response);
    }
};

// DELETE request - Delete a user profile
export const deleteUser = async (request, response) => {
    try {
        const { userId } = request.params;
        if (!canAccess(request.user, userId)) {
            return response.status(403).json({ message: "You do not have permission to delete this user" });
        }

        const deletedUser = await userService.deleteUser(userId);
        if (!deletedUser) {
            return response.status(404).json({ message: "User not found" });
        }
        setSuccess({ message: "User deleted successfully" }, response);
    } catch (error) {
        setError(error, response);
    }
};
