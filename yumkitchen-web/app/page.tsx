import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { CakeStudioBand } from '@/components/CakeStudioBand';
import { LocationGrid } from '@/components/LocationGrid';
import { organizationJsonLd } from '@/lib/locations';

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <HomeHero />
      <RedBand />
      <MenuFeature />
      <CakeStudioBand />
      <CateringCallout />
      <LocationGrid />
    </main>
  );
}
