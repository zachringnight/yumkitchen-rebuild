import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { LocationExperienceBand } from '@/components/LocationExperienceBand';
import { LocationGrid } from '@/components/LocationGrid';
import { entityJsonLd, getLocationBySlug, locations } from '@/lib/locations';

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
    title: loc.name,
    description: loc.metaDescription,
    alternates: { canonical: `/location/${loc.slug}` },
    openGraph: { images: [loc.heroImage] },
  };
}

export default async function LocationPage({ params }: LocationRouteProps) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) notFound();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entityJsonLd(loc)) }} />
      <Hero title={loc.name} copy={loc.neighborhood} image={loc.heroImage} imageAlt={`${loc.short_name} yum! location`} priority>
        <a href={loc.order_url} target="_blank" rel="noopener noreferrer" className="btn-primary" data-event="click_order_online" data-location={loc.slug}>
          Order Online
        </a>
        <a href={`tel:${loc.phone_e164}`} className="btn-secondary" data-event="click_call_location" data-location={loc.slug}>
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
              <p>{loc.hours}</p>
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
      <LocationGrid />
    </main>
  );
}
