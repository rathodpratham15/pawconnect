import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { AuthGate } from '../../components/AuthGate';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateAppLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
