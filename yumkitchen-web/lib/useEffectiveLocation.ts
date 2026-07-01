'use client';

import { usePathname } from 'next/navigation';
import { getLocationBySlug } from './locations';
import { usePreferredLocation } from './usePreferredLocation';

export function useEffectiveLocation() {
  const pathname = usePathname();
  const { slug: preferredSlug, location: preferredLocation, setSlug } = usePreferredLocation();
  const routeSlug = pathname.match(/^\/location\/([^/]+)/)?.[1];
  const routeLocation = routeSlug ? getLocationBySlug(routeSlug) : undefined;
  const location = routeLocation ?? preferredLocation;

  return {
    slug: location.slug,
    location,
    preferredSlug,
    setSlug,
    isRouteLocation: Boolean(routeLocation),
  };
}
