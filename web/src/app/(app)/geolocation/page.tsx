'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function GeolocationPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [hasFileSystemAccess, setHasFileSystemAccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasFileSystemAccess('showSaveFilePicker' in window);
    }
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    setSaveSuccess(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(`Unable to retrieve location: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveToFile = async () => {
    if (!coords) return;
    setError(null);
    setSaveSuccess(null);

    const dataString = JSON.stringify(
      {
        app: 'PawConnect',
        timestamp: new Date().toISOString(),
        coordinates: {
          latitude: coords.lat,
          longitude: coords.lng,
          accuracyMeters: coords.accuracy,
        },
      },
      null,
      2
    );

    // Feature detect File System Access API
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `pawconnect-location-${Date.now()}.json`,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(dataString);
        await writable.close();
        setSaveSuccess('Coordinates saved to file successfully via File System Access API!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(`File save failed: ${err.message}`);
        }
      }
    } else {
      // Fallback download if File System Access API is not supported in browser/iframe
      try {
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pawconnect-location-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSaveSuccess('File downloaded via browser download fallback (File System Access API not supported in this environment).');
      } catch (err: any) {
        setError(`Download failed: ${err.message}`);
      }
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ mb: 3.5, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          📍 Device Hardware API
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Geolocation Utility
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          Detect GPS coordinates and export location logs directly using the File System Access API.
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '14px' }}>
          {error}
        </Alert>
      )}

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '14px' }}>
          {saveSuccess}
        </Alert>
      )}

      <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
            Current Coordinates
          </Typography>
          <Button
            variant="outlined"
            onClick={detectLocation}
            disabled={loading}
            sx={{ borderColor: '#ECC067', color: '#2C1810', fontWeight: 700 }}
          >
            {loading ? 'Detecting...' : '↻ Refresh Location'}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#ECC067' }} />
          </Box>
        ) : coords ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box sx={{ p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
                <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700 }}>
                  Latitude
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mt: 0.5 }}>
                  {coords.lat.toFixed(6)}°
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
                <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700 }}>
                  Longitude
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mt: 0.5 }}>
                  {coords.lng.toFixed(6)}°
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 1.5, backgroundColor: '#FFFDF9', border: '1px solid #EFE4CF', borderRadius: '12px' }}>
              <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                Accuracy Radius: ±{Math.round(coords.accuracy)} meters
              </Typography>
            </Box>

            {/* File System Access API Info */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', mb: 0.5 }}>
                File System Access API Status:
              </Typography>
              <Typography variant="body2" sx={{ color: hasFileSystemAccess ? '#2E7D32' : '#8C5E3C', fontWeight: 600 }}>
                {hasFileSystemAccess
                  ? '✓ Supported: Can trigger window.showSaveFilePicker'
                  : 'ℹ️ Not Supported in this browser engine (Automatic file download fallback will be used)'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveToFile}
              sx={{ fontWeight: 800, py: 1.5, borderRadius: '12px', mt: 1 }}
            >
              💾 Save Coordinates to Local File
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: '#6E5D53', textAlign: 'center', py: 3 }}>
            Coordinates not yet detected. Click &quot;Refresh Location&quot; to allow browser geolocation.
          </Typography>
        )}
      </Card>
    </main>
  );
}
