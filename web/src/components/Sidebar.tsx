'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSidebarOpen } from '../store/uiSlice';
import { clearAuth, getUser } from '../auth';
import { User } from '../types';

export function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = useSelector((state: RootState) => state.ui?.sidebarOpen ?? false);

  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(getUser());
  }, [pathname, isOpen]);

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      dispatch(setSidebarOpen(false));
    }
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    dispatch(setSidebarOpen(false));
    router.push('/login');
  };

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeSidebar}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(44, 24, 16, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 90,
          transition: 'opacity 0.2s ease',
        }}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '300px',
          maxWidth: '85vw',
          backgroundColor: '#FFFDF9',
          borderRight: '2px solid #F0E8D9',
          boxShadow: '4px 0 24px rgba(44, 24, 16, 0.15)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-label="Sidebar navigation"
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#ECC067',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(44, 24, 16, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>🐾</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2C1810' }}>Paw Connect</span>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.3rem',
              color: '#2C1810',
              cursor: 'pointer',
              padding: '4px 8px',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* User preview */}
        {mounted && currentUser && (
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#F8F3E6',
              borderBottom: '1px solid #EAE0CD',
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, color: '#2C1810', fontSize: '0.95rem' }}>
              {currentUser.name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6E5D53' }}>
              {currentUser.email} • <span style={{ fontWeight: 600 }}>{currentUser.role}</span>
            </p>
          </div>
        )}

        {/* Navigation list */}
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#9C8878', padding: '0.5rem 0.75rem' }}>
            Main Features
          </div>

          <Link
            href="/foodproducts"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/foodproducts' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/foodproducts' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>🥫</span>
            <span>{t('nav.foodProducts')}</span>
          </Link>

          <Link
            href="/dietgenerator"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/dietgenerator' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/dietgenerator' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>🥣</span>
            <span>{t('nav.dietGenerator')}</span>
          </Link>

          <Link
            href="/petadopt"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/petadopt' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/petadopt' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>🐶</span>
            <span>{t('nav.adopt')}</span>
          </Link>

          <Link
            href="/petcare"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/petcare' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/petcare' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>🩺</span>
            <span>{t('nav.petCare')}</span>
          </Link>

          <Link
            href="/fundraisermanagement"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/fundraisermanagement' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/fundraisermanagement' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>💖</span>
            <span>{t('nav.fundraisers')}</span>
          </Link>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#9C8878', padding: '0.75rem 0.75rem 0.25rem' }}>
            Account & Device
          </div>

          <Link
            href="/profile"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/profile' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/profile' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>👤</span>
            <span>{t('nav.profile')}</span>
          </Link>

          <Link
            href="/geolocation"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/geolocation' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/geolocation' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>📍</span>
            <span>{t('nav.geolocation')}</span>
          </Link>

          <Link
            href="/clipboard"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/clipboard' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/clipboard' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>📋</span>
            <span>{t('nav.clipboard')}</span>
          </Link>

          <Link
            href="/network"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/network' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/network' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>📶</span>
            <span>{t('nav.network')}</span>
          </Link>

          <Link
            href="/bluetooth"
            onClick={closeSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: pathname === '/bluetooth' ? '#2C1810' : '#4E3E34',
              backgroundColor: pathname === '/bluetooth' ? '#F6E5B8' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>🔷</span>
            <span>{t('nav.bluetooth')}</span>
          </Link>

          {/* Admin link - only if ADMIN role */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeSidebar}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#8A3B14',
                backgroundColor: pathname === '/admin' ? '#FDE8DE' : '#FFF2EB',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid #F5C6B1',
              }}
            >
              <span>🛡️</span>
              <span>{t('nav.admin')}</span>
            </Link>
          )}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid #F0E8D9' }}>
          {mounted && currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: '#FFF0ED',
                color: '#C53030',
                border: '1px solid #FED7D7',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>🚪</span>
              <span>{t('nav.logout')}</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeSidebar}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: '#ECC067',
                color: '#2C1810',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              <span>🔑</span>
              <span>{t('nav.login')}</span>
            </Link>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

export default Sidebar;
