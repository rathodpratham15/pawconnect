import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { saveSession } from '../auth';
import loginBackground from '../images/login_page_1.jpg';
import Header from '../components/Header';
import { Box, Button, TextField, Typography, Container } from '@mui/material'; // Importing Material UI components
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/login', formData);
      saveSession(response.data.token, response.data.user);
      setMessage('Login Successful');
      // Go back to the page the user originally wanted, otherwise the home page
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      navigate(from && from !== '/login' ? from : '/homepage', { replace: true });
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data?.message ?? 'Login failed. Please try again.');
      } else {
        setMessage('Server error. Please try again later.');
      }
    }
  };

  return (
    <>
      <Header />
      <Box 
        className="login-page" // Apply the background image to the Box component
        sx={{width: "330%", height: "100vh",
          backgroundImage: `url(${loginBackground})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}
      >
        <Container component="main" maxWidth="xs"> 
          {/* Container for the form */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: 2,
              padding: 4,
              boxShadow: 4, 
            }}
          >
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>Sign-in / Login</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
              >
                Login
              </Button>
              <Typography variant="body2" color="textSecondary" align="center">
                {message}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link to="/signup">Sign-up</Link>
              </Typography>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
