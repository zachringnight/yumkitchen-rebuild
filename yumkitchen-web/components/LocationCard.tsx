import Link from 'next/link';
import type { Location } from '@/lib/locations';

type Props = {
  loc: Location;
  compact?: boolean;
};

export function LocationCard({ loc, compact = false }: Props) {
  return (
    <article className="location-card flex h-full flex-col bg-white px-5 py-6">
      <Link href={`/location/${loc.slug}`} className="mb-3 block font-serif text-xl font-normal leading-tight lowercase text-ink hover:text-brand-primary">
        {loc.name}
      </Link>
      <address className="not-italic text-body">
        <a
          href={loc.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-primary"
        >
          {loc.address.street}
          <br />
          {loc.address.city}, {loc.address.state} {loc.address.zip}
        </a>
      </address>
      <a href={`tel:${loc.phone_e164}`} className="text-brand-primary hover:underline">
          {loc.phone}
        </a>
      <p className="text-body">{loc.hours}</p>
      {!compact && <p className="text-base leading-7 text-body">{loc.parking}</p>}
      <div className="mt-auto flex flex-col gap-2 pt-5">
        <a
          href={loc.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-link"
        >
          Get Directions →
        </a>
        <a
          href={loc.order_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-center"
          data-event="click_order_online"
          data-location={loc.slug}
        >
          Order Online
        </a>
      </div>
    </article>
  );
}
