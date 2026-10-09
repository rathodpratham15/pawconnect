import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { JsonLd } from '../../components/JsonLd';
import { apiList } from '../../lib/server-api';
import { Pet } from '../../types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Adoptable Pets – Dogs, Cats & Rescue Animals',
  description: 'Browse adoptable rescue pets across verified shelters. View detailed health records, personality traits, and adoption steps for dogs and cats.',
  alternates: {
    canonical: `${siteUrl}/pets`,
  },
  openGraph: {
    title: 'Adoptable Pets – Dogs, Cats & Rescue Animals | PawConnect',
    description: 'Browse adoptable rescue pets across verified shelters. View detailed health records, personality traits, and adoption steps for dogs and cats.',
    url: `${siteUrl}/pets`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Adoptable dogs and cats waiting for loving homes',
      },
    ],
  },
};

export default async function PetsPage() {
  const pets = await apiList<Pet>('/pets', { revalidate: 300 });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Adoptable Pets',
    description: 'List of dogs, cats, and small animals available for adoption.',
    numberOfItems: pets.length,
    itemListElement: pets.map((pet, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: pet.name || `${pet.breed} ${pet.type}`,
        url: `${siteUrl}/pets/${pet._id}`,
        description: `Adoptable ${pet.breed} (${pet.type}), age ${pet.age}. Located at ${pet.shelterLocation}.`,
        image: pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
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
              🐾 Rescues Waiting For You
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#2C1810', margin: '0 0 0.75rem' }}>
              Adopt a Rescue Pet
            </h1>
            <p style={{ color: '#6E5D53', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Every pet deserves unconditional love. Review certified profiles, temperament assessments, and shelter contact info.
            </p>
          </div>

          {/* List or Empty State */}
          {pets.length === 0 ? (
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
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐶</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                No pets currently listed
              </h2>
              <p style={{ color: '#6E5D53', marginBottom: '1.5rem' }}>
                All our current rescues may have found loving families or the shelter registry is updating. Check back shortly!
              </p>
              <Link href="/ngo-management" className="paw-button-primary">
                Register as an NGO Shelter
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
              }}
            >
              {pets.map((pet) => {
                const photo =
                  pet.imageUrl ||
                  (pet.type?.toLowerCase() === 'cat'
                    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80');

                return (
                  <article
                    key={pet._id}
                    className="paw-card"
                    style={{
                      borderRadius: '18px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: '220px', backgroundColor: '#F0E8D9' }}>
                      <img
                        src={photo}
                        alt={`Adoptable ${pet.name || 'Pet'}, ${pet.breed} ${pet.type}`}
                        loading="lazy"
                        width={400}
                        height={260}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {pet.disabilityStatus && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: '#D9534F',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          Special Needs
                        </span>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(44, 24, 16, 0.75)',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {pet.type}
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h2
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          margin: '0 0 0.4rem',
                          color: '#2C1810',
                        }}
                      >
                        {pet.name || 'Unnamed Sweetheart'}
                      </h2>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            backgroundColor: '#F5EEDC',
                            color: '#5C483D',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {pet.breed}
                        </span>
                        <span
                          style={{
                            backgroundColor: '#F5EEDC',
                            color: '#5C483D',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} old
                        </span>
                        <span
                          style={{
                            backgroundColor: '#F5EEDC',
                            color: '#5C483D',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {pet.size}
                        </span>
                      </div>

                      <p style={{ color: '#826E61', fontSize: '0.85rem', margin: '0 0 1rem' }}>
                        📍 <strong>Shelter:</strong> {pet.shelterLocation}
                      </p>

                      {pet.healthConcerns && pet.healthConcerns.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#968174', fontWeight: 600 }}>
                            Health Notes: {pet.healthConcerns.join(', ')}
                          </span>
                        </div>
                      )}

                      <Link
                        href={`/pets/${pet._id}`}
                        className="paw-button-primary"
                        style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}
                      >
                        Meet {pet.name || 'this Pet'}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
