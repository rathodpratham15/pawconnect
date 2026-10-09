import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { JsonLd } from '../../components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Essential Pet Care Tips & Veterinary Guidance',
  description: 'Evidence-based pet care guidance across hygiene, balanced nutrition, daily exercise routines, and household safety for adopted dogs and cats.',
  alternates: {
    canonical: `${siteUrl}/tips`,
  },
  openGraph: {
    title: 'Essential Pet Care Tips & Veterinary Guidance | PawConnect',
    description: 'Evidence-based pet care guidance across hygiene, balanced nutrition, daily exercise routines, and household safety for adopted dogs and cats.',
    url: `${siteUrl}/tips`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Pet care guidelines and tips',
      },
    ],
  },
};

export default function TipsPage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Essential Pet Care Tips: Hygiene, Nutrition, Exercise, and Safety',
    description: 'Comprehensive veterinarian-approved advice for new and experienced pet owners.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
    author: {
      '@type': 'Organization',
      name: 'PawConnect Veterinary Advisory Board',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PawConnect',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: '2025-01-15T08:00:00+00:00',
    dateModified: '2025-03-01T12:00:00+00:00',
  };

  const sections = [
    {
      id: 'hygiene',
      title: '1. Hygiene & Coat Maintenance',
      subtitle: 'Healthy skin is the first barrier against infections and seasonal allergies.',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=700&auto=format&fit=crop&q=80',
      imageAlt: 'Dog enjoying a gentle bath and groom',
      bullets: [
        'Brush coat 2–3 times a week to stimulate natural oils and prevent painful matting.',
        'Use pH-balanced pet shampoos; human detergents strip the protective lipid layer.',
        'Inspect ears weekly for foul odor, dark discharge, or redness that indicates yeast or mites.',
        'Clean teeth daily or use enzymatic dental chews to prevent periodontitis.',
      ],
      quote:
        'Regular grooming sessions are not just cosmetic—they are your earliest opportunity to detect suspicious lumps, skin parasites, and tenderness before they escalate.',
      reverse: false,
    },
    {
      id: 'food',
      title: '2. Wholesome Nutrition & Hydration',
      subtitle: 'Feeding according to species metabolic requirements and life stages.',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
      imageAlt: 'Fresh nutritious pet food bowl with wholesome ingredients',
      bullets: [
        'Prioritize real named animal proteins (chicken, salmon, lamb) over unspecified by-products.',
        'Avoid high-glycemic fillers that trigger insulin spikes and chronic obesity in indoor pets.',
        'Provide multiple fresh water sources throughout the home, especially for cats prone to renal issues.',
        'Never feed onions, garlic, chocolate, grapes, raisins, or products containing xylitol (birch sugar).',
      ],
      quote:
        'A pet’s diet dictates their joint longevity, gut biome, and mental alertness. Caloric balance must adjust dynamically with seasonal activity and age.',
      reverse: true,
    },
    {
      id: 'exercise',
      title: '3. Daily Physical & Mental Exercise',
      subtitle: 'Tired pets are calm, emotionally balanced, and confident pets.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&auto=format&fit=crop&q=80',
      imageAlt: 'Dog running enthusiastically in green park',
      bullets: [
        'Aim for a minimum of 30–60 minutes of varied physical exercise daily depending on breed size.',
        'Engage in olfactory stimulation: let dogs sniff on walks to activate cortical processing.',
        'Provide interactive puzzle feeders and flirt poles to satisfy predatory play instincts in cats.',
        'Incorporate short, positive-reinforcement obedience sessions (5–10 mins) daily.',
      ],
      quote:
        'Mental fatigue from problem-solving toys calms anxiety just as effectively as sustained sprinting, particularly for high-energy working breeds.',
      reverse: false,
    },
    {
      id: 'safety',
      title: '4. Household Safety & Emergency Preparedness',
      subtitle: 'Preventing common domestic accidents and accidental toxin ingestion.',
      image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=700&auto=format&fit=crop&q=80',
      imageAlt: 'Veterinarian checking puppy in safe clinic environment',
      bullets: [
        'Secure electrical wires and keep human medications locked in closed medicine cabinets.',
        'Audit indoor houseplants: lilies, sago palms, oleanders, and philodendrons are highly toxic.',
        'Ensure microchip contact details and collar identification tags are up to date.',
        'Store 24/7 emergency veterinary hospital phone numbers and poison control in your phone.',
      ],
      quote:
        'Pet-proofing a home mirrors toddler-proofing: curiosity and an acute sense of smell can turn dropped medication or trash into an emergency in seconds.',
      reverse: true,
    },
  ];

  return (
    <>
      <JsonLd data={articleJsonLd} />

      <main style={{ backgroundColor: '#FDFBF7', padding: '3rem 1rem 6rem' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
              📖 PawConnect Advisory Journal
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, color: '#2C1810', margin: '0 0 1rem' }}>
              Essential Pet Care & Health Guide
            </h1>
            <p style={{ color: '#6E5D53', maxWidth: '680px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Written by veterinary wellness specialists to guide you through compassionate everyday care for adopted dogs, cats, and rescue companions.
            </p>
          </div>

          {/* 4 Alternating Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
            {sections.map((section) => (
              <article
                key={section.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '3rem',
                  alignItems: 'center',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    order: section.reverse ? 2 : 1,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 16px 36px rgba(44, 24, 16, 0.08)',
                      aspectRatio: '4/3',
                      backgroundColor: '#F5EBD7',
                    }}
                  >
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      loading="lazy"
                      width={640}
                      height={480}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div style={{ order: section.reverse ? 1 : 2 }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
                    {section.title}
                  </h2>
                  <p style={{ color: '#8C7769', fontSize: '1rem', margin: '0 0 1.25rem', fontWeight: 500 }}>
                    {section.subtitle}
                  </p>

                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    {section.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          color: '#4E3E34',
                          fontSize: '0.95rem',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: '#ECC067', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pull quote */}
                  <blockquote
                    style={{
                      margin: 0,
                      padding: '1.25rem 1.5rem',
                      backgroundColor: '#FAF5EB',
                      borderLeft: '4px solid #ECC067',
                      borderRadius: '0 14px 14px 0',
                      fontStyle: 'italic',
                      color: '#2C1810',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                  >
                    “{section.quote}”
                  </blockquote>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Tools Callout */}
          <div
            style={{
              marginTop: '5rem',
              backgroundColor: '#ECC067',
              color: '#2C1810',
              borderRadius: '24px',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.75rem' }}>
              Want a Personalized Nutrition Plan?
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '1.05rem', color: '#3E251A' }}>
              Use our interactive Diet Generator to compute exact daily calories and nutrient macros tailored specifically to your dog or cat.
            </p>
            <Link
              href="/dietgenerator"
              style={{
                display: 'inline-block',
                backgroundColor: '#2C1810',
                color: '#FFFDF9',
                fontWeight: 700,
                padding: '12px 28px',
                borderRadius: '14px',
                textDecoration: 'none',
              }}
            >
              Launch Custom Diet Generator →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
