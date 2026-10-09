import type { Metadata } from 'next';
import React from 'react';
import { PublicOnly } from '../../components/PublicOnly';
import { SignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a PawConnect account to adopt pets, connect with animal shelters, and order nutritious meals.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return (
    <>
      <PublicOnly />
      <main
        style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          position: 'relative',
          backgroundImage:
            'linear-gradient(rgba(44, 24, 16, 0.4), rgba(44, 24, 16, 0.6)), url(https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1920&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <SignupForm />
      </main>
    </>
  );
}
