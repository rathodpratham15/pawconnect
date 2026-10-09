import React, { useState, ChangeEvent, FormEvent } from "react";
import Header from "../components/Header";
import api from "../api";
import { saveSession } from "../auth";
import signupBackground from "../images/login_page_2.jpg";
import { Box, TextField, Button, Typography } from "@mui/material";
import "../styles/SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  address: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/user", formData);
      // Registration returns a token, so the new user is logged in right away
      saveSession(response.data.token, response.data.user);
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
      });
      navigate('/homepage', { replace: true });
    } catch (error: any) {
      console.error("Error adding user:", error.message);
      setError(error.response?.data?.message ?? "Could not create the account. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <Box className="signup-page" // Apply the background image to the Box component
        sx={{width: "300%", height: "100vh",
          backgroundImage: `url(${signupBackground})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}>
      <Box
          className="signUp-container"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            borderRadius: 2, 
            padding: 4, 
            boxShadow: 4, 
            width: "100%", 
            maxWidth: "500px", // Optional: Adjust width of the form
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 3 }}>
            Sign-Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              className="input-field"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }} // Add margin at the bottom of each input
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              className="input-field"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }} // Add margin at the bottom of each input
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              className="input-field"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }} // Add margin at the bottom of each input
            />
            <TextField
              label="Address"
              name="address"
              variant="outlined"
              className="input-field"
              fullWidth
              value={formData.address}
              onChange={handleChange}
              sx={{ mb: 2 }} // Add margin at the bottom of each input
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
              Add User
            </Button>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Are you an NGO? <Link to="/ngo-management">Sign up as NGO</Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SignUpPage;
