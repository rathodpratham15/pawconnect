'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';
import { clearAuth, getUser, setUser } from '../../../auth';
import { User } from '../../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Delete Dialog State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const localUser = getUser();
    if (!localUser) {
      router.push('/login');
      return;
    }

    setCurrentUser(localUser);
    setName(localUser.name || '');
    setEmail(localUser.email || '');
    setAddress(localUser.address || '');

    try {
      setLoading(true);
      // Attempt GET /user/:id or GET /user/profile
      let remoteUser: User | null = null;
      try {
        const res = await api.get(`/user/${localUser._id}`);
        remoteUser = res.data;
      } catch {
        const profileRes = await api.get('/user/profile');
        remoteUser = profileRes.data;
      }

      if (remoteUser) {
        setCurrentUser(remoteUser);
        setName(remoteUser.name || '');
        setEmail(remoteUser.email || '');
        setAddress(remoteUser.address || '');
        setUser(remoteUser);
      }
    } catch (err) {
      console.warn('Could not refresh user profile from remote:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSuccessMessage('');
    setErrorMessage('');
    setUpdating(true);

    try {
      const payload: { name: string; email: string; address: string; password?: string } = {
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
      };
      if (password) {
        payload.password = password;
      }

      const res = await api.put(`/user/${currentUser._id}`, payload);
      const updated = res.data?.user || res.data || { ...currentUser, ...payload };
      setCurrentUser(updated);
      setUser(updated);
      setPassword('');
      setSuccessMessage('Profile updated successfully! 🐾');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setDeleting(true);
    try {
      await api.delete(`/user/${currentUser._id}`);
      clearAuth();
      router.push('/login');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to delete account.');
      setOpenDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#ECC067' }} />
      </Box>
    );
  }

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ mb: 3.5, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          👤 Account Management
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Your Profile
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          Manage your personal details, credentials, and notification settings.
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: '24px',
          border: '1px solid #EFE4CF',
          boxShadow: '0 4px 20px rgba(44, 24, 16, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#FAF0D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              👤
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                {currentUser?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8C7769' }}>
                Account ID: {currentUser?._id}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={currentUser?.role || 'USER'}
            sx={{ backgroundColor: '#FAF0D6', color: '#2C1810', fontWeight: 800 }}
          />
        </Box>

        <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Full Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Email Address *"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Residential / Shelter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            size="small"
            placeholder="Street address, City, Postal Code"
          />

          <TextField
            label="New Password (leave blank to keep current)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updating}
            sx={{ fontWeight: 800, py: 1.5, borderRadius: '12px', mt: 1 }}
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </Button>
        </Box>

        {/* Delete Account Section */}
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #F0E8D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#C62828' }}>
              Delete Account
            </Typography>
            <Typography variant="caption" sx={{ color: '#8C7769' }}>
              Permanently remove your account and stored adoption history.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
            sx={{ fontWeight: 700, borderRadius: '10px' }}
          >
            Delete Account
          </Button>
        </Box>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#C62828' }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6E5D53', lineHeight: 1.6 }}>
            Are you sure you want to permanently delete your PawConnect account? This action cannot be reversed, and you will be signed out immediately.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#6E5D53' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ fontWeight: 700 }}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
