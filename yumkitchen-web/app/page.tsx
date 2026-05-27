import { CateringCallout, HomeHero, MenuFeature, RedBand } from '@/components/HomeDesign';
import { LocationGrid } from '@/components/LocationGrid';
import { organizationJsonLd } from '@/lib/locations';

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <HomeHero />
      <RedBand />
      <MenuFeature />
      <CateringCallout />
      <LocationGrid />
    </main>
  );
}
