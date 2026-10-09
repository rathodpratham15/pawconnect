import * as fundraiserService from "../services/fundraiser-service.js";
import ngoService from "../services/ngo-service.js";
import { setError } from "./response-handler.js";

// Admins manage everything; NGO accounts only manage fundraisers of the NGO linked to them
const ownsFundraiser = (user, fundraiser) =>
    user.role === "ADMIN" || (user.ngo && fundraiser.ngo === user.ngo);

// Create a new fundraiser (NGO / admin role only)
export const createFundraiser = async (req, res) => {
    try {
        // NGO accounts linked to an NGO can only raise funds for that NGO
        const ngoId = req.user.role === "NGO" && req.user.ngo ? req.user.ngo : req.body.ngo;

        const ngo = await ngoService.findNGOById(ngoId);
        if (!ngo || ngo.status !== "verified") {
            return res.status(403).json({ message: "NGO is not verified" });
        }

        const fundraiser = await fundraiserService.createFundraiser(req.body, ngo._id);
        res.status(201).json(fundraiser);
    } catch (error) {
        setError(error, res);
    }
};

// Get all fundraisers (accessible to all roles)
export const getFundraisers = async (req, res) => {
    try {
        const fundraisers = await fundraiserService.getFundraisers();
        res.status(200).json(fundraisers);
    } catch (error) {
        setError(error, res);
    }
};

// Update a fundraiser (owner NGO / admin only)
export const updateFundraiser = async (req, res) => {
    try {
        const fundraiser = await fundraiserService.getFundraiserById(req.params.id);
        if (!fundraiser) {
            return res.status(404).json({ message: "Fundraiser not found" });
        }

        if (!ownsFundraiser(req.user, fundraiser)) {
            return res
                .status(403)
                .json({ message: "You are not authorized to update this fundraiser" });
        }

        const updated = await fundraiserService.updateFundraiser(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        setError(error, res);
    }
};

// Delete a fundraiser (owner NGO / admin only)
export const deleteFundraiser = async (req, res) => {
    try {
        const fundraiser = await fundraiserService.getFundraiserById(req.params.id);
        if (!fundraiser) {
            return res.status(404).json({ message: "Fundraiser not found" });
        }

        if (!ownsFundraiser(req.user, fundraiser)) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this fundraiser" });
        }

        await fundraiserService.deleteFundraiser(req.params.id);
        res.status(200).json({ message: "Fundraiser deleted successfully" });
    } catch (error) {
        setError(error, res);
    }
};
