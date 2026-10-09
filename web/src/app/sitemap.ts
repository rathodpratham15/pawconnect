import { MetadataRoute } from 'next';
import { apiList } from '../lib/server-api';
import { Pet, NGO, FoodProduct } from '../types';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/pets`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ngos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tips`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ngo-management`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Fetch dynamic entities, tolerating API unavailability
  const [pets, ngos, products] = await Promise.all([
    apiList<Pet>('/pets', { revalidate: 3600 }),
    apiList<NGO>('/ngos?status=verified', { revalidate: 3600 }),
    apiList<FoodProduct>('/foodProduct', { revalidate: 3600 }),
  ]);

  const petRoutes: MetadataRoute.Sitemap = pets
    .filter((p) => p && p._id)
    .map((p) => ({
      url: `${siteUrl}/pets/${p._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const ngoRoutes: MetadataRoute.Sitemap = ngos
    .filter((n) => n && n._id && n.status === 'verified')
    .map((n) => ({
      url: `${siteUrl}/ngos/${n._id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((prod) => prod && prod._id)
    .map((prod) => ({
      url: `${siteUrl}/products/${prod._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...petRoutes, ...ngoRoutes, ...productRoutes];
}
