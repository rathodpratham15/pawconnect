import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SaveIcon from '@mui/icons-material/Save';
import Header from './Header';
import { useTranslation } from 'react-i18next';

const GeolocationHandler: React.FC = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Function to get geolocation
  const getGeolocation = async (): Promise<void> => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setError('');
          },
          (err) => {
            setError(`${t('geolocationHandler.locationError')} ${err.message}`);
          }
        );
      } else {
        setError(t('geolocationHandler.geolocationNotSupported'));
      }
    } catch (err) {
      setError(`${t('geolocationHandler.locationError')} ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to save location to a file
  const saveLocation = async (): Promise<void> => {
    try {
      const options = {
        suggestedName: 'location_data.txt',
        types: [
          {
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          },
        ],
      };
      // File System Access API isn't in the default TypeScript DOM typings
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const showSaveFilePicker = (window as any).showSaveFilePicker;
      if (!showSaveFilePicker) {
        setError(`${t('geolocationHandler.saveLocationError')} File saving is not supported in this browser`);
        return;
      }
      const handle = await showSaveFilePicker(options);
      const writable = await handle.createWritable();
      const locationData = location
        ? `${t('geolocationHandler.latitude')}: ${location.latitude}, ${t('geolocationHandler.longitude')}: ${location.longitude}`
        : t('geolocationHandler.locationNotAvailable');
      await writable.write(locationData);
      await writable.close();
      alert(t('geolocationHandler.locationSaved'));
    } catch (err) {
      setError(`${t('geolocationHandler.saveLocationError')} ${err}`);
    }
  };

  return (
    <>
      <Header showCart showHamburger />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* GIF Section */}
        <Box display="flex" justifyContent="center" mb={3}>
          <img
            src="https://cdn.dribbble.com/users/1201194/screenshots/7197395/media/d5d300c76b56aa290f34cfc39de99c2d.gif"
            alt="Location GIF"
            style={{
              maxWidth: '100%',
              width: '430px',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '-120px',
              marginTop: '-220px',
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom align="center">
          {t('geolocationHandler.title')}
        </Typography>

        <Card elevation={3}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MyLocationIcon />}
                onClick={getGeolocation}
                disabled={loading}
              >
                {loading ? t('geolocationHandler.loading') : t('geolocationHandler.getMyLocation')}
              </Button>
              {location && (
                <Box mt={2} textAlign="center">
                  <Typography variant="subtitle1">
                    <strong>{t('geolocationHandler.latitude')}:</strong> {location.latitude}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>{t('geolocationHandler.longitude')}:</strong> {location.longitude}
                  </Typography>
                </Box>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<SaveIcon />}
                onClick={saveLocation}
                disabled={!location}
              >
                {t('geolocationHandler.saveLocation')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default GeolocationHandler;
