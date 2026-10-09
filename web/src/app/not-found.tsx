import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#FDFBF7',
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#F7E7C4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.5rem',
          marginBottom: '1.5rem',
        }}
      >
        🐾
      </div>
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#2C1810',
          marginBottom: '0.75rem',
        }}
      >
        404 – Page Not Found
      </h1>
      <p
        style={{
          maxWidth: '520px',
          color: '#6E5D53',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}
      >
        Oops! It seems this tail took a wrong turn. The pet, page, or rescue organization you are looking for does not exist or has been relocated.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="paw-button-primary">
          Back to Home
        </Link>
        <Link href="/pets" className="paw-button-secondary">
          Browse Adoptable Pets
        </Link>
      </div>
    </main>
  );
}
