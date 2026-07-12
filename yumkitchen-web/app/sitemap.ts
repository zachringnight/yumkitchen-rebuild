import type { MetadataRoute } from 'next';
import { yumHostRoutingEnabled } from '@/lib/hostRouting';
import { locations } from '@/lib/locations';
import { patticakeSiteUrl, yumKitchenSiteUrl } from '@/lib/site';

const patticakeRoutes = [
  '',
  '/patticake',
  '/order-a-cake',
] as const;

const yumRoutes = [
  // With host routing on, the restaurant home lives at the bare domain.
  yumHostRoutingEnabled ? '' : '/yum-kitchen',
  '/order',
  '/menu',
  '/catering',
  '/about',
  '/careers',
  '/in-the-news',
  '/contact',
  '/faq',
  '/accessibility-statement',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...patticakeRoutes.map((route) => ({
      url: `${patticakeSiteUrl}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.9,
    })),
    ...yumRoutes.map((route) => ({
      url: `${yumKitchenSiteUrl}${route}`,
      lastModified: now,
      changeFrequency: route === '/menu' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/menu' ? 0.9 : route === '/yum-kitchen' || route === '' ? 0.85 : 0.7,
    })),
    ...locations.map((loc) => ({
      url: `${yumKitchenSiteUrl}/location/${loc.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
