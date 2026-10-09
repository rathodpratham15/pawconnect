'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function PetCareHubPage() {
  const carePortals = [
    {
      title: 'Veterinary Clinics Near Me',
      desc: 'Find certified animal hospitals and 24/7 emergency veterinary clinics with live GPS directions.',
      icon: '🩺',
      href: '/vet',
      bgColor: '#FAF0D6',
      badge: 'Certified Care',
    },
    {
      title: 'Pet Grooming Salons',
      desc: 'Discover trusted pet hygiene salons, organic coat spas, and professional claw trim specialists.',
      icon: '✂️',
      href: '/petsalon',
      bgColor: '#F5E6DC',
      badge: 'Hygiene & Spas',
    },
    {
      title: 'Food Products & Nutrition',
      desc: 'Shop vet-recommended wholesome kibble, organic broths, and essential Omega supplements.',
      icon: '🥫',
      href: '/foodproducts',
      bgColor: '#F4D288',
      badge: 'Nutritional Health',
    },
    {
      title: 'Custom Diet Generator',
      desc: 'Scientifically compute daily target calories, protein grams, and hydration schedules for dogs and cats.',
      icon: '🥣',
      href: '/dietgenerator',
      bgColor: '#E8D2A6',
      badge: 'AI & Math Algorithm',
    },
    {
      title: 'Animal Therapy & Wellness',
      desc: 'Connect with certified animal-assisted therapy centers, behavioral trainers, and mobility physio.',
      icon: '🐾',
      href: '/pettherapy',
      bgColor: '#D8ECD5',
      badge: 'Emotional & Physical Rehab',
    },
  ];

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundColor: '#2C1810',
          color: '#FFFDF9',
          borderRadius: '24px',
          padding: { xs: '2.5rem 1.5rem', md: '3.5rem 3rem' },
          marginBottom: '3rem',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(236, 192, 103, 0.18) 0%, transparent 60%)',
          border: '1px solid #4E3E34',
        }}
      >
        <Box sx={{ display: 'inline-block', backgroundColor: 'rgba(236, 192, 103, 0.2)', color: '#ECC067', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', mb: 1.5 }}>
          🩺 Comprehensive Animal Wellness
        </Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 1.5, fontSize: { xs: '2rem', md: '2.8rem' } }}>
          Pet Care & Wellness Hub
        </Typography>
        <Typography variant="body1" sx={{ color: '#D5C4B4', maxWidth: '720px', lineHeight: 1.6, fontSize: '1.05rem' }}>
          Everything your companion needs to thrive throughout every stage of life. Browse verified local veterinary hospitals, certified grooming parlors, behavioral therapy, and precision nutrition tools.
        </Typography>
      </Box>

      {/* Grid of 5 Pet Care Portals */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {carePortals.map((portal) => (
          <Card
            key={portal.title}
            sx={{
              borderRadius: '20px',
              border: '1px solid #EFE4CF',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 24px rgba(44, 24, 16, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: portal.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                }}
              >
                {portal.icon}
              </Box>
              <Box sx={{ backgroundColor: '#FAF5EB', color: '#6E5D53', px: 1.2, py: 0.4, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                {portal.badge}
              </Box>
            </Box>

            <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
              {portal.title}
            </Typography>

            <Typography variant="body2" sx={{ color: '#6E5D53', lineHeight: 1.6, flex: 1, mb: 2.5 }}>
              {portal.desc}
            </Typography>

            <Button
              component={Link}
              href={portal.href}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#FAF5EB',
                color: '#2C1810',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#ECC067' },
              }}
            >
              Explore Services →
            </Button>
          </Card>
        ))}
      </Box>
    </main>
  );
}
