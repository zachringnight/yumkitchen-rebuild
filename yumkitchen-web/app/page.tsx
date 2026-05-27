import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { CakeStudioBand } from '@/components/CakeStudioBand';
import { ExperienceStats } from '@/components/ExperienceStats';
import { KineticMenuRail } from '@/components/KineticMenuRail';
import { LocationGrid } from '@/components/LocationGrid';
import { MediaProofBand } from '@/components/MediaProofBand';
import { PhotoMotionStory } from '@/components/PhotoMotionStory';
import { SeasonalShowcase } from '@/components/SeasonalShowcase';
import { SummerTakeoutBand } from '@/components/SummerTakeoutBand';
import { organizationJsonLd } from '@/lib/locations';

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <HomeHero />
      <RedBand />
      <ExperienceStats />
      <PhotoMotionStory />
      <MenuFeature />
      <SeasonalShowcase />
      <KineticMenuRail />
      <SummerTakeoutBand />
      <CakeStudioBand />
      <MediaProofBand />
      <CateringCallout />
      <LocationGrid />
    </main>
  );
}
