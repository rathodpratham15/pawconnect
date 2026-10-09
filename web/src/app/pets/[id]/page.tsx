import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { JsonLd } from '../../../components/JsonLd';
import { apiGet, apiList } from '../../../lib/server-api';
import { Pet } from '../../../types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getPet(id: string): Promise<Pet | null> {
  // First attempt direct endpoint
  try {
    const pet = await apiGet<Pet>(`/pets/${id}`);
    if (pet) return pet;
  } catch (err: any) {
    if (!err?.message?.includes('404')) {
      // Outage or server error: rethrow so Next.js does not cache as 404
      throw err;
    }
  }

  // Fallback: search in list
  const allPets = await apiList<Pet>('/pets');
  return allPets.find((p) => p._id === id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pet = await getPet(id);

  if (!pet) {
    return {
      title: 'Pet Not Found',
      description: 'The requested pet profile is no longer available.',
    };
  }

  const name = pet.name || `${pet.breed} (${pet.type})`;
  const description = `Adopt ${name}, a ${pet.age}-year-old ${pet.breed} looking for a loving home at ${pet.shelterLocation}.`;
  const photo =
    pet.imageUrl ||
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=80';

  return {
    title: `Adopt ${name} – ${pet.breed}`,
    description: description.slice(0, 155),
    alternates: {
      canonical: `${siteUrl}/pets/${id}`,
    },
    openGraph: {
      title: `Adopt ${name} – ${pet.breed} | PawConnect`,
      description,
      url: `${siteUrl}/pets/${id}`,
      images: [
        {
          url: photo,
          width: 1200,
          height: 630,
          alt: `Photo of ${name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Adopt ${name} – ${pet.breed}`,
      description,
      images: [photo],
    },
  };
}

export default async function PetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pet = await getPet(id);

  if (!pet) {
    notFound();
  }

  const name = pet.name || `${pet.breed} (${pet.type})`;
  const photo =
    pet.imageUrl ||
    (pet.type?.toLowerCase() === 'cat'
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    image: photo,
    description: `Adoptable ${pet.breed} (${pet.type}), age ${pet.age}. Sheltered at ${pet.shelterLocation}.`,
    category: pet.type,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main style={{ backgroundColor: '#FDFBF7', padding: '1.5rem 1rem 5rem' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <Breadcrumbs
            items={[
              { label: 'Adoptable Pets', href: '/pets' },
              { label: name },
            ]}
          />

          <article
            className="paw-card"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '0',
              border: '1px solid #EFE4CF',
            }}
          >
            {/* Pet Photo */}
            <div style={{ position: 'relative', minHeight: '380px', backgroundColor: '#F0E8D9' }}>
              <img
                src={photo}
                alt={`Portrait of ${name}`}
                loading="lazy"
                width={700}
                height={550}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {pet.disabilityStatus && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: '#D9534F',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  Special Care / Disability
                </div>
              )}
            </div>

            {/* Pet Info */}
            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#FAF0D6',
                  color: '#2C1810',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  alignSelf: 'flex-start',
                  marginBottom: '0.75rem',
                }}
              >
                {pet.type.toUpperCase()} • READY FOR ADOPTION
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#2C1810',
                  margin: '0 0 1rem',
                }}
              >
                {name}
              </h1>

              {/* Badges / Specs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ backgroundColor: '#FAF5EB', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8C7769', textTransform: 'uppercase', fontWeight: 700 }}>
                    Breed
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#2C1810' }}>{pet.breed}</p>
                </div>

                <div style={{ backgroundColor: '#FAF5EB', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8C7769', textTransform: 'uppercase', fontWeight: 700 }}>
                    Age
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#2C1810' }}>
                    {pet.age} {pet.age === 1 ? 'year' : 'years'}
                  </p>
                </div>

                <div style={{ backgroundColor: '#FAF5EB', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8C7769', textTransform: 'uppercase', fontWeight: 700 }}>
                    Size
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#2C1810' }}>{pet.size}</p>
                </div>

                <div style={{ backgroundColor: '#FAF5EB', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8C7769', textTransform: 'uppercase', fontWeight: 700 }}>
                    Shelter Location
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#2C1810' }}>
                    {pet.shelterLocation}
                  </p>
                </div>
              </div>

              {/* Health concerns */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                  Health & Medical Notes
                </h2>
                {pet.healthConcerns && pet.healthConcerns.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#6E5D53', lineHeight: 1.6 }}>
                    {pet.healthConcerns.map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#4E8A5E', margin: 0, fontWeight: 600 }}>
                    ✓ Full veterinary checkup completed, up to date on vaccines and deworming.
                  </p>
                )}
              </div>

              {/* Call to action */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #EFE4CF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <Link
                  href={`/login?from=${encodeURIComponent(`/pets/${pet._id}`)}`}
                  className="paw-button-primary"
                  style={{ width: '100%', textAlign: 'center', fontSize: '1.05rem', padding: '14px' }}
                >
                  Adopt {name} – Sign In to Apply
                </Link>
                <p style={{ fontSize: '0.8rem', color: '#8C7769', textAlign: 'center', margin: 0 }}>
                  Shelter staff will review your application and schedule a meet-and-greet.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
