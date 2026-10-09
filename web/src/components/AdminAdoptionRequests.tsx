'use client';

import React, { useEffect, useState } from 'react';
import api from '../api';
import { AdoptionRequest } from '../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

// Admin section: pending adoption requests with approve / reject
export default function AdminAdoptionRequests() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<AdoptionRequest[]>('/adoption-requests?status=pending')
      .then((res) => setRequests(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load adoption requests.'))
      .finally(() => setLoading(false));
  }, []);

  const decide = async (id: string, status: 'approved' | 'rejected') => {
    setBusyId(id);
    setError(null);
    try {
      await api.patch(`/adoption-requests/${id}/status`, { status });
      setRequests((current) => current.filter((r) => r._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || `Could not mark the request as ${status}.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section style={{ marginTop: '3rem' }} aria-labelledby="adoption-requests-heading">
      <Typography id="adoption-requests-heading" variant="h5" component="h2" sx={{ fontWeight: 800, color: '#2C1810', mb: 0.5 }}>
        Adoption requests
      </Typography>
      <Typography variant="body2" sx={{ color: '#6E5D53', mb: 2 }}>
        People who asked to adopt a pet. Approving or rejecting records your decision for the requester.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '14px' }} onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <Typography variant="body2">Loading…</Typography>
      ) : requests.length === 0 ? (
        <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #EFE4CF' }}>
          <Typography variant="body2" sx={{ color: '#6E5D53' }}>No pending adoption requests.</Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map((request) => (
            <Card key={request._id} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #EFE4CF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2C1810' }}>
                {request.pet.name || request.pet.breed} <span style={{ fontWeight: 500 }}>({request.pet.breed}, {request.pet.shelterLocation})</span>
              </Typography>
              <Typography variant="body2" sx={{ color: '#4E3E34', mt: 0.5 }}>
                Requested by <strong>{request.user?.name}</strong> · {request.user?.email}
                {request.user?.address ? ` · ${request.user.address}` : ''} · {new Date(request.createdAt).toLocaleDateString()}
              </Typography>
              {request.message && <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>&ldquo;{request.message}&rdquo;</Typography>}
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                <Button variant="outlined" color="error" disabled={busyId === request._id} onClick={() => decide(request._id, 'rejected')}>
                  Reject
                </Button>
                <Button variant="contained" color="success" disabled={busyId === request._id} onClick={() => decide(request._id, 'approved')}>
                  Approve
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </section>
  );
}
