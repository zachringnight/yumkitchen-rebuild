import type { MetadataRoute } from 'next';
import { locations } from '@/lib/locations';
import { siteUrl } from '@/lib/site';

const staticRoutes = [
  '',
  '/order',
  '/menu',
  '/catering',
  '/order-a-cake',
  '/about',
  '/careers',
  '/in-the-news',
  '/contact',
  '/accessibility-statement',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: route === '' || route === '/menu' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : route === '/menu' ? 0.9 : 0.7,
    })),
    ...locations.map((loc) => ({
      url: `${siteUrl}/location/${loc.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
