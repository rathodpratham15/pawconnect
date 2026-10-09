import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Header from "../components/Header";
import { Button, TextField, Card, Typography, Grid, Container, Modal, MenuItem } from "@mui/material";
import api from "../api";
import "../styles/NgoManagement.css";


interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface NGO {
  _id: string;
  name: string;
  registrationId: string;
  location: Location;
  contactInfo: string;
  description: string;
  status: string;
}

interface FormData {
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  contactInfo: string;
  description: string;
  registrationId: string;
}

const NGOManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    latitude: "",
    longitude: "",
    address: "",
    contactInfo: "",
    description: "",
    registrationId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countryCode, setCountryCode] = useState("+1");

  const countryCodes = [
    { code: "+1", country: "US" },
    { code: "+91", country: "India" },
    { code: "+44", country: "UK" },
  ];

  useEffect(() => {
    api
      .get<NGO[]>("/ngos?status=verified")
      .then((res) => {
        setNgos(res.data);
      })
      .catch((err) => console.error("Error fetching NGOs:", err));
  }, []);

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.name.length < 5) newErrors.name = "Name must be at least 5 characters.";
    if (formData.description.length < 5) newErrors.description = "Description must be at least 5 characters.";
    if (!/^\d+$/.test(formData.contactInfo)) newErrors.contactInfo = "Contact Info must be a valid number.";
    if (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude))) {
      newErrors.latitude = "Latitude must be valid.";
      newErrors.longitude = "Longitude must be valid.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (!validateFields()) return;

    const newNgo = {
      name: formData.name,
      registrationId: formData.registrationId,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address,
      },
      contactInfo: `${countryCode}${formData.contactInfo}`,
      description: formData.description,
      status: "pending",
    };

    api
      .post<NGO>("/ngos", newNgo)
      .then(() => {
        // New NGOs stay "pending" until an admin verifies them, so they aren't listed yet
        alert("NGO submitted successfully! It will appear here once an admin approves it.");
        setShowForm(false);
        setFormData({
          name: "",
          latitude: "",
          longitude: "",
          address: "",
          contactInfo: "",
          description: "",
          registrationId: "",
        });
      })
      .catch((err) => console.error("Error adding NGO:", err));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        });
        alert("Location detected successfully!");
      },
      (error) => {
        console.error("Error detecting location:", error);
        alert("Failed to detect location.");
      }
    );
  };

  return (
    <>
      <Header bgColor="#ffffff" />
      <div className="ngo-management-container">

        <Typography variant="h4" gutterBottom className="title">
          NGO Management
        </Typography>
        <div className="ngo-button"><Button variant="contained" onClick={() => setShowForm(true)} className="add-ngo-button">
          Add NGO
        </Button></div>
        <Modal open={showForm} onClose={() => setShowForm(false)} className="modal" >
          <Container component="form" onSubmit={handleFormSubmit} className="ngo-form">
            <Typography variant="h5" gutterBottom>
              Add NGO
            </Typography>
            <TextField
              label="NGO Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Registration ID"
              name="registrationId"
              value={formData.registrationId}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Latitude"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.latitude}
              helperText={errors.latitude}
            />
            <TextField
              label="Longitude"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.longitude}
              helperText={errors.longitude}
            />
            <Button onClick={handleDetectLocation} className="detect-location">
              Detect Location
            </Button>
            <TextField
              select
              label="Country Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              fullWidth
              margin="normal"
            >
              {countryCodes.map((code) => (
                <MenuItem key={code.code} value={code.code}>
                  {code.country} ({code.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Contact Info"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.contactInfo}
              helperText={errors.contactInfo}
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
              error={!!errors.description}
              helperText={errors.description}
            />
            <Button type="submit" variant="contained" className="submit-button" sx={{
              backgroundColor: "#EEC068",
              "&:hover": {
                backgroundColor: "#d9a757", // Slightly darker shade for hover effect
              },
            }}>
              Submit
            </Button>
          </Container>
        </Modal>

        <Grid container spacing={3} className="ngo-grid">
          {ngos.map((ngo) => (
            <Grid item xs={12} sm={6} md={4} key={ngo._id}>
              <Card className="ngo-card">
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
                <Typography className={`ngo-status-${ngo.status}`}>
                  <strong>Status:</strong> {ngo.status}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default NGOManagement;
