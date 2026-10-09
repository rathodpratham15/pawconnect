import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Header";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
} from "@mui/material";
import "../styles/AdminDashboard.css";

interface NGO {
    _id: string;
    name: string;
    registrationId: string;
    location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    contactInfo: string;
    description: string;
    status: string; // 'pending', 'verified', or 'rejected'
}

const AdminDashboard: React.FC = () => {
    const [ngos, setNgos] = useState<NGO[]>([]);

    useEffect(() => {
        api
            .get<NGO[]>("/ngos?status=pending")
            .then((res) => setNgos(res.data))
            .catch((err) => console.error("Error fetching NGOs:", err));
    }, []);

    const handleApproveNGO = (ngoId: string) => {
        api
            .patch(`/ngos/${ngoId}/status`, { status: "verified" })
            .then(() => {
                setNgos((current) => current.filter((ngo) => ngo._id !== ngoId));
                alert("NGO Approved!");
            })
            .catch((err) => console.error("Error approving NGO:", err));
    };

    const handleRejectNGO = (ngoId: string) => {
        api
            .patch(`/ngos/${ngoId}/status`, { status: "rejected" })
            .then(() => {
                setNgos((current) => current.filter((ngo) => ngo._id !== ngoId));
                alert("NGO Rejected!");
            })
            .catch((err) => console.error("Error rejecting NGO:", err));
    };

    return (
        <>
            <Header bgColor="#ffffff" />
            <div className="admin-dashboard-container">
                <Typography variant="h4" gutterBottom className="dashboard-title">
                    Admin Dashboard
                </Typography>
                <Grid container spacing={3} className="ngo-grid">
                    {ngos.map((ngo) => (
                        <Grid item xs={12} sm={6} md={4} key={ngo._id}>
                            <Card className="ngo-card">
                                <CardContent>
                                    <Typography variant="h5" className="ngo-name">
                                        {ngo.name}
                                    </Typography>
                                    <Typography>
                                        <strong>Registration ID:</strong> {ngo.registrationId}
                                    </Typography>
                                    <Typography>
                                        <strong>Address:</strong> {ngo.location.address}
                                    </Typography>
                                    <Typography>
                                        <strong>Latitude:</strong> {ngo.location.latitude}
                                    </Typography>
                                    <Typography>
                                        <strong>Longitude:</strong> {ngo.location.longitude}
                                    </Typography>
                                    <Typography>
                                        <strong>Contact:</strong> {ngo.contactInfo}
                                    </Typography>
                                    <Typography>
                                        <strong>Description:</strong> {ngo.description}
                                    </Typography>
                                </CardContent>
                                <Box className="card-actions">
                                    <Button
                                        variant="contained"
                                        className="approve-button"
                                        onClick={() => handleApproveNGO(ngo._id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className="reject-button"
                                        onClick={() => handleRejectNGO(ngo._id)}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default AdminDashboard;