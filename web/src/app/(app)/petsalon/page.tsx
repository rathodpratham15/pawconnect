'use client';

import React from 'react';
import { NearbyPlacesMap } from '../../../components/NearbyPlacesMap';

export default function PetSalonPage() {
  return (
    <NearbyPlacesMap
      pageTitle="Pet Grooming Salons Near Me"
      badge="✂️ Hygiene & Spa Services"
      subtitle="Discover professional coat stylists, organic pet spas, and gentle claw care specialists."
      keyword="pet grooming salon"
      fallbackSamplePlaces={[
        {
          id: 's1',
          name: 'The Pampered Paw Grooming Lounge',
          address: '782 Post St, San Francisco, CA',
          lat: 37.7876,
          lng: -122.4151,
          rating: 4.9,
          userRatingsTotal: 154,
        },
        {
          id: 's2',
          name: 'Pure Organic Dog & Cat Spa',
          address: '1548 California St, San Francisco, CA',
          lat: 37.7904,
          lng: -122.4208,
          rating: 4.8,
          userRatingsTotal: 98,
        },
        {
          id: 's3',
          name: 'Bubbles & Bark Grooming Studio',
          address: '2240 Mission St, San Francisco, CA',
          lat: 37.7612,
          lng: -122.4194,
          rating: 4.7,
          userRatingsTotal: 210,
        },
      ]}
    />
  );
}
