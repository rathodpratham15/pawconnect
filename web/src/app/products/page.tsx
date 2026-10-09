import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { JsonLd } from '../../components/JsonLd';
import { apiList } from '../../lib/server-api';
import { FoodProduct } from '../../types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Healthy Pet Food Products & Nutrition',
  description: 'Shop vet-recommended organic pet foods, grain-free meals, and wellness treats. Scientifically formulated nutrition for dogs, cats, and puppies.',
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: 'Healthy Pet Food Products & Nutrition | PawConnect',
    description: 'Shop vet-recommended organic pet foods, grain-free meals, and wellness treats. Scientifically formulated nutrition for dogs, cats, and puppies.',
    url: `${siteUrl}/products`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Nutritional food products for dogs and cats',
      },
    ],
  },
};

export default async function ProductsPage() {
  const products = await apiList<FoodProduct>('/foodProduct', { revalidate: 300 });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pet Food Products & Nutrition',
    description: 'Vet-certified nutrition formulas and wholesome organic treats.',
    numberOfItems: products.length,
    itemListElement: products.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: `${siteUrl}/products/${item._id}`,
        image: item.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
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
              🥫 Vet-Approved Nutrition
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#2C1810', margin: '0 0 0.75rem' }}>
              Pet Food & Nutrition
            </h1>
            <p style={{ color: '#6E5D53', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Wholesome ingredients, zero artificial fillers, and transparent nutritional profiles designed to keep your pets vibrant and energetic.
            </p>
          </div>

          {products.length === 0 ? (
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
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥫</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.5rem' }}>
                Food inventory currently updating
              </h2>
              <p style={{ color: '#6E5D53', marginBottom: '1.5rem' }}>
                Check back shortly or visit our custom diet generator to calculate your pet&apos;s daily meal balance.
              </p>
              <Link href="/dietgenerator" className="paw-button-primary">
                Try Diet Generator
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
              {products.map((product) => {
                const photo =
                  product.image ||
                  'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80';

                return (
                  <article
                    key={product._id}
                    className="paw-card"
                    style={{
                      borderRadius: '18px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ height: '220px', position: 'relative', backgroundColor: '#F5EBD7' }}>
                      <img
                        src={photo}
                        alt={`Photo of ${product.name} by ${product.brand}`}
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
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#ECC067',
                          color: '#2C1810',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.8rem', color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                        {product.brand}
                      </span>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '4px 0 0.5rem', color: '#2C1810' }}>
                        {product.name}
                      </h2>
                      <p style={{ color: '#6E5D53', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1rem', flex: 1 }}>
                        {product.description || product.nutritionDetails}
                      </p>

                      <Link
                        href={`/products/${product._id}`}
                        className="paw-button-primary"
                        style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}
                      >
                        View Product Details
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
