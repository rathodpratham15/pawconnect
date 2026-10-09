import * as FoodProductService from "./../services/foodProduct-service.js";
import { setSuccess, setError } from "./response-handler.js"; // Import response handler functions

export const post = async (request, response) => {
    try {
        const newFoodProduct = { ...request.body };
        const foodProduct = await FoodProductService.save(newFoodProduct);
        setSuccess(foodProduct, response, 201);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve all food products
export const getAllFoodProducts = async (request, response) => {
    try {
        const foodProducts = await FoodProductService.getAllFoodProducts();
        setSuccess(foodProducts, response);
    } catch (error) {
        setError(error, response);
    }
};

// GET request - Retrieve a food product by ID
export const getFoodProductById = async (request, response) => {
    try {
        const { foodProductId } = request.params;
        const foodProduct = await FoodProductService.getFoodProductById(foodProductId);

        if (!foodProduct) {
            return response.status(404).json({ message: "Food product not found" });
        }

        setSuccess(foodProduct, response);
    } catch (error) {
        setError(error, response);
    }
};
