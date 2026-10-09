import ngoService from "../services/ngo-service.js";
import { setError } from "./response-handler.js";

// The UI says "approved", the data model says "verified" - accept both spellings
const normalizeStatus = (status) => (status === "approved" ? "verified" : status);

const NGO_STATUSES = ["pending", "verified", "rejected"];
const UPDATABLE_FIELDS = ["name", "registrationId", "location", "contactInfo", "description"];

export const registerNGO = async (req, res) => {
    try {
        const ngo = await ngoService.createNGO(req.body);
        res.status(201).json(ngo);
    } catch (err) {
        setError(err, res);
    }
};

export const getAllNGOs = async (req, res) => {
    try {
        const status = normalizeStatus(req.query.status); // Accept a status filter
        if (status && !NGO_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const ngos = await ngoService.findAllNGOs(status ? { status } : {});
        res.status(200).json(ngos);
    } catch (err) {
        setError(err, res);
    }
};

export const getNGOById = async (req, res) => {
    try {
        const ngo = await ngoService.findNGOById(req.params.id);
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(ngo);
    } catch (err) {
        setError(err, res);
    }
};

export const updateNGOStatus = async (req, res) => {
    const { id } = req.params;
    const status = normalizeStatus(req.body.status);

    if (!["verified", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const ngo = await ngoService.updateNGOStatus(id, status);
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(ngo);
    } catch (err) {
        setError(err, res);
    }
};

export const verifyNGO = async (req, res) => {
    try {
        const ngo = await ngoService.updateNGOStatus(req.params.id, "verified");
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(ngo);
    } catch (err) {
        setError(err, res);
    }
};

export const updateNGO = async (req, res) => {
    const { id } = req.params;
    // Status can only change through the dedicated admin endpoint
    const ngoData = Object.fromEntries(
        UPDATABLE_FIELDS.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]])
    );

    try {
        const updatedNgo = await ngoService.updateNGO(id, ngoData);
        if (!updatedNgo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(updatedNgo);
    } catch (err) {
        setError(err, res);
    }
};

export const deleteNGO = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNgo = await ngoService.deleteNGO(id);
        if (!deletedNgo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json({ message: "NGO deleted successfully" });
    } catch (err) {
        setError(err, res);
    }
};
