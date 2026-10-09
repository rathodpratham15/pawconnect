import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Header from './Header';
import { useTranslation } from 'react-i18next';

const ClipboardHandler: React.FC = () => {
  const { t } = useTranslation();
  const [clipboardText, setClipboardText] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Function to read text from the clipboard
  const readClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setClipboardText(text);
      setMessage({ type: 'success', text: t('clipboardHandler.successReadClipboard') });
    } catch (err) {
      console.error(t('clipboardHandler.errorReadClipboard'), err);
      setMessage({ type: 'error', text: t('clipboardHandler.errorReadClipboard') });
    }
  };

  // Function to write text to the clipboard
  const writeClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage({ type: 'success', text: t('clipboardHandler.successWriteClipboard') });
    } catch (err) {
      console.error(t('clipboardHandler.errorWriteClipboard'), err);
      setMessage({ type: 'error', text: t('clipboardHandler.errorWriteClipboard') });
    }
  };

  return (
    <>
      <Header showCart showHamburger />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* GIF Section */}
        <Box display="flex" justifyContent="center" mb={3}>
          <img
            src="https://rosiephillpot.com/wp-content/uploads/2021/07/Karl_Floating.gif"
            alt="Clipboard GIF"
            style={{ maxWidth: '100%', width: '200px', height: 'auto', borderRadius: '8px' }}
          />
        </Box>

        <Typography variant="h4" gutterBottom align="center">
          {t('clipboardHandler.title')}
        </Typography>

        <Card elevation={3}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <TextField
                label={t('clipboardHandler.clipboardText')}
                variant="outlined"
                multiline
                rows={4}
                value={clipboardText}
                onChange={(e) => setClipboardText(e.target.value)}
                fullWidth
              />
              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => writeClipboard(clipboardText)}
                >
                  {t('clipboardHandler.copyToClipboard')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ContentPasteIcon />}
                  onClick={readClipboard}
                >
                  {t('clipboardHandler.readFromClipboard')}
                </Button>
              </Box>
              {message && (
                <Alert severity={message.type} sx={{ mt: 2, width: '100%' }}>
                  {message.text}
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ClipboardHandler;
