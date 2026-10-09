'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar } from '../store/uiSlice';
import { clearAuth, getUser, isAuthenticated } from '../auth';
import { User } from '../types';

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(getUser());
  }, [pathname]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', nextLang);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ECC067',
        color: '#2C1810',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(44, 24, 16, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Hamburger & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle navigation menu"
            style={{
              background: 'rgba(44, 24, 16, 0.08)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: '#2C1810' }} />
            <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: '#2C1810' }} />
            <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: '#2C1810' }} />
          </button>

          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#2C1810',
              fontWeight: 800,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🐾</span>
            <span>Paw Connect</span>
          </Link>
        </div>

        {/* Center: Main quick links */}
        <nav
          style={{
            display: 'none',
            gap: '1.25rem',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
          className="desktop-nav"
        >
          <Link href="/pets" style={{ textDecoration: 'none', color: '#2C1810' }}>
            {t('nav.pets')}
          </Link>
          <Link href="/ngos" style={{ textDecoration: 'none', color: '#2C1810' }}>
            {t('nav.ngos')}
          </Link>
          <Link href="/products" style={{ textDecoration: 'none', color: '#2C1810' }}>
            {t('nav.foodProducts')}
          </Link>
          <Link href="/tips" style={{ textDecoration: 'none', color: '#2C1810' }}>
            {t('nav.tips')}
          </Link>
          <Link href="/petcare" style={{ textDecoration: 'none', color: '#2C1810' }}>
            {t('nav.petCare')}
          </Link>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language between English and French"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(44, 24, 16, 0.15)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#2C1810',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🌐</span>
            <span>{mounted && i18n.language === 'fr' ? 'FR' : 'EN'}</span>
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label={`Shopping cart with ${totalCartCount} items`}
            style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid rgba(44, 24, 16, 0.15)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#2C1810',
              fontSize: '1.1rem',
            }}
          >
            🛒
            {totalCartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#E04A3A',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User status */}
          {mounted && currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                href="/profile"
                style={{
                  background: 'rgba(44, 24, 16, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: '#2C1810',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>👤</span>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                background: '#2C1810',
                color: '#FFFDF9',
                padding: '6px 14px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}

export default SiteHeader;
