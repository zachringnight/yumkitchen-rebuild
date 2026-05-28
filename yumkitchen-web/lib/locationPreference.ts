import type { LocationSlug } from './locations';

export const defaultLocationSlug: LocationSlug = 'st-louis-park';
export const preferredLocationStorageKey = 'yum_preferred_location';
export const preferredLocationChangedEvent = 'yum:preferred-location-changed';

const locationSlugs: LocationSlug[] = ['st-louis-park', 'shady-oak', 'saint-paul', 'woodbury'];

export function isLocationSlug(value: unknown): value is LocationSlug {
  return typeof value === 'string' && locationSlugs.includes(value as LocationSlug);
}

export function getPreferredLocationSlug(): LocationSlug {
  if (typeof window === 'undefined') return defaultLocationSlug;
  const stored = window.localStorage.getItem(preferredLocationStorageKey);
  return isLocationSlug(stored) ? stored : defaultLocationSlug;
}

export function setPreferredLocationSlug(slug: LocationSlug) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(preferredLocationStorageKey, slug);
  window.dispatchEvent(new CustomEvent(preferredLocationChangedEvent, { detail: { slug } }));
}

export function subscribeToPreferredLocation(listener: (slug: LocationSlug) => void) {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === preferredLocationStorageKey && isLocationSlug(event.newValue)) {
      listener(event.newValue);
    }
  };
  const onCustom = (event: Event) => {
    const slug = (event as CustomEvent<{ slug?: unknown }>).detail?.slug;
    if (isLocationSlug(slug)) listener(slug);
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(preferredLocationChangedEvent, onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(preferredLocationChangedEvent, onCustom);
  };
}
