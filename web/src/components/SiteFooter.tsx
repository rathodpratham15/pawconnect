import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#2C1810',
        color: '#F4EBE1',
        padding: '3rem 1rem 2rem',
        marginTop: 'auto',
        borderTop: '4px solid #ECC067',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Col 1: Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🐾</span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#ECC067' }}>Paw Connect</span>
          </div>
          <p style={{ color: '#D5C4B4', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Dedicated to connecting homeless pets with loving families, empowering transparent animal welfare non-profits, and offering science-backed pet health tools.
          </p>
        </div>

        {/* Col 2: Public Portals */}
        <nav aria-label="Public portals">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#ECC067', marginBottom: '1rem' }}>
            Adopt & Explore
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <Link href="/pets" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                All Adoptable Pets
              </Link>
            </li>
            <li>
              <Link href="/ngos" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                Verified Rescue NGOs
              </Link>
            </li>
            <li>
              <Link href="/products" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                Nutritional Pet Food
              </Link>
            </li>
            <li>
              <Link href="/tips" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                Expert Pet Care Tips
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Services & Management */}
        <nav aria-label="Shelter services">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#ECC067', marginBottom: '1rem' }}>
            Shelter & Community
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <Link href="/ngo-management" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                NGO Registration Portal
              </Link>
            </li>
            <li>
              <Link href="/dietgenerator" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                Custom Diet Generator
              </Link>
            </li>
            <li>
              <Link href="/petcare" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                Veterinary & Salon Hub
              </Link>
            </li>
            <li>
              <Link href="/fundraisermanagement" style={{ color: '#F4EBE1', textDecoration: 'none', fontSize: '0.9rem' }}>
                Emergency Fundraisers
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 4: Trust & Ethics */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#ECC067', marginBottom: '1rem' }}>
            Our Guarantee
          </h2>
          <p style={{ color: '#D5C4B4', fontSize: '0.85rem', lineHeight: 1.5 }}>
            🛡️ 100% verified NGO registration IDs. Every health record and disability note is vetted before adoption listing.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🐶</span>
            <span style={{ fontSize: '1.4rem' }}>🐱</span>
            <span style={{ fontSize: '1.4rem' }}>🐰</span>
            <span style={{ fontSize: '1.4rem' }}>🩺</span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '2rem auto 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(244, 235, 225, 0.15)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#B5A293',
        }}
      >
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} PawConnect. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/tips" style={{ color: '#B5A293', textDecoration: 'none' }}>
            Privacy & Animal Ethics
          </Link>
          <Link href="/ngo-management" style={{ color: '#B5A293', textDecoration: 'none' }}>
            Shelter Verification Standards
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
