import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { apiList } from '../../lib/server-api';
import { NgoRegisterForm } from '../../components/NgoRegisterForm';
import { NGO } from '../../types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'NGO Shelter Management & Registration Portal',
  description: 'Register animal welfare non-profits and rescue shelters with PawConnect. Explore verified sanctuaries, verification criteria, and partner listings.',
  alternates: {
    canonical: `${siteUrl}/ngo-management`,
  },
  openGraph: {
    title: 'NGO Shelter Management & Registration Portal | PawConnect',
    description: 'Register animal welfare non-profits and rescue shelters with PawConnect. Explore verified sanctuaries, verification criteria, and partner listings.',
    url: `${siteUrl}/ngo-management`,
  },
};

export default async function NgoManagementPage() {
  const verifiedNgos = await apiList<NGO>('/ngos?status=verified', { revalidate: 300 });

  return (
    <main style={{ backgroundColor: '#FDFBF7', padding: '3rem 1rem 6rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
            🏛️ Shelter Partnership Hub
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, color: '#2C1810', margin: '0 0 0.75rem' }}>
            NGO Shelter Management & Registration
          </h1>
          <p style={{ color: '#6E5D53', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            PawConnect empowers legitimate non-profit shelters with adoption listings, donation fundraisers, and vetted community trust.
          </p>
        </div>

        {/* 2-Column Layout: Form on Left/Top, Verified Registry on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Register NGO Form */}
          <div>
            <NgoRegisterForm />
          </div>

          {/* Verified NGOs Grid / Directory */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.4rem' }}>
                Currently Verified Rescue Partners ({verifiedNgos.length})
              </h2>
              <p style={{ color: '#6E5D53', fontSize: '0.9rem', margin: 0 }}>
                Organizations actively operating under verified non-profit credentials on PawConnect.
              </p>
            </div>

            {verifiedNgos.length === 0 ? (
              <div
                className="paw-card"
                style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  backgroundColor: '#FAF5EB',
                  borderRadius: '16px',
                }}
              >
                <p style={{ color: '#6E5D53', margin: 0 }}>
                  No verified NGOs listed yet. Register your shelter on the left to be reviewed!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {verifiedNgos.map((ngo) => (
                  <article
                    key={ngo._id}
                    className="paw-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '1px solid #EFE4CF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px', color: '#2C1810' }}>
                        {ngo.name}
                      </h3>
                      <span
                        style={{
                          backgroundColor: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '8px',
                        }}
                      >
                        ✓ Verified
                      </span>
                    </div>

                    <p style={{ color: '#8C7769', fontSize: '0.8rem', margin: '0 0 0.5rem', fontWeight: 600 }}>
                      ID: {ngo.registrationId}
                    </p>

                    <p style={{ color: '#6E5D53', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                      {ngo.description}
                    </p>

                    <p style={{ color: '#8C7769', fontSize: '0.8rem', margin: 0 }}>
                      📍 {ngo.location?.address} • 📞 {ngo.contactInfo}
                    </p>

                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #FAF0D6' }}>
                      <Link
                        href={`/ngos/${ngo._id}`}
                        style={{ color: '#8C5E3C', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        View Full Organization Profile →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
