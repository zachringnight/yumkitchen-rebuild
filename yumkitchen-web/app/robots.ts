import type { MetadataRoute } from 'next';
import { patticakeSiteUrl, yumKitchenSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [`${patticakeSiteUrl}/sitemap.xml`, `${yumKitchenSiteUrl}/sitemap.xml`],
  };
}
