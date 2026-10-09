'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export default function NetworkPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [effectiveType, setEffectiveType] = useState<string>('Unknown');
  const [downlink, setDownlink] = useState<number | null>(null);
  const [rtt, setRtt] = useState<number | null>(null);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [networkInfoSupported, setNetworkInfoSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network Information API
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      setEffectiveType(connection.effectiveType || 'Unknown');
      setDownlink(connection.downlink || null);
      setRtt(connection.rtt || null);
      setSaveData(!!connection.saveData);

      const handleConnectionChange = () => {
        setEffectiveType(connection.effectiveType || 'Unknown');
        setDownlink(connection.downlink || null);
        setRtt(connection.rtt || null);
        setSaveData(!!connection.saveData);
      };

      connection.addEventListener('change', handleConnectionChange);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    } else {
      setNetworkInfoSupported(false);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ mb: 3.5, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          📶 Network Information API
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Network Connection Status
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          Real-time network connectivity monitoring and effective connection bandwidth metrics.
        </Typography>
      </Box>

      <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
        {/* Online / Offline status */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
              Connection State
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5D53' }}>
              Browser online / offline listener
            </Typography>
          </div>
          <Chip
            label={isOnline ? '🟢 Online' : '🔴 Offline'}
            sx={{
              backgroundColor: isOnline ? '#E8F5E9' : '#FFEBEE',
              color: isOnline ? '#2E7D32' : '#C62828',
              fontWeight: 800,
              fontSize: '1rem',
              px: 1.5,
              py: 2,
            }}
          />
        </Box>

        {/* Network Information Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2, mb: 3 }}>
          <Box sx={{ p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
            <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
              Effective Type
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mt: 0.5 }}>
              {effectiveType.toUpperCase()}
            </Typography>
          </Box>

          <Box sx={{ p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
            <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
              Bandwidth (Downlink)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mt: 0.5 }}>
              {downlink !== null ? `${downlink} Mbps` : 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
            <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
              Latency (RTT)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mt: 0.5 }}>
              {rtt !== null ? `${rtt} ms` : 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2, backgroundColor: '#FFFDF9', border: '1px solid #EFE4CF', borderRadius: '14px' }}>
          <Typography variant="body2" sx={{ color: '#6E5D53', mb: 0.5 }}>
            Data Saver Mode: <strong>{saveData ? 'Enabled' : 'Disabled'}</strong>
          </Typography>
          {!networkInfoSupported && (
            <Typography variant="caption" sx={{ color: '#8C7769' }}>
              ℹ️ Detailed Network Information API is not supported in this browser engine (standard online/offline detection remains fully functional).
            </Typography>
          )}
        </Box>
      </Card>
    </main>
  );
}
