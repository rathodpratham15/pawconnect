'use client';

import React from 'react';
import { NearbyPlacesMap } from '../../../components/NearbyPlacesMap';

export default function VetPage() {
  return (
    <NearbyPlacesMap
      pageTitle="Veterinary Clinics Near Me"
      badge="🩺 Certified Medical Care"
      subtitle="Find accredited animal hospitals, emergency pet care centers, and certified veterinarians."
      keyword="veterinary care"
      fallbackSamplePlaces={[
        {
          id: 'v1',
          name: 'Golden Gate Veterinary Hospital',
          address: '420 Clement St, San Francisco, CA',
          lat: 37.7831,
          lng: -122.4632,
          rating: 4.8,
          userRatingsTotal: 215,
        },
        {
          id: 'v2',
          name: 'Metro Emergency Animal Clinic (24/7)',
          address: '1333 9th Ave, San Francisco, CA',
          lat: 37.7635,
          lng: -122.4661,
          rating: 4.9,
          userRatingsTotal: 340,
        },
        {
          id: 'v3',
          name: 'Sunset District Veterinary Care',
          address: '2111 Irving St, San Francisco, CA',
          lat: 37.7636,
          lng: -122.4802,
          rating: 4.7,
          userRatingsTotal: 180,
        },
      ]}
    />
  );
}
