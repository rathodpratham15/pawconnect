'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function BluetoothPage() {
  const [isSupported, setIsSupported] = useState(false);
  const [device, setDevice] = useState<{ name?: string; id?: string } | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = !!(navigator && (navigator as any).bluetooth);
      setIsSupported(supported);
    }
  }, []);

  const handleRequestDevice = async () => {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!(navigator as any).bluetooth) {
      setErrorMessage('Web Bluetooth API is not supported in this browser or iframe context.');
      return;
    }

    setConnecting(true);

    try {
      // Request device with battery service or any device
      const btDevice = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'],
      });

      setDevice({ name: btDevice.name || 'Unnamed Bluetooth Device', id: btDevice.id });
      setStatusMessage(`Connected to device: ${btDevice.name || 'Bluetooth Device'}`);

      // Attempt to read battery service
      if (btDevice.gatt) {
        try {
          const server = await btDevice.gatt.connect();
          const service = await server.getPrimaryService('battery_service');
          const characteristic = await service.getCharacteristic('battery_level');
          const value = await characteristic.readValue();
          const battery = value.getUint8(0);
          setBatteryLevel(battery);
        } catch {
          // Device may not implement battery_service
          setBatteryLevel(null);
        }
      }
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setErrorMessage(`Bluetooth connection: ${err.message}`);
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ mb: 3.5, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          🔷 Web Bluetooth API
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Bluetooth Device Connect
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          Connect smart pet collars, GPS activity monitors, and automated feeders via Bluetooth Low Energy (BLE).
        </Typography>
      </Box>

      {!isSupported && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '14px' }}>
          Web Bluetooth API is not supported by your current browser engine or is blocked by iframe policy. Chromium-based desktop browsers (Chrome, Edge) support BLE when run in top-level windows with HTTPS.
        </Alert>
      )}

      {statusMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '14px' }} onClose={() => setStatusMessage(null)}>
          {statusMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '14px' }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
          Pair Smart Pet Collar or Device
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5D53', mb: 3 }}>
          Click the button below to prompt the browser device selector for nearby BLE accessories.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRequestDevice}
          disabled={connecting || !isSupported}
          sx={{ fontWeight: 800, borderRadius: '12px', px: 3, py: 1.2, mb: 3 }}
        >
          {connecting ? 'Searching for devices...' : '🔷 Request Bluetooth Device'}
        </Button>

        {device && (
          <Box sx={{ p: 2.5, backgroundColor: '#FAF5EB', borderRadius: '16px', border: '1px solid #EFE4CF' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2C1810', mb: 0.5 }}>
              Connected Accessory: {device.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8C7769', display: 'block', mb: 1.5 }}>
              Hardware ID: {device.id}
            </Typography>
            {batteryLevel !== null ? (
              <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                🔋 Device Battery Level: {batteryLevel}%
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                ℹ️ Connected (Device does not broadcast standard GATT battery_service).
              </Typography>
            )}
          </Box>
        )}
      </Card>
    </main>
  );
}
