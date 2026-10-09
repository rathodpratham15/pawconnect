'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken, getUser } from '../auth';
import { UserRole } from '../types';

interface AuthGateProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function AuthGate({ children, requiredRole }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      const fromPath = pathname ? encodeURIComponent(pathname) : '';
      router.replace(fromPath ? `/login?from=${fromPath}` : '/login');
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace('/homepage');
      return;
    }

    setAuthorized(true);
  }, [router, pathname, requiredRole]);

  if (!authorized) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDFBF7',
          color: '#2C1810',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              animation: 'bounce 1s infinite alternate',
            }}
          >
            🐾
          </div>
          <p style={{ fontWeight: 600, color: '#6E5D53' }}>Verifying PawConnect session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGate;
