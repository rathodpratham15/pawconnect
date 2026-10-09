import * as breedService from "../services/breed-service.js";
import { setSuccess, setError } from "./response-handler.js";

// GET /breeds/:species - list of breed names for "dog" or "cat"
export const getBreeds = async (request, response) => {
    try {
        const breeds = await breedService.getBreeds(request.params.species.toLowerCase());
        if (!breeds) {
            return response.status(404).json({ message: "Unsupported species. Use 'dog' or 'cat'." });
        }
        setSuccess(breeds, response);
    } catch (error) {
        setError(error, response);
    }
};

// GET /breeds/dog/image?breed=golden%20retriever - random photo of the breed
export const getDogImage = async (request, response) => {
    try {
        const { breed } = request.query;
        if (!breed) {
            return response.status(400).json({ message: "The 'breed' query parameter is required" });
        }
        const imageUrl = await breedService.getDogImage(breed);
        setSuccess({ breed, imageUrl }, response);
    } catch (error) {
        setError(error, response);
    }
};
