import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { PublicOnly } from '../../components/PublicOnly';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to PawConnect to manage pet adoptions, custom diet plans, and shelter fundraisers.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <>
      <PublicOnly />
      <main
        style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          position: 'relative',
          backgroundImage:
            'linear-gradient(rgba(44, 24, 16, 0.4), rgba(44, 24, 16, 0.6)), url(https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1920&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Suspense fallback={<div style={{ color: '#FFFFFF', fontWeight: 600 }}>Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
