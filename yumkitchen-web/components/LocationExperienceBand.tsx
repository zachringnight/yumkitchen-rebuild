import Image from 'next/image';
import Link from 'next/link';
import type { Location } from '@/lib/locations';
import { OpenStatus } from './OpenStatus';

export function LocationExperienceBand({ loc }: { loc: Location }) {
  return (
    <section className="location-experience bg-page py-section" data-reveal>
      <div className="container-content grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="section-label">{loc.short_name} details</p>
          <h2 className="text-h2 lowercase">your neighborhood yum! is ready</h2>
          <p className="mt-5 text-xl leading-9">{loc.roomNote}</p>
          <div className="mt-7 grid gap-3 text-lg leading-8">
            <p>
              <strong className="text-ink">Hours:</strong> <OpenStatus compact />
            </p>
            <p>
              <strong className="text-ink">Pickup:</strong> {loc.parking}
            </p>
            <p>
              <strong className="text-ink">Try:</strong> {loc.favorite}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={loc.order_url} target="_blank" rel="noopener noreferrer" className="btn-primary" data-event="click_order_online" data-location={loc.slug} data-source="location_experience_band">
              Order from {loc.short_name}
            </a>
            <Link href="/menu" className="btn-secondary">
              View Menu
            </Link>
          </div>
        </div>
        <div className="location-experience-board">
          <div className="location-experience-main">
            <Image src={loc.cardImage} alt={`${loc.short_name} yum! location`} fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
          </div>
          <div className="location-experience-float location-experience-float-a">
            <Image src="/images/yum-catering-boxed-lunch.jpg" alt="yum! boxed lunch and picnic food" fill sizes="240px" className="object-cover" />
          </div>
          <div className="location-experience-float location-experience-float-b">
            <Image src="/images/yum-cold-brew.jpg" alt="yum! cold brew cup" fill sizes="180px" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
