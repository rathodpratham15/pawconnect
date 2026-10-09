import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { JsonLd } from '../../components/JsonLd';
import { apiList } from '../../lib/server-api';
import { NGO } from '../../types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Verified Animal Rescue NGOs & Shelters',
  description: 'Explore certified non-profit animal rescue organizations and shelters. Find verified registration IDs, mission statements, and rescue contacts.',
  alternates: {
    canonical: `${siteUrl}/ngos`,
  },
  openGraph: {
    title: 'Verified Animal Rescue NGOs & Shelters | PawConnect',
    description: 'Explore certified non-profit animal rescue organizations and shelters. Find verified registration IDs, mission statements, and rescue contacts.',
    url: `${siteUrl}/ngos`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Verified animal welfare rescue shelters',
      },
    ],
  },
};

export default async function NgosPage() {
  const ngos = await apiList<NGO>('/ngos?status=verified', { revalidate: 300 });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verified Animal Welfare NGOs',
    description: 'List of certified non-profit animal shelters and rescues.',
    numberOfItems: ngos.length,
    itemListElement: ngos.map((ngo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'NGO',
        name: ngo.name,
        url: `${siteUrl}/ngos/${ngo._id}`,
        telephone: ngo.contactInfo,
        address: ngo.location?.address,
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />

      <main style={{ backgroundColor: '#FDFBF7', padding: '2.5rem 1rem 5rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#FAF0D6',
                color: '#2C1810',
                padding: '4px 14px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
              }}
            >
              🛡️ Certified Non-Profits
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#2C1810', margin: '0 0 0.75rem' }}>
              Verified Animal Welfare NGOs
            </h1>
            <p style={{ color: '#6E5D53', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Every shelter listed here has verified registration records, legitimate facilities, and dedicated rescue volunteers.
            </p>
          </div>

          {/* List or Empty State */}
          {ngos.length === 0 ? (
            <div
              className="paw-card"
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                maxWidth: '600px',
                margin: '0 auto',
                borderRadius: '20px',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                No verified NGOs listed currently
              </h2>
              <p style={{ color: '#6E5D53', marginBottom: '1.5rem' }}>
                Are you an animal shelter or rescue organization? Submit your registration to be verified by PawConnect.
              </p>
              <Link href="/ngo-management" className="paw-button-primary">
                Register Your NGO Shelter
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {ngos.map((ngo) => (
                <article
                  key={ngo._id}
                  className="paw-card"
                  style={{
                    padding: '2rem',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #EFE4CF',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: '#FAF0D6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}
                    >
                      🏛️
                    </div>
                    <span
                      style={{
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ✓ Verified
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#2C1810' }}>
                    {ngo.name}
                  </h2>

                  <p style={{ color: '#968174', fontSize: '0.8rem', margin: '0 0 0.75rem', fontWeight: 600 }}>
                    Reg ID: {ngo.registrationId}
                  </p>

                  <p style={{ color: '#6E5D53', fontSize: '0.9rem', lineHeight: 1.5, flex: 1, margin: '0 0 1rem' }}>
                    {ngo.description || 'Dedicated to animal rescue, emergency care, and loving adoptions.'}
                  </p>

                  <div style={{ borderTop: '1px solid #F0E8D9', paddingTop: '1rem', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.85rem', color: '#6E5D53', margin: '0 0 0.4rem' }}>
                      📍 {ngo.location?.address || 'Location registered'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#6E5D53', margin: '0 0 1.25rem' }}>
                      📞 {ngo.contactInfo}
                    </p>

                    <Link
                      href={`/ngos/${ngo._id}`}
                      className="paw-button-primary"
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      View Organization Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
