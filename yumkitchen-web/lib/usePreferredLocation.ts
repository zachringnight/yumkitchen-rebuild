'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { getLocationBySlug, locations, type LocationSlug } from './locations';
import {
  defaultLocationSlug,
  getPreferredLocationSlug,
  setPreferredLocationSlug,
  subscribeToPreferredLocation,
} from './locationPreference';

export function usePreferredLocation() {
  const slug = useSyncExternalStore(
    (onStoreChange) => subscribeToPreferredLocation(() => onStoreChange()),
    getPreferredLocationSlug,
    () => defaultLocationSlug,
  );

  const setSlug = useCallback((nextSlug: LocationSlug) => {
    setPreferredLocationSlug(nextSlug);
  }, []);

  const location = useMemo(() => getLocationBySlug(slug) ?? locations[0], [slug]);

  return { slug, location, setSlug };
}
