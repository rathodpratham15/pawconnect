'use client';

import React, { useEffect, useState } from 'react';
import api from '../../api';
import { NGO } from '../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';

export default function AdminPage() {
  const [pendingNgos, setPendingNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingNgos();
  }, []);

  const fetchPendingNgos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ngos?status=pending');
      if (Array.isArray(res.data)) {
        setPendingNgos(res.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch pending NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ngoId: string, status: 'verified' | 'rejected') => {
    setProcessingId(ngoId);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      await api.patch(`/ngos/${ngoId}/status`, { status });
      // Remove card from UI on success
      setPendingNgos((prev) => prev.filter((ngo) => ngo._id !== ngoId));
      setActionMessage(`NGO status successfully updated to "${status}". Card removed.`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || `Failed to set status to ${status}.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          🛡️ Administrator Portal
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Admin Dashboard – NGO Verification
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          Inspect submitted non-profit shelter registrations, verify credentials, and approve or reject listings.
        </Typography>
      </Box>

      {actionMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '14px' }} onClose={() => setActionMessage(null)}>
          {actionMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ECC067' }} />
        </Box>
      ) : pendingNgos.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: '20px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
            All Pending Registrations Cleared
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53' }}>
            There are currently no animal shelter organizations waiting for administrative approval.
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2C1810' }}>
            Pending Shelters ({pendingNgos.length})
          </Typography>

          {pendingNgos.map((ngo) => (
            <Card
              key={ngo._id}
              sx={{
                borderRadius: '20px',
                border: '1px solid #EFE4CF',
                p: 3,
                boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                    {ngo.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 600 }}>
                    Govt Reg ID: <strong>{ngo.registrationId}</strong>
                  </Typography>
                </div>
                <Chip
                  label="Pending Approval"
                  sx={{ backgroundColor: '#FFF3E0', color: '#E65100', fontWeight: 700 }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#5C483D', lineHeight: 1.6 }}>
                {ngo.description}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2, p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
                <div>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C1810' }}>
                    {ngo.location?.address}
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Coordinates
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C1810' }}>
                    {ngo.location?.latitude?.toFixed(4)}, {ngo.location?.longitude?.toFixed(4)}
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Contact Phone
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C1810' }}>
                    {ngo.contactInfo}
                  </Typography>
                </div>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={processingId === ngo._id}
                  onClick={() => handleUpdateStatus(ngo._id, 'rejected')}
                  sx={{ fontWeight: 700, borderRadius: '12px', px: 3 }}
                >
                  Reject Registration
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={processingId === ngo._id}
                  onClick={() => handleUpdateStatus(ngo._id, 'verified')}
                  sx={{
                    fontWeight: 700,
                    borderRadius: '12px',
                    px: 3,
                    backgroundColor: '#2E7D32',
                    '&:hover': { backgroundColor: '#1B5E20' },
                  }}
                >
                  ✓ Approve & Verify
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </main>
  );
}
