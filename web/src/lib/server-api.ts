const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  return url.replace(/\/+$/, '');
};

interface FetchOptions {
  revalidate?: number;
}

/**
 * Server-side API GET helper for single resource.
 * Returns null on 404 or 400.
 * Throws on network failure or 5xx outage so an outage is never cached as not-found.
 */
export async function apiGet<T>(endpoint: string, options?: FetchOptions): Promise<T | null> {
  const baseUrl = getBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 300 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 404 || res.status === 400) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText} at ${path}`);
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error?.message?.includes('API error 404') || error?.message?.includes('API error 400')) {
      return null;
    }
    // Re-throw so Next.js treats this as a 500 error / outage rather than caching 404
    throw error;
  }
}

/**
 * Server-side API List helper for collections.
 * Degrades to empty array [] on failure or build time API unavailability.
 */
export async function apiList<T>(endpoint: string, options?: FetchOptions): Promise<T[]> {
  const baseUrl = getBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 300 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[server-api] apiList warning: ${res.status} at ${path}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch (err) {
    console.warn(`[server-api] apiList failed at ${path}, returning empty list for resilient rendering:`, (err as Error).message);
    return [];
  }
}
