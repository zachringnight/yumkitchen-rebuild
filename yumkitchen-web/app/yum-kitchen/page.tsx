import type { Metadata } from 'next';
import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { CakeStudioBand } from '@/components/CakeStudioBand';
import { LocationGrid } from '@/components/LocationGrid';
import { brandJsonLd, organizationJsonLd } from '@/lib/locations';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: 'yum! Kitchen restaurant',
  description: pageMeta.home.description,
  alternates: { canonical: '/yum-kitchen' },
  openGraph: { images: [pageMeta.home.image] },
  twitter: { images: [pageMeta.home.image] },
};

export default function YumKitchenHomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd()) }} />
      <HomeHero />
      <RedBand />
      <MenuFeature />
      <CakeStudioBand />
      <CateringCallout />
      <LocationGrid />
    </main>
  );
}
