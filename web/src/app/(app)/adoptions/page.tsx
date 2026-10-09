'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../api';
import { AdoptionRequest, AdoptionStatus } from '../../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const STATUS_COLOR: Record<AdoptionStatus, 'default' | 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  withdrawn: 'default',
};

export default function AdoptionsPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<AdoptionRequest[]>('/adoption-requests/mine');
      setRequests(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load your adoption requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withdraw = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await api.delete<AdoptionRequest>(`/adoption-requests/${id}`);
      setRequests((current) => current.map((r) => (r._id === id ? res.data : r)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not withdraw the request.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', mb: 0.5 }}>
        My adoption requests
      </Typography>
      <Typography variant="body1" sx={{ color: '#6E5D53', mb: 3 }}>
        Requests you have sent to adopt a pet, and their current status.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '14px' }} onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ECC067' }} />
        </Box>
      ) : requests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: '20px', border: '1px solid #EFE4CF' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>No requests yet</Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53', mb: 2 }}>When you ask to adopt a pet it will show up here.</Typography>
          <Button component={Link} href="/petadopt" variant="contained" sx={{ backgroundColor: '#ECC067', color: '#2C1810', fontWeight: 700 }}>
            Browse pets
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map((request) => (
            <Card key={request._id} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #EFE4CF', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {request.pet.imageUrl && (
                <img src={request.pet.imageUrl} alt={request.pet.name || request.pet.breed} style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 12 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                  {request.pet.name || `${request.pet.breed} ${request.pet.type}`}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                  {request.pet.breed} · {request.pet.shelterLocation} · sent {new Date(request.createdAt).toLocaleDateString()}
                </Typography>
                {request.message && <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>&ldquo;{request.message}&rdquo;</Typography>}
              </Box>
              <Chip label={request.status} color={STATUS_COLOR[request.status]} sx={{ fontWeight: 700, textTransform: 'capitalize' }} />
              {request.status === 'pending' && (
                <Button variant="outlined" color="inherit" disabled={busyId === request._id} onClick={() => withdraw(request._id)}>
                  Withdraw
                </Button>
              )}
            </Card>
          ))}
        </Box>
      )}
    </main>
  );
}
