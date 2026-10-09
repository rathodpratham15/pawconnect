'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { getUser } from '../../../auth';
import { Fundraiser, NGO, User } from '../../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

export default function FundraiserManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [verifiedNgos, setVerifiedNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Fundraiser Dialog State
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [selectedNgo, setSelectedNgo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    setUser(getUser());
    fetchFundraisers();
    fetchVerifiedNgos();
  }, []);

  const fetchFundraisers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/fundraisers');
      if (Array.isArray(res.data)) {
        setFundraisers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch fundraisers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifiedNgos = async () => {
    try {
      const res = await api.get('/ngos?status=verified');
      if (Array.isArray(res.data)) {
        setVerifiedNgos(res.data);
      }
    } catch (err) {
      console.warn('Could not load verified NGOs:', err);
    }
  };

  const canAddFundraiser = user?.role === 'NGO' || user?.role === 'ADMIN';

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !description.trim()) {
      setFormError('Title and description are required.');
      return;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      setFormError('Please enter a positive target amount.');
      return;
    }
    if (!selectedNgo) {
      setFormError('Please select a verified operating NGO.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/api/fundraisers', {
        title: title.trim(),
        description: description.trim(),
        targetAmount: Number(targetAmount),
        ngo: selectedNgo,
      });

      if (res.data) {
        setFundraisers((prev) => [res.data, ...prev]);
        setFormSuccess('Fundraiser launched successfully!');
        setOpenAddDialog(false);
        setTitle('');
        setDescription('');
        setTargetAmount('');
        setSelectedNgo('');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create fundraiser.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3.5 }}>
        <Box>
          <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
            💖 Emergency Medical & Shelter Aid
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
            Fundraiser Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
            Help shelters rescue, rehabilitate, and heal injured animals.
          </Typography>
        </Box>

        {canAddFundraiser && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddDialog(true)}
            sx={{ fontWeight: 700, borderRadius: '14px', px: 3, py: 1.2 }}
          >
            ➕ Create Fundraiser
          </Button>
        )}
      </Box>

      {formSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setFormSuccess('')}>
          {formSuccess}
        </Alert>
      )}

      {/* Fundraiser Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ECC067' }} />
        </Box>
      ) : fundraisers.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: '20px', border: '1px solid #EFE4CF' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💖</div>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C1810', mb: 1 }}>
            No active fundraisers currently
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53', maxWidth: '480px', mx: 'auto' }}>
            {canAddFundraiser
              ? 'Click "Create Fundraiser" above to start an emergency rescue or medical campaign.'
              : 'All current campaigns have met their goals or shelters are preparing new ones. Check back soon!'}
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {fundraisers.map((f) => {
            const collected = f.collectedAmount || 0;
            const target = f.targetAmount || 1;
            const percentage = Math.min(Math.round((collected / target) * 100), 100);
            const ngoName = f.ngo?.name || 'Verified Shelter Partner';

            return (
              <Card
                key={f._id}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #EFE4CF',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Chip
                    label={`Operating: ${ngoName}`}
                    size="small"
                    sx={{ backgroundColor: '#FAF5EB', color: '#2C1810', fontWeight: 700 }}
                  />
                  <Chip
                    label={`${percentage}% Funded`}
                    size="small"
                    sx={{
                      backgroundColor: percentage >= 100 ? '#E8F5E9' : '#FAF0D6',
                      color: percentage >= 100 ? '#2E7D32' : '#2C1810',
                      fontWeight: 800,
                    }}
                  />
                </Box>

                <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
                  {f.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#6E5D53', lineHeight: 1.6, flex: 1, mb: 2.5 }}>
                  {f.description}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#FAF5EB',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ECC067',
                        borderRadius: 5,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#2C1810' }}>
                      ${collected.toLocaleString()} collected
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 600 }}>
                      Goal: ${target.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => alert(`Thank you for supporting "${f.title}"! Shelter donation gateway connected.`)}
                  sx={{ fontWeight: 700, borderRadius: '12px' }}
                >
                  Donate to this Cause ❤️
                </Button>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Add Fundraiser Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#2C1810' }}>
          💖 Create an Emergency Rescue Fundraiser
        </DialogTitle>
        <DialogContent dividers>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Box component="form" id="fundraiser-form" onSubmit={handleAddSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Fundraiser Title *"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Emergency Surgery for Rescued Pup Milo"
              fullWidth
              size="small"
            />

            <TextField
              label="Target Amount (USD) *"
              required
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 1500"
              fullWidth
              size="small"
            />

            <FormControl size="small" fullWidth required>
              <InputLabel id="ngo-select-label">Verified Operating NGO *</InputLabel>
              <Select
                labelId="ngo-select-label"
                value={selectedNgo}
                label="Verified Operating NGO *"
                onChange={(e) => setSelectedNgo(e.target.value)}
              >
                {verifiedNgos.map((ngo) => (
                  <MenuItem key={ngo._id} value={ngo._id}>
                    {ngo.name} ({ngo.registrationId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Campaign Story & Medical Description *"
              required
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe why funds are needed, veterinary hospital itemization, and recovery timeline..."
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ color: '#6E5D53' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="fundraiser-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700, borderRadius: '10px' }}
          >
            {submitting ? 'Publishing...' : 'Publish Fundraiser'}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
