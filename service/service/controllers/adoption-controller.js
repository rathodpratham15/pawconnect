import * as adoptionService from "../services/adoption-service.js";
import { setSuccess, setError } from "./response-handler.js";

// POST /pets/:petId/adopt - the logged-in user asks to adopt a pet
export const requestAdoption = async (request, response) => {
    try {
        const result = await adoptionService.createRequest(request.params.petId, request.user._id, request.body ?? {});
        if (!result) return response.status(404).json({ message: "Pet not found" });
        if (result.duplicate) {
            return response.status(409).json({ message: "You already have a pending adoption request for this pet" });
        }
        setSuccess(result, response, 201);
    } catch (error) {
        setError(error, response);
    }
};

// GET /adoption-requests/mine
export const getMyRequests = async (request, response) => {
    try {
        setSuccess(await adoptionService.getRequestsForUser(request.user._id), response);
    } catch (error) {
        setError(error, response);
    }
};

// GET /adoption-requests?status=pending (admin)
export const getAllRequests = async (request, response) => {
    try {
        setSuccess(await adoptionService.getAllRequests(request.query.status), response);
    } catch (error) {
        setError(error, response);
    }
};

// PATCH /adoption-requests/:id/status (admin) body { status: "approved" | "rejected" }
export const decideRequest = async (request, response) => {
    try {
        const updated = await adoptionService.decideRequest(request.params.id, request.body?.status);
        if (!updated) return response.status(404).json({ message: "Adoption request not found" });
        setSuccess(updated, response);
    } catch (error) {
        setError(error, response);
    }
};

// DELETE /adoption-requests/:id - withdraw your own pending request
export const withdrawRequest = async (request, response) => {
    try {
        const updated = await adoptionService.withdrawRequest(request.params.id, request.user._id);
        if (!updated) return response.status(404).json({ message: "No pending request of yours was found" });
        setSuccess(updated, response);
    } catch (error) {
        setError(error, response);
    }
};
