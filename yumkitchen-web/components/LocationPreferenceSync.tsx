'use client';

import { useEffect } from 'react';
import type { LocationSlug } from '@/lib/locations';
import { setPreferredLocationSlug } from '@/lib/locationPreference';

type LocationPreferenceSyncProps = {
  slug: LocationSlug;
};

export function LocationPreferenceSync({ slug }: LocationPreferenceSyncProps) {
  useEffect(() => {
    setPreferredLocationSlug(slug);
  }, [slug]);

  return null;
}
