import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Header from "../components/Header";
import {
    Button,
    TextField,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
} from "@mui/material";
import "../styles/FundraiserManagement.css";
import api from "../api";

interface NGO {
    _id: string;
    name: string;
    description: string;
    status: string;
}

interface Fundraiser {
    _id: string;
    title: string;
    description: string;
    targetAmount: number;
    collectedAmount: number;
    ngo: NGO;
}

interface FormData {
    title: string;
    description: string;
    targetAmount: string;
    ngo: string;
}

const FundraiserManagement: React.FC = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        targetAmount: "",
        ngo: "",
    });

    const [role, setRole] = useState<string>(""); // User's role

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await api.get("/user/profile");
                setRole(res.data.role); // Set the role from the user profile
            } catch (err) {
                console.error("Error fetching user role:", err);
            }
        };

        const fetchFundraisers = async () => {
            try {
                const res = await api.get<Fundraiser[]>("/api/fundraisers");
                setFundraisers(res.data);
            } catch (err) {
                console.error("Error fetching fundraisers:", err);
            }
        };

        const fetchNGOs = async () => {
            try {
                const res = await api.get<NGO[]>("/ngos?status=verified");
                setNgos(res.data.filter((ngo) => ngo.status === "verified"));
            } catch (err) {
                console.error("Error fetching NGOs:", err);
            }
        };

        fetchUserRole();
        fetchFundraisers();
        fetchNGOs();
    }, []);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e: FormEvent): void => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.targetAmount || !formData.ngo) {
            alert("Please fill in all fields.");
            return;
        }

        const newFundraiser = {
            title: formData.title,
            description: formData.description,
            targetAmount: parseFloat(formData.targetAmount),
            collectedAmount: 0,
            ngo: formData.ngo,
        };

        api
            .post("/api/fundraisers", newFundraiser)
            .then((res) => {
                setFundraisers([...fundraisers, res.data]);
                setShowForm(false);
                setFormData({ title: "", description: "", targetAmount: "", ngo: "" });
            })
            .catch((err) => console.error("Error adding fundraiser:", err));
    };

    return (
        <>
            <Header bgColor="#ffffff" showHamburger={true} />
            <Box className="fundraiser-management" padding={3}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Fundraiser Management
                </Typography>
                {role === "NGO" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowForm(!showForm)}
                        sx={{ marginBottom: 3 }}
                    >
                        {showForm ? "Close Form" : "Add Fundraiser"}
                    </Button>
                )}
                {showForm && (
                    <form className="fundraiser-form" onSubmit={handleFormSubmit}>
                        <TextField
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={3}
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Target Amount"
                            name="targetAmount"
                            type="number"
                            value={formData.targetAmount}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <select
                            name="ngo"
                            value={formData.ngo}
                            onChange={handleInputChange}
                            required
                            className="ngo-select"
                        >
                            <option value="" disabled>
                                Select an NGO
                            </option>
                            {ngos.map((ngo) => (
                                <option key={ngo._id} value={ngo._id}>
                                    {ngo.name}
                                </option>
                            ))}
                        </select>
                        <Button type="submit" variant="contained" color="success">
                            Submit
                        </Button>
                    </form>
                )}
                <Grid container spacing={3} marginTop={3}>
                    {fundraisers.map((fundraiser) => (
                        <Grid item xs={12} sm={6} md={4} key={fundraiser._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{fundraiser.title}</Typography>
                                    <Typography>{fundraiser.description}</Typography>
                                    <Typography>
                                        Target: ${fundraiser.targetAmount.toFixed(2)}
                                    </Typography>
                                    <Typography>
                                        Collected: ${fundraiser.collectedAmount.toFixed(2)}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        NGO: {fundraiser.ngo?.name || "Unknown NGO"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default FundraiserManagement;
