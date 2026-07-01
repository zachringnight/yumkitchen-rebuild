import type { Metadata } from 'next';
import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { CakeStudioBand } from '@/components/CakeStudioBand';
import { ExperienceStats } from '@/components/ExperienceStats';
import { KineticMenuRail } from '@/components/KineticMenuRail';
import { LocationGrid } from '@/components/LocationGrid';
import { PhotoMotionStory } from '@/components/PhotoMotionStory';
import { SeasonalShowcase } from '@/components/SeasonalShowcase';
import { brandJsonLd, organizationJsonLd } from '@/lib/locations';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle('restaurants'),
  description: pageMeta.home.description,
  alternates: { canonical: yumCanonical('/yum-kitchen') },
  openGraph: yumOpenGraph(pageMeta.home.image),
  twitter: { images: [pageMeta.home.image] },
};

export default function YumKitchenHomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd()) }} />
      <HomeHero />
      <RedBand />
      <KineticMenuRail />
      <MenuFeature />
      <SeasonalShowcase />
      <PhotoMotionStory />
      <ExperienceStats />
      <CakeStudioBand />
      <CateringCallout />
      <LocationGrid />
    </main>
  );
}
