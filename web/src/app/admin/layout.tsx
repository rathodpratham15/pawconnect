import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { AuthGate } from '../../components/AuthGate';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AuthGate requiredRole="ADMIN">{children}</AuthGate>;
}
