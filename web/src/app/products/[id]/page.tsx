import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { JsonLd } from '../../../components/JsonLd';
import { AddToCartSection } from '../../../components/AddToCartSection';
import { apiGet, apiList } from '../../../lib/server-api';
import { FoodProduct } from '../../../types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getProduct(id: string): Promise<FoodProduct | null> {
  try {
    const directProduct = await apiGet<FoodProduct>(`/foodProduct/${id}`);
    if (directProduct) return directProduct;
  } catch (err: any) {
    if (!err?.message?.includes('404')) {
      throw err;
    }
  }

  // Fallback: search in list
  const allProducts = await apiList<FoodProduct>('/foodProduct');
  return allProducts.find((p) => p._id === id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested pet food product is not found.',
    };
  }

  const description = `${product.name} by ${product.brand} – ${product.description || product.nutritionDetails || 'Premium pet nutrition'}.`;
  const photo =
    product.image ||
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1200&auto=format&fit=crop&q=80';

  return {
    title: `${product.name} – ${product.brand}`,
    description: description.slice(0, 155),
    alternates: {
      canonical: `${siteUrl}/products/${id}`,
    },
    openGraph: {
      title: `${product.name} – ${product.brand} | PawConnect`,
      description,
      url: `${siteUrl}/products/${id}`,
      images: [
        {
          url: photo,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} – ${product.brand}`,
      description,
      images: [photo],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const photo =
    product.image ||
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: photo,
    description: product.description || product.nutritionDetails,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/products/${product._id}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main style={{ backgroundColor: '#FDFBF7', padding: '1.5rem 1rem 5rem' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <Breadcrumbs
            items={[
              { label: 'Food Products', href: '/products' },
              { label: product.name },
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
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative', minHeight: '380px', backgroundColor: '#F5EBD7' }}>
              <img
                src={photo}
                alt={`Photo of ${product.name}`}
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
            </div>

            {/* Info */}
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
                  marginBottom: '0.5rem',
                }}
              >
                {product.brand.toUpperCase()}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                  fontWeight: 800,
                  color: '#2C1810',
                  margin: '0 0 0.75rem',
                }}
              >
                {product.name}
              </h1>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2C1810', marginBottom: '1.25rem' }}>
                ${product.price.toFixed(2)}{' '}
                <span style={{ fontSize: '0.9rem', color: '#6E5D53', fontWeight: 500 }}>USD</span>
              </div>

              {product.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.4rem' }}>
                    Product Description
                  </h2>
                  <p style={{ color: '#5C483D', lineHeight: 1.6, margin: 0 }}>{product.description}</p>
                </div>
              )}

              <div
                style={{
                  backgroundColor: '#FAF5EB',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  marginBottom: '1.5rem',
                }}
              >
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2C1810', margin: '0 0 0.4rem' }}>
                  Nutritional Details & Ingredients
                </h2>
                <p style={{ color: '#6E5D53', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  {product.nutritionDetails}
                </p>
                {product.sold !== undefined && (
                  <p style={{ color: '#8C7769', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: 0 }}>
                    🔥 Over {product.sold} pet parents ordered this item.
                  </p>
                )}
              </div>

              {/* Quantity stepper + Add to Cart */}
              <AddToCartSection product={product} />

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #EFE4CF' }}>
                <p style={{ fontSize: '0.85rem', color: '#8C7769', margin: 0 }}>
                  Need recurring deliveries or shelter donations?{' '}
                  <Link
                    href={`/login?from=${encodeURIComponent(`/products/${product._id}`)}`}
                    style={{ color: '#8C5E3C', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Sign in to your account
                  </Link>
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
