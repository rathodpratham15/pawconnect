import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { JsonLd } from '../../../components/JsonLd';
import { apiGet, apiList } from '../../../lib/server-api';
import { NGO } from '../../../types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getNgo(id: string): Promise<NGO | null> {
  try {
    const directNgo = await apiGet<NGO>(`/ngos/${id}`);
    if (directNgo && directNgo.status === 'verified') {
      return directNgo;
    }
  } catch (err: any) {
    if (!err?.message?.includes('404')) {
      throw err;
    }
  }

  // Fallback: search verified NGOs list
  const verifiedNgos = await apiList<NGO>('/ngos?status=verified');
  const match = verifiedNgos.find((n) => n._id === id);
  return match && match.status === 'verified' ? match : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ngo = await getNgo(id);

  if (!ngo) {
    return {
      title: 'NGO Not Found',
      description: 'The requested animal welfare organization is not found or not yet verified.',
    };
  }

  const description = `${ngo.name} is a verified animal rescue NGO in ${ngo.location?.address || 'local area'} dedicated to pet adoption and welfare.`;

  return {
    title: `${ngo.name} – Verified Animal Shelter`,
    description: description.slice(0, 155),
    alternates: {
      canonical: `${siteUrl}/ngos/${id}`,
    },
    openGraph: {
      title: `${ngo.name} – Verified Animal Shelter | PawConnect`,
      description,
      url: `${siteUrl}/ngos/${id}`,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: `Verified Shelter: ${ngo.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ngo.name} – Verified Animal Shelter`,
      description,
    },
  };
}

export default async function NgoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const ngo = await getNgo(id);

  if (!ngo) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: ngo.name,
    description: ngo.description,
    telephone: ngo.contactInfo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ngo.location?.address,
    },
    ...(typeof ngo.location?.latitude === 'number' && typeof ngo.location?.longitude === 'number'
      ? { geo: { '@type': 'GeoCoordinates', latitude: ngo.location.latitude, longitude: ngo.location.longitude } }
      : {}),
    ...(ngo.websiteUrl ? { url: ngo.websiteUrl } : {}),
    ...(ngo.logoUrl ? { logo: ngo.logoUrl } : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main style={{ backgroundColor: '#FDFBF7', padding: '1.5rem 1rem 5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <Breadcrumbs
            items={[
              { label: 'Verified NGOs', href: '/ngos' },
              { label: ngo.name },
            ]}
          />

          <article
            className="paw-card"
            style={{
              borderRadius: '24px',
              padding: '2.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EFE4CF',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span>✓</span>
                  <span>Official Verified NGO Partner</span>
                </div>
                <h1
                  style={{
                    fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#2C1810',
                    margin: 0,
                  }}
                >
                  {ngo.name}
                </h1>
                <p style={{ color: '#8C7769', margin: '4px 0 0', fontWeight: 600, fontSize: '0.9rem' }}>
                  {ngo.source === 'every_org' ? 'EIN (US tax ID)' : 'Government Registration ID'}: {ngo.registrationId}
                </p>
              </div>

              {ngo.logoUrl ? (
                <img
                  src={ngo.logoUrl}
                  alt={`${ngo.name} logo`}
                  width={64}
                  height={64}
                  style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'contain', backgroundColor: '#FFFFFF', border: '1px solid #EFE4CF' }}
                />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#FAF0D6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                  }}
                >
                  🏛️
                </div>
              )}
            </div>

            {/* Mission / Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                Mission & Facility Overview
              </h2>
              <p style={{ color: '#5C483D', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                {ngo.description}
              </p>
            </div>

            {/* Location & Contact Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                backgroundColor: '#FAF5EB',
                padding: '1.5rem',
                borderRadius: '16px',
                marginBottom: '2rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '0.85rem', color: '#8C7769', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 0.5rem' }}>
                  📍 Physical Shelter Address
                </h3>
                <p style={{ margin: 0, fontWeight: 600, color: '#2C1810', lineHeight: 1.5 }}>
                  {ngo.location?.address}
                </p>
                {ngo.location?.latitude && ngo.location?.longitude && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#8C7769' }}>
                    Coordinates: {ngo.location.latitude.toFixed(4)}, {ngo.location.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '0.85rem', color: '#8C7769', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 0.5rem' }}>
                  📞 Direct Contact Information
                </h3>
                <p style={{ margin: 0, fontWeight: 600, color: '#2C1810', fontSize: '1.05rem', wordBreak: 'break-word' }}>
                  {/^https?:\/\//.test(ngo.contactInfo) ? (
                    <a href={ngo.contactInfo} target="_blank" rel="noopener noreferrer" style={{ color: '#2C1810' }}>
                      {ngo.contactInfo}
                    </a>
                  ) : (
                    ngo.contactInfo
                  )}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#8C7769' }}>
                  Direct shelter helpline for inquiries & emergency rescue
                </p>
              </div>
            </div>

            {/* Donate (imported NGOs): send people to the nonprofit's Every.org profile */}
            {ngo.donateUrl && (
              <div style={{ marginBottom: '2rem' }}>
                <a
                  href={ngo.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paw-button-primary"
                  style={{ padding: '12px 24px', fontSize: '1rem', display: 'inline-block' }}
                >
                  Donate via Every.org
                </a>
                <p style={{ color: '#8C7769', margin: '8px 0 0', fontSize: '0.8rem' }}>
                  Listing information provided by Every.org.
                </p>
              </div>
            )}

            {/* CTA */}
            <div
              style={{
                borderTop: '1px solid #EFE4CF',
                paddingTop: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.25rem' }}>
                  Want to Adopt from or Volunteer with {ngo.name}?
                </h3>
                <p style={{ color: '#6E5D53', margin: 0, fontSize: '0.9rem' }}>
                  Sign in to contact shelter coordinators and access their adoption records.
                </p>
              </div>

              <Link
                href={`/login?from=${encodeURIComponent(`/ngos/${ngo._id}`)}`}
                className="paw-button-primary"
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                Sign In to Connect
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
