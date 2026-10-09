'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../auth';

export function PublicOnly() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/homepage');
    }
  }, [router]);

  return null;
}

export default PublicOnly;
