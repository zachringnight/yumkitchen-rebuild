import Image from 'next/image';
import Link from 'next/link';
import { seasonalHighlights } from '@/lib/site';

export function SeasonalShowcase() {
  return (
    <section className="bg-cream py-section" data-reveal>
      <div className="container-content">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="section-label">what looks good today</p>
            <h2 className="text-h2 lowercase">seasonal favorites with real appetite appeal</h2>
            <p className="mt-4 text-xl leading-8">
              A quick look at the dishes, soups, sandwiches, and bakery treats people come back for again and again.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/menu" className="btn-primary">
              See What&apos;s New
            </Link>
            <Link href="/yum-kitchen#locations" className="btn-secondary">
              Find a Restaurant
            </Link>
          </div>
        </div>
        <div className="stagger-reveal mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {seasonalHighlights.map((item) => (
            <Link key={item.title} href={item.href} className="accent-card group bg-white shadow-xs">
              <div className="relative aspect-4/3 overflow-hidden bg-page">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="image-lift object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl lowercase">{item.title}</h3>
                <p className="mt-2 text-base leading-7">{item.description}</p>
                <span className="btn-link mt-4 inline-block">View on Menu</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
