import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GiftCardBand } from '@/components/GiftCardBand';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { LocationExperienceBand } from '@/components/LocationExperienceBand';
import { LocationGrid } from '@/components/LocationGrid';
import { LocationPreferenceSync } from '@/components/LocationPreferenceSync';
import { OpenStatus } from '@/components/OpenStatus';
import { entityJsonLd, getLocationBySlug, locations } from '@/lib/locations';
import { yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

type LocationRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LocationRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) return {};
  return {
    applicationName: yumKitchenSiteName,
    title: yumTitle(loc.name),
    description: loc.metaDescription,
    alternates: { canonical: yumCanonical(`/location/${loc.slug}`) },
    openGraph: yumOpenGraph(loc.heroImage),
    twitter: { images: [loc.heroImage] },
  };
}

export default async function LocationPage({ params }: LocationRouteProps) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) notFound();

  return (
    <main>
      <JsonLd data={entityJsonLd(loc)} />
      <LocationPreferenceSync slug={loc.slug} />
      <Hero title={loc.name} copy={loc.neighborhood} image={loc.heroImage} imageAlt={`${loc.short_name} yum! restaurant`} priority>
        <a href={loc.order_url} target="_blank" rel="noopener noreferrer" className="btn-primary" data-event="click_order_online" data-location={loc.slug} data-source="location_page_hero">
          Order Online
        </a>
        <a href={`tel:${loc.phone_e164}`} className="btn-secondary" data-event="click_call_location" data-location={loc.slug} data-source="location_page_hero">
          Call {loc.short_name}
        </a>
      </Hero>
      <LocationExperienceBand loc={loc} />
      <section className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-6">
            <div>
              <p className="section-label">visit us</p>
              <h2 className="text-h2 lowercase">hours, parking, and pickup</h2>
            </div>
            <address className="not-italic text-xl leading-9 text-ink">
              {loc.address.street}
              <br />
              {loc.address.city}, {loc.address.state} {loc.address.zip}
            </address>
            <div className="grid gap-3 text-xl leading-8">
              <p>
                <OpenStatus />
              </p>
              <p>Holiday hours may vary. Call the restaurant for same-day confirmation.</p>
              <p>{loc.parking}</p>
              <p>{loc.roomNote}</p>
              <p>{loc.favorite}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={loc.maps_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Get Directions
              </a>
              <a href={`tel:${loc.phone_e164}`} className="btn-primary">
                {loc.phone}
              </a>
            </div>
          </div>
          <div className="min-h-[420px]">
            <iframe
              src={loc.maps_embed}
              title={`Map: yum! ${loc.short_name}`}
              loading="lazy"
              className="h-full min-h-[420px] w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      <GiftCardBand source="location_page" />
      <LocationGrid />
    </main>
  );
}
