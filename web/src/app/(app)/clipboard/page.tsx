'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

export default function ClipboardPage() {
  const [copyText, setCopyText] = useState('Adopt a rescued pet with PawConnect! 🐾 https://pawconnect.org');
  const [pastedText, setPastedText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = !!(navigator && navigator.clipboard);
      setIsSupported(supported);
    }
  }, []);

  const handleCopy = async () => {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!navigator.clipboard?.writeText) {
      setErrorMessage('Clipboard write API is not supported in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(copyText);
      setStatusMessage('Text copied to clipboard successfully! 📋');
    } catch (err: any) {
      setErrorMessage(`Clipboard copy error: ${err.message}`);
    }
  };

  const handlePaste = async () => {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!navigator.clipboard?.readText) {
      setErrorMessage('Clipboard read API is not supported or permission denied in this browser.');
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
      setStatusMessage('Clipboard text read successfully!');
    } catch (err: any) {
      setErrorMessage(`Clipboard paste error: ${err.message}. (Browser permissions may block reading from iframe)`);
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ mb: 3.5, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          📋 Web API Integration
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Clipboard Utility
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          Test browser asynchronous clipboard read/write capabilities for sharing rescue pet profiles.
        </Typography>
      </Box>

      {!isSupported && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '14px' }}>
          Async Clipboard API is not supported by your current browser environment.
        </Alert>
      )}

      {statusMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '14px' }} onClose={() => setStatusMessage(null)}>
          {statusMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Copy Card */}
        <Card sx={{ p: 3.5, borderRadius: '24px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
            Copy to Clipboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53', mb: 2 }}>
            Write rescue link text or pet bio directly into system clipboard.
          </Typography>

          <TextField
            multiline
            rows={3}
            fullWidth
            value={copyText}
            onChange={(e) => setCopyText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleCopy}
            sx={{ fontWeight: 800, borderRadius: '12px', px: 3, py: 1 }}
          >
            📋 Copy Text
          </Button>
        </Card>

        {/* Paste Card */}
        <Card sx={{ p: 3.5, borderRadius: '24px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
            Read from Clipboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53', mb: 2 }}>
            Read text currently saved in your device clipboard.
          </Typography>

          <Button
            variant="outlined"
            onClick={handlePaste}
            sx={{ fontWeight: 800, borderRadius: '12px', px: 3, py: 1, borderColor: '#ECC067', color: '#2C1810', mb: 2 }}
          >
            📥 Paste from Clipboard
          </Button>

          {pastedText && (
            <Box sx={{ p: 2, backgroundColor: '#FAF5EB', borderRadius: '14px', border: '1px solid #EFE4CF' }}>
              <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, display: 'block', mb: 0.5 }}>
                Clipboard Contents:
              </Typography>
              <Typography variant="body2" sx={{ color: '#2C1810', whiteSpace: 'pre-wrap' }}>
                {pastedText}
              </Typography>
            </Box>
          )}
        </Card>
      </Box>
    </main>
  );
}
