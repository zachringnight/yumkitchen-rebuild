import Image from 'next/image';
import Link from 'next/link';
import type { Location } from '@/lib/locations';
import { OpenStatus } from './OpenStatus';

type Props = {
  loc: Location;
  compact?: boolean;
};

export function LocationCard({ loc, compact = false }: Props) {
  return (
    <article className="location-card group flex h-full flex-col overflow-hidden bg-white">
      {!compact && (
        <Link
          href={`/location/${loc.slug}`}
          className="relative block aspect-[4/2.7] overflow-hidden bg-blue-tint"
          aria-label={`View the yum! ${loc.short_name} location`}
        >
          <Image
            src={loc.cardImage}
            alt={loc.cardImageAlt}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <Link href={`/location/${loc.slug}`} className="block font-serif text-[1.35rem] font-normal leading-tight lowercase text-ink hover:text-brand-primary">
            {loc.name}
          </Link>
          {loc.is_original && (
            <span className="border border-brand-primary/40 bg-white px-2 py-1 text-[0.72rem] font-bold uppercase leading-none tracking-[0.08em] text-ink">
              original
            </span>
          )}
        </div>
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
        <a href={`tel:${loc.phone_e164}`} className="mt-2 text-brand-primary hover:underline">
          {loc.phone}
        </a>
        <OpenStatus compact className="text-body" />
        {!compact && <p className="mt-3 text-base leading-7 text-body">{loc.parking}</p>}
      <div className="location-card-actions mt-auto grid gap-2 pt-5">
        <a
          href={loc.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-base"
        >
          Get Directions
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path d="M4 10h10.2m-4.4-4.4L14.2 10l-4.4 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href={loc.order_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-center"
          data-event="click_order_online"
          data-location={loc.slug}
          data-source="location_card"
        >
          Order Online
        </a>
      </div>
      </div>
    </article>
  );
}
