import * as petService from "../services/pet-service.js";
import { setSuccess, setError } from "./response-handler.js";

// POST request - Register a new pet
export const post = async (request, response) => {
    try {
        const newPet = { ...request.body };
        const pet = await petService.save(newPet);
        setSuccess(pet, response, 201);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve a pet profile by ID
export const getPetById = async (request, response) => {
    try {
        const { petId } = request.params;
        const pet = await petService.getPetById(petId);
        if (!pet) {
            return response.status(404).json({ message: "Pet not found" });
        }
        setSuccess(pet, response);
    } catch (error) {
        setError(error, response);
    }
};

// PUT request - Update a pet profile by ID
export const updatePetById = async (request, response) => {
    try {
        const { petId } = request.params;
        const updates = { ...request.body };
        const updatedPet = await petService.updatePetById(petId, updates);

        if (!updatedPet) {
            return response.status(404).json({ message: "Pet not found" });
        }

        setSuccess(updatedPet, response);
    } catch (error) {
        setError(error, response);
    }
};

// DELETE request - Remove a pet profile by ID
export const deletePetById = async (request, response) => {
    try {
        const { petId } = request.params;
        const deletedPet = await petService.deletePetById(petId);

        if (!deletedPet) {
            return response.status(404).json({ message: "Pet not found" });
        }

        setSuccess({ message: "Pet deleted successfully" }, response);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve all pets
export const getAllPets = async (request, response) => {
    try {
        const pets = await petService.getAllPets();
        setSuccess(pets, response);
    } catch (error) {
        setError(error, response);
    }
};
