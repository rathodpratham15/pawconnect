'use client';

import React from 'react';
import { NearbyPlacesMap } from '../../../components/NearbyPlacesMap';

export default function PetTherapyPage() {
  return (
    <NearbyPlacesMap
      pageTitle="Pet Therapy & Rehabilitation"
      badge="🐾 Physical & Emotional Wellness"
      subtitle="Connect with certified hydrotherapy pools, mobility physical therapy, and emotional support companions."
      keyword="pet therapy animal hospital"
      fallbackSamplePlaces={[
        {
          id: 't1',
          name: 'Bay Area Canine Hydrotherapy & Rehab',
          address: '1050 Battery St, San Francisco, CA',
          lat: 37.8016,
          lng: -122.4014,
          rating: 5.0,
          userRatingsTotal: 62,
        },
        {
          id: 't2',
          name: 'Healing Paws Integrative Animal Wellness',
          address: '2800 Geary Blvd, San Francisco, CA',
          lat: 37.7824,
          lng: -122.4485,
          rating: 4.8,
          userRatingsTotal: 84,
        },
        {
          id: 't3',
          name: 'Pacific Pet Mobility & Acupuncture Care',
          address: '1240 Valencia St, San Francisco, CA',
          lat: 37.7529,
          lng: -122.4208,
          rating: 4.9,
          userRatingsTotal: 110,
        },
      ]}
    />
  );
}
