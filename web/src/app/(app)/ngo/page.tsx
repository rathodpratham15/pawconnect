'use client';

import React from 'react';
import { NearbyPlacesMap } from '../../../components/NearbyPlacesMap';

export default function NgoNearMePage() {
  return (
    <NearbyPlacesMap
      pageTitle="Animal Shelters & NGOs Near Me"
      badge="🏡 Rescue Sanctuaries & Shelters"
      subtitle="Find verified animal shelters, non-profit rescue organizations, and pet adoption centers near your coordinates."
      keyword="animal rescue shelter NGO"
      fallbackSamplePlaces={[
        {
          id: 'n1',
          name: 'San Francisco SPCA Animal Care Center',
          address: '201 Alabama St, San Francisco, CA',
          lat: 37.7667,
          lng: -122.4124,
          rating: 4.8,
          userRatingsTotal: 650,
        },
        {
          id: 'n2',
          name: 'Muttville Senior Dog Rescue',
          address: '255 Alabama St, San Francisco, CA',
          lat: 37.7661,
          lng: -122.4128,
          rating: 4.9,
          userRatingsTotal: 310,
        },
        {
          id: 'n3',
          name: 'City Dogs & Cats Rescue Center',
          address: '1200 15th St, San Francisco, CA',
          lat: 37.7675,
          lng: -122.4172,
          rating: 4.7,
          userRatingsTotal: 185,
        },
      ]}
    />
  );
}
