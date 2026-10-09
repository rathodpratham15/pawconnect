'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getUser } from '../../../auth';
import { User } from '../../../types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export default function Homepage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const featureCards = [
    {
      title: 'Adopt a Pet',
      desc: 'Browse filtered rescue listings, view health records, and submit adoption inquiries.',
      icon: '🐶',
      href: '/petadopt',
      color: '#ECC067',
    },
    {
      title: 'Food Products',
      desc: 'Order vet-approved formulas and healthy organic treats for dogs and cats.',
      icon: '🥫',
      href: '/foodproducts',
      color: '#F4D288',
    },
    {
      title: 'Diet Generator',
      desc: 'Compute scientific daily caloric and nutrient intake for your pet.',
      icon: '🥣',
      href: '/dietgenerator',
      color: '#E8D2A6',
    },
    {
      title: 'Pet Care Hub',
      desc: 'Find nearby veterinary hospitals, pet grooming salons, and animal therapy.',
      icon: '🩺',
      href: '/petcare',
      color: '#D8ECD5',
    },
    {
      title: 'Fundraiser Campaigns',
      desc: 'Directly support emergency medical treatments and shelter rescue efforts.',
      icon: '💖',
      href: '/fundraisermanagement',
      color: '#F9D5CE',
    },
    {
      title: 'NGO Near Me',
      desc: 'Interactive map and directions to local verified animal shelters.',
      icon: '📍',
      href: '/ngo',
      color: '#E3DCF5',
    },
  ];

  return (
    <main style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          backgroundColor: '#FFFDF9',
          border: '1px solid #EFE4CF',
          borderRadius: '24px',
          padding: { xs: '2rem 1.5rem', md: '2.5rem' },
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px rgba(44, 24, 16, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
          <Chip
            label={user?.role === 'ADMIN' ? '🛡️ Administrator' : user?.role === 'NGO' ? '🏛️ NGO Shelter' : '🐾 Pet Parent'}
            sx={{ backgroundColor: '#FAF0D6', color: '#2C1810', fontWeight: 700 }}
          />
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', marginBottom: 1 }}>
          Welcome back, {user?.name || 'Friend'}! 🐾
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', maxWidth: '700px', lineHeight: 1.6 }}>
          Explore adoptable pets, manage custom nutrition diets, browse verified non-profit animal shelters, or locate certified vets in your area.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 3 }}>
          <Button
            component={Link}
            href="/petadopt"
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, borderRadius: '12px' }}
          >
            Find Rescues to Adopt
          </Button>
          <Button
            component={Link}
            href="/dietgenerator"
            variant="outlined"
            sx={{ fontWeight: 700, borderRadius: '12px', borderColor: '#ECC067', color: '#2C1810' }}
          >
            Generate Pet Diet
          </Button>
        </Box>
      </Box>

      {/* Grid of features */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: '#2C1810', marginBottom: 2.5 }}>
        Quick Access Portals
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {featureCards.map((feat) => (
          <Card
            key={feat.title}
            sx={{
              borderRadius: '20px',
              border: '1px solid #EFE4CF',
              boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 24px rgba(44, 24, 16, 0.08)',
              },
            }}
          >
            <CardContent sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box
                sx={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: feat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: 2,
                }}
              >
                {feat.icon}
              </Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: '#2C1810', marginBottom: 1 }}>
                {feat.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6E5D53', lineHeight: 1.5, flex: 1, marginBottom: 2.5 }}>
                {feat.desc}
              </Typography>
              <Button
                component={Link}
                href={feat.href}
                variant="contained"
                sx={{
                  backgroundColor: '#FAF5EB',
                  color: '#2C1810',
                  fontWeight: 700,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#ECC067' },
                }}
              >
                Open {feat.title} →
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Device Utilities Section */}
      <Box sx={{ marginTop: 5, padding: '2rem', backgroundColor: '#FAF5EB', borderRadius: '20px', border: '1px solid #EFE4CF' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', marginBottom: 1 }}>
          Device & Sensor Utilities
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5D53', marginBottom: 2 }}>
          Access device hardware APIs integrated into PawConnect:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button component={Link} href="/geolocation" variant="outlined" size="small" sx={{ borderColor: '#DCD0BE', color: '#2C1810' }}>
            📍 Geolocation
          </Button>
          <Button component={Link} href="/clipboard" variant="outlined" size="small" sx={{ borderColor: '#DCD0BE', color: '#2C1810' }}>
            📋 Clipboard
          </Button>
          <Button component={Link} href="/network" variant="outlined" size="small" sx={{ borderColor: '#DCD0BE', color: '#2C1810' }}>
            📶 Network Status
          </Button>
          <Button component={Link} href="/bluetooth" variant="outlined" size="small" sx={{ borderColor: '#DCD0BE', color: '#2C1810' }}>
            🔷 Bluetooth
          </Button>
          {user?.role === 'ADMIN' && (
            <Button component={Link} href="/admin" variant="contained" color="secondary" size="small">
              🛡️ Admin Verification
            </Button>
          )}
        </Box>
      </Box>
    </main>
  );
}
