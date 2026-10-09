import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import './globals.css';
import { Providers } from '../components/Providers';
import { SiteHeader } from '../components/SiteHeader';
import { Sidebar } from '../components/Sidebar';
import { SiteFooter } from '../components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | PawConnect',
    default: 'PawConnect – Ethical Pet Adoption, Verified NGOs & Nutrition Care',
  },
  description: 'PawConnect brings together loving families and rescued pets with verified animal shelters, personalized diet plans, and certified veterinary clinics.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'PawConnect',
    title: 'PawConnect – Ethical Pet Adoption, Verified NGOs & Nutrition Care',
    description: 'PawConnect brings together loving families and rescued pets with verified animal shelters, personalized diet plans, and certified veterinary clinics.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Happy adopted dogs and cats with PawConnect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PawConnect – Ethical Pet Adoption & Pet Care',
    description: 'Find adoptable pets, verified shelter non-profits, and tailored pet diets.',
    images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Providers>
          <SiteHeader />
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
