import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '../components/JsonLd';
import { PublicOnly } from '../components/PublicOnly';
import { apiList } from '../lib/server-api';
import { Pet } from '../types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'PawConnect – Ethical Pet Adoption, Verified NGOs & Nutrition Care',
  description: 'Connect with verified animal shelters, adopt loving rescued pets, build personalized pet diet plans, and access trusted veterinary care in your area.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'PawConnect – Ethical Pet Adoption, Verified NGOs & Nutrition Care',
    description: 'Connect with verified animal shelters, adopt loving rescued pets, build personalized pet diet plans, and access trusted veterinary care in your area.',
    url: siteUrl,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'PawConnect pet adoption community',
      },
    ],
  },
};

export default async function HomePage() {
  const featuredPets = await apiList<Pet>('/pets', { revalidate: 300 });

  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PawConnect',
      url: siteUrl,
      description: 'Platform connecting ethical animal shelters and loving pet adopters.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/pets?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PawConnect',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/PawConnectApp',
        'https://facebook.com/PawConnectApp',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-555-PAWS',
        contactType: 'Customer Support',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does PawConnect verify animal rescue organizations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every NGO must submit their government registration number, shelter location, and pass administrative inspection before being listed as verified.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is pet adoption free on PawConnect?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shelters list adoption details directly; standard adoption donations often cover prior vaccinations, spaying/neutering, and microchipping.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the custom pet diet generator work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our diet calculation algorithm factors in species, breed size, exact weight, age, and existing health conditions to compute daily calories and macronutrient ratios.',
          },
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PublicOnly />

      <main style={{ backgroundColor: '#FDFBF7' }}>
        {/* HERO SECTION */}
        <section
          style={{
            position: 'relative',
            backgroundColor: '#FAF3E3',
            borderBottom: '1px solid #EFE4CF',
            padding: '4rem 1rem 5rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECC067',
                  borderRadius: '30px',
                  padding: '6px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#2C1810',
                  marginBottom: '1.25rem',
                }}
              >
                <span>🐾</span>
                <span>Ethical Pet Adoption & Community Care</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  color: '#2C1810',
                  lineHeight: 1.15,
                  margin: '0 0 1.25rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Find Your Forever Companion Today.
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#6E5D53',
                  lineHeight: 1.6,
                  margin: '0 0 2rem',
                }}
              >
                Thousands of abandoned and rescued pets are waiting for a warm, loving home. Browse verified shelters, generate tailored pet diets, and access certified veterinary care.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/pets"
                  className="paw-button-primary"
                  style={{ fontSize: '1rem', padding: '12px 24px' }}
                >
                  <span>🐶</span>
                  <span>Explore Adoptable Pets</span>
                </Link>

                <Link
                  href="/ngos"
                  className="paw-button-secondary"
                  style={{ fontSize: '1rem', padding: '12px 24px' }}
                >
                  <span>🏛️</span>
                  <span>Find Verified Shelters</span>
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(44, 24, 16, 0.12)',
                  aspectRatio: '4/3',
                  position: 'relative',
                  backgroundColor: '#F5EBD7',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&auto=format&fit=crop&q=80"
                  alt="A happy rescued golden dog smiling outdoors"
                  loading="lazy"
                  width={800}
                  height={600}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Floating trust badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  boxShadow: '0 8px 24px rgba(44, 24, 16, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #F0E8D9',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#ECC067',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  🛡️
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2C1810' }}>
                    100% Verified
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6E5D53' }}>
                    Official NGO Registrations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE BIG ACTION CARDS */}
        <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
              How Can PawConnect Help You?
            </h2>
            <p style={{ color: '#6E5D53', fontSize: '1.05rem', margin: 0 }}>
              Choose your path to make a difference in an animal's life.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Card 1: Adopt a Pet */}
            <article
              className="paw-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                border: '1px solid #EFE4CF',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#FBEED0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '1.25rem',
                }}
              >
                🐕
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#2C1810' }}>
                Adopt a Pet
              </h3>
              <p style={{ color: '#6E5D53', lineHeight: 1.5, flex: 1, margin: '0 0 1.5rem' }}>
                Browse vetted listings from local rescue shelters. View complete medical histories, temperament, and special care needs.
              </p>
              <Link
                href="/petadopt"
                className="paw-button-primary"
                style={{ width: '100%' }}
              >
                <span>Adopt a Pet</span>
                <span>→</span>
              </Link>
            </article>

            {/* Card 2: Search NGOs */}
            <article
              className="paw-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                border: '1px solid #EFE4CF',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#EAE1FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '1.25rem',
                }}
              >
                🏡
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#2C1810' }}>
                Search NGOs
              </h3>
              <p style={{ color: '#6E5D53', lineHeight: 1.5, flex: 1, margin: '0 0 1.5rem' }}>
                Locate certified animal shelters in your vicinity with interactive maps, GPS directions, and official verification badges.
              </p>
              <Link
                href="/ngo"
                className="paw-button-primary"
                style={{ width: '100%', backgroundColor: '#ECC067' }}
              >
                <span>Search NGOs</span>
                <span>→</span>
              </Link>
            </article>

            {/* Card 3: Pet Care */}
            <article
              className="paw-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                border: '1px solid #EFE4CF',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#D7F3E3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '1.25rem',
                }}
              >
                🩺
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#2C1810' }}>
                Pet Care Hub
              </h3>
              <p style={{ color: '#6E5D53', lineHeight: 1.5, flex: 1, margin: '0 0 1.5rem' }}>
                Access local veterinary clinics, pet salons, certified animal therapy, scientific diet generation, and premium nutrition.
              </p>
              <Link
                href="/petcare"
                className="paw-button-primary"
                style={{ width: '100%' }}
              >
                <span>Pet Care Hub</span>
                <span>→</span>
              </Link>
            </article>
          </div>
        </section>

        {/* DONATION CALL-TO-ACTION */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '4rem auto',
            padding: '0 1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#2C1810',
              color: '#FFFDF9',
              borderRadius: '24px',
              padding: '3rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(236, 192, 103, 0.15) 0%, transparent 60%)',
            }}
          >
            <div style={{ maxWidth: '650px' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(236, 192, 103, 0.2)',
                  color: '#ECC067',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                🐾 Emergency Shelter Support
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                  fontWeight: 800,
                  margin: '0 0 1rem',
                  color: '#FFFFFF',
                }}
              >
                Support Non-Profit Animal Rescues
              </h2>
              <p style={{ color: '#D5C4B4', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                Shelters operate on thin margins to rescue vulnerable animals, provide emergency veterinary surgeries, and sustain daily feeding. Register your NGO or support verified campaigns today.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/ngo-management"
                className="paw-button-primary"
                style={{
                  fontSize: '1.05rem',
                  padding: '14px 28px',
                  backgroundColor: '#ECC067',
                  color: '#2C1810',
                }}
              >
                <span>Donate Now</span>
                <span>❤️</span>
              </Link>
              <Link
                href="/fundraisermanagement"
                className="paw-button-secondary"
                style={{
                  fontSize: '1.05rem',
                  padding: '14px 28px',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                View Fundraisers
              </Link>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS SECTION */}
        <section
          style={{
            backgroundColor: '#FAF5EB',
            borderTop: '1px solid #EFE4CF',
            borderBottom: '1px solid #EFE4CF',
            padding: '4rem 1rem',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
                Why Animal Lovers Trust PawConnect
              </h2>
              <p style={{ color: '#6E5D53', fontSize: '1.05rem' }}>
                Our commitment to transparency, safety, and holistic pet well-being.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid #EFE4CF',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                  Verified NGOs Only
                </h3>
                <p style={{ color: '#6E5D53', lineHeight: 1.6, margin: 0 }}>
                  Every organization undergoes manual review of registration certificates and physical location checks before approval.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid #EFE4CF',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥣</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                  Scientific Diet Plans
                </h3>
                <p style={{ color: '#6E5D53', lineHeight: 1.6, margin: 0 }}>
                  Tailored caloric calculations accounting for weight, age, breed predispositions, and medical sensitivities.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid #EFE4CF',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🩺</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                  Full Medical Transparency
                </h3>
                <p style={{ color: '#6E5D53', lineHeight: 1.6, margin: 0 }}>
                  Clear badges for special care needs, disabilities, vaccination schedules, and shelter history on every profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PETS PREVIEW */}
        {featuredPets.length > 0 && (
          <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.25rem' }}>
                  Recent Adoptable Pets
                </h2>
                <p style={{ color: '#6E5D53', margin: 0 }}>
                  Meet some of our lovely rescues ready for adoption.
                </p>
              </div>
              <Link href="/pets" style={{ color: '#8C5E3C', fontWeight: 700, textDecoration: 'none' }}>
                View All Pets ({featuredPets.length}) →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featuredPets.slice(0, 4).map((pet) => (
                <article
                  key={pet._id}
                  className="paw-card"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                  }}
                >
                  <div
                    style={{
                      height: '200px',
                      position: 'relative',
                      backgroundColor: '#F3ECE0',
                    }}
                  >
                    <img
                      src={
                        pet.imageUrl ||
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={`Photo of ${pet.name || 'Rescue Pet'}, a ${pet.breed} ${pet.type}`}
                      loading="lazy"
                      width={400}
                      height={300}
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
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#E07A5F',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Special Care
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem', color: '#2C1810' }}>
                      {pet.name || 'Unnamed Sweetheart'}
                    </h3>
                    <p style={{ color: '#6E5D53', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
                      {pet.breed} • {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} old • {pet.size}
                    </p>
                    <p style={{ color: '#968174', fontSize: '0.8rem', margin: '0 0 1rem' }}>
                      📍 {pet.shelterLocation}
                    </p>
                    <Link
                      href={`/pets/${pet._id}`}
                      className="paw-button-primary"
                      style={{ marginTop: 'auto', width: '100%', padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* FAQ SECTION FOR RICH SNIPPETS */}
        <section
          style={{
            maxWidth: '900px',
            margin: '4rem auto 6rem',
            padding: '0 1rem',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#6E5D53', fontSize: '1.05rem', margin: 0 }}>
              Common questions about pet adoption, nutrition, and shelter verification.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <details
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #EFE4CF',
                padding: '1.25rem 1.5rem',
              }}
            >
              <summary style={{ fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: '#2C1810' }}>
                How does PawConnect verify animal rescue organizations?
              </summary>
              <p style={{ color: '#6E5D53', marginTop: '0.75rem', lineHeight: 1.6 }}>
                Every NGO must submit their government registration number, shelter location, and pass administrative inspection before being listed as verified. We do not tolerate unauthorized breeders.
              </p>
            </details>

            <details
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #EFE4CF',
                padding: '1.25rem 1.5rem',
              }}
            >
              <summary style={{ fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: '#2C1810' }}>
                Is pet adoption free on PawConnect?
              </summary>
              <p style={{ color: '#6E5D53', marginTop: '0.75rem', lineHeight: 1.6 }}>
                Shelters list adoption details directly; standard adoption donations often cover prior vaccinations, spaying/neutering, microchipping, and rescue overhead.
              </p>
            </details>

            <details
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #EFE4CF',
                padding: '1.25rem 1.5rem',
              }}
            >
              <summary style={{ fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: '#2C1810' }}>
                How does the custom pet diet generator work?
              </summary>
              <p style={{ color: '#6E5D53', marginTop: '0.75rem', lineHeight: 1.6 }}>
                Our diet calculation algorithm factors in species, breed size, exact weight, age, and existing health conditions to compute daily calories and macronutrient ratios.
              </p>
            </details>
          </div>
        </section>
      </main>
    </>
  );
}
