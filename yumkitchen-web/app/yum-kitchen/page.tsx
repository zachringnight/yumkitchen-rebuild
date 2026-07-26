import type { Metadata } from 'next';
import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { featuredDishes } from '@/lib/featuredDishes';
import { CakeStudioBand } from '@/components/CakeStudioBand';
import { ExperienceStats } from '@/components/ExperienceStats';
import { GiftCardBand } from '@/components/GiftCardBand';
import { KineticMenuRail } from '@/components/KineticMenuRail';
import { LocationGrid } from '@/components/LocationGrid';
import { PhotoMotionStory } from '@/components/PhotoMotionStory';
import { ReviewsWall } from '@/components/ReviewsWall';
import { SeasonalShowcase } from '@/components/SeasonalShowcase';
import { brandJsonLd, organizationJsonLd } from '@/lib/locations';
import { yumHostRoutingEnabled } from '@/lib/hostRouting';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle('restaurants'),
  description: pageMeta.home.description,
  // With host routing on, the restaurant home is served at the bare domain
  // (proxy.ts rewrite), so that becomes the canonical URL.
  alternates: { canonical: yumCanonical(yumHostRoutingEnabled ? '/' : '/yum-kitchen') },
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
      <MenuFeature items={featuredDishes} />
      <KineticMenuRail />
      <SeasonalShowcase />
      <PhotoMotionStory />
      <ExperienceStats />
      <ReviewsWall surface="yum" />
      <CakeStudioBand />
      <CateringCallout />
      <GiftCardBand source="homepage" tone="white" />
      <LocationGrid />
    </main>
  );
}
