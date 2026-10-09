import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/signup',
        '/admin',
        '/homepage',
        '/petadopt',
        '/foodproducts',
        '/dietgenerator',
        '/fundraisermanagement',
        '/petsalon',
        '/vet',
        '/pettherapy',
        '/ngo',
        '/cart',
        '/petcare',
        '/profile',
        '/adoptions',
        '/geolocation',
        '/clipboard',
        '/network',
        '/bluetooth',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
