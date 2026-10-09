'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';

const libraries: ('places')[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '480px',
  borderRadius: '20px',
};

interface PlaceItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
}

interface NearbyPlacesMapProps {
  pageTitle: string;
  badge: string;
  subtitle: string;
  keyword: string;
  fallbackSamplePlaces?: PlaceItem[];
}

export function NearbyPlacesMap({
  pageTitle,
  badge,
  subtitle,
  keyword,
  fallbackSamplePlaces = [],
}: NearbyPlacesMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [geoStatus, setGeoStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [geoError, setGeoError] = useState<string | null>(null);

  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [searchingPlaces, setSearchingPlaces] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Request browser geolocation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newCenter);
          setGeoStatus('granted');
        },
        (err) => {
          setGeoStatus('denied');
          setGeoError(`Location access was not enabled (${err.message}). Showing regional view.`);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGeoStatus('denied');
      setGeoError('Geolocation is not supported by your browser.');
    }
  }, []);

  const searchNearby = useCallback(
    (map: google.maps.Map, location: { lat: number; lng: number }) => {
      if (!window.google?.maps?.places) return;

      setSearchingPlaces(true);
      const service = new window.google.maps.places.PlacesService(map);

      const request: google.maps.places.PlaceSearchRequest = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 5000,
        keyword,
      };

      service.nearbySearch(request, (results, status) => {
        setSearchingPlaces(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const mapped: PlaceItem[] = results.map((place, idx) => ({
            id: place.place_id || String(idx),
            name: place.name || 'Local Service',
            address: place.vicinity || 'Local area address',
            lat: place.geometry?.location?.lat() || location.lat,
            lng: place.geometry?.location?.lng() || location.lng,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
          }));
          setPlaces(mapped);
          if (mapped.length > 0) setSelectedPlace(mapped[0]);
        } else {
          // If no live results found or API key quota exceeded, provide friendly fallbacks
          if (fallbackSamplePlaces.length > 0) {
            setPlaces(fallbackSamplePlaces);
            setSelectedPlace(fallbackSamplePlaces[0]);
          } else {
            setPlaces([]);
          }
        }
      });
    },
    [keyword, fallbackSamplePlaces]
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      searchNearby(map, center);
    },
    [center, searchNearby]
  );

  // If center updates after permission granted, trigger search
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      searchNearby(mapRef.current, center);
    }
  }, [center, isLoaded, searchNearby]);

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          {badge}
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          {pageTitle}
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>

      {geoError && (
        <Alert severity="info" sx={{ mb: 2.5, borderRadius: '14px' }}>
          {geoError}
        </Alert>
      )}

      {/* Main Grid: Left List (1 col), Right Map (2 cols) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 3, alignItems: 'start' }}>
        {/* Left Side: Places List */}
        <Card
          sx={{
            borderRadius: '20px',
            border: '1px solid #EFE4CF',
            p: 2.5,
            maxHeight: { xs: 'auto', lg: '600px' },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #F0E8D9' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', textTransform: 'uppercase' }}>
              Nearby Locations ({places.length})
            </Typography>
            {searchingPlaces && <CircularProgress size={18} sx={{ color: '#ECC067' }} />}
          </Box>

          {places.length === 0 && !searchingPlaces ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                No nearby locations detected within 5km radius.
              </Typography>
            </Box>
          ) : (
            places.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              return (
                <Box
                  key={place.id}
                  onClick={() => {
                    setSelectedPlace(place);
                    if (mapRef.current) {
                      mapRef.current.panTo({ lat: place.lat, lng: place.lng });
                    }
                  }}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: isSelected ? '#ECC067' : '#EFE4CF',
                    backgroundColor: isSelected ? '#FAF0D6' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#FAF5EB',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2C1810', mb: 0.3 }}>
                    {place.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6E5D53', fontSize: '0.85rem', mb: 1 }}>
                    📍 {place.address}
                  </Typography>
                  {place.rating !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <span style={{ color: '#D4A74E' }}>★</span>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2C1810' }}>
                        {place.rating}
                      </Typography>
                      {place.userRatingsTotal && (
                        <Typography variant="caption" sx={{ color: '#8C7769' }}>
                          ({place.userRatingsTotal} reviews)
                        </Typography>
                      )}
                    </Box>
                  )}
                  <Button
                    size="small"
                    component="a"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderColor: '#DCD0BE',
                      color: '#2C1810',
                      borderRadius: '8px',
                      textTransform: 'none',
                    }}
                  >
                    Get Directions →
                  </Button>
                </Box>
              );
            })
          )}
        </Card>

        {/* Right Side: Map Display */}
        <Card
          sx={{
            borderRadius: '20px',
            border: '1px solid #EFE4CF',
            height: { xs: '450px', md: '600px' },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
          }}
        >
          {loadError ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="warning">
                Google Maps could not load with the provided key. Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
              </Alert>
            </Box>
          ) : !isLoaded ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
              <CircularProgress sx={{ color: '#ECC067' }} />
              <Typography variant="body2" sx={{ color: '#6E5D53', fontWeight: 600 }}>
                Loading Google Maps & Places...
              </Typography>
            </Box>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onLoad={onMapLoad}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {/* User location pin */}
              <Marker
                position={center}
                title="Your Location"
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                }}
              />

              {/* Places markers */}
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  title={place.name}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}

              {/* InfoWindow */}
              {selectedPlace && (
                <InfoWindow
                  position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div style={{ padding: '6px', maxWidth: '240px', color: '#2C1810' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                      {selectedPlace.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6E5D53', marginBottom: '8px' }}>
                      {selectedPlace.address}
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#ECC067',
                        color: '#2C1810',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      Get Directions ↗
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </Card>
      </Box>
    </main>
  );
}

export default NearbyPlacesMap;
