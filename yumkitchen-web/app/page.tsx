import type { Metadata } from 'next';
import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { CakeStudioBand } from '@/components/CakeStudioBand';
import { LocationGrid } from '@/components/LocationGrid';
import { brandJsonLd, organizationJsonLd } from '@/lib/locations';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
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
