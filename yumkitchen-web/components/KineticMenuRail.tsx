import Image from 'next/image';
import Link from 'next/link';
import { orderDemoItems } from '@/lib/site';

function orderHref(category: string) {
  return `/order?category=${encodeURIComponent(category)}#favorites`;
}

function FavoriteCard({ item, duplicate = false }: { item: (typeof orderDemoItems)[number]; duplicate?: boolean }) {
  const content = (
    <>
      <span className="relative block aspect-4/3 overflow-hidden bg-page">
        <Image src={item.image} alt={duplicate ? '' : item.name} fill sizes="280px" className="image-lift object-cover" />
      </span>
      <span className="block p-4">
        <span className="block text-xs font-bold uppercase tracking-[0.16em] text-brand-primary-deep">{item.category}</span>
        <span className="mt-1 block font-serif text-2xl lowercase text-ink">{item.name}</span>
        <span className="mt-2 block text-base font-bold text-ink">${item.price.toFixed(2)}</span>
      </span>
    </>
  );

  if (duplicate) {
    return (
      <div className="kinetic-card bg-white shadow-xs" aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={orderHref(item.category)} className="kinetic-card group bg-white shadow-xs focus:outline-solid focus:outline-2 focus:outline-offset-4 focus:outline-brand-primary">
      {content}
    </Link>
  );
}

export function KineticMenuRail() {
  const favorites = orderDemoItems.slice(0, 6);

  return (
    <section className="overflow-hidden bg-white py-12" data-reveal>
      <div className="container-content mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="section-label">ready when cravings hit</p>
          <h2 className="text-h2 lowercase">regulars already know where to start</h2>
        </div>
        <Link href="/order#favorites" className="btn-primary self-start md:self-auto">
          Start an Order
        </Link>
      </div>
      <div className="kinetic-rail">
        <div className="kinetic-track">
          <div className="kinetic-set">
            {favorites.map((item) => (
              <FavoriteCard key={item.name} item={item} />
            ))}
          </div>
          <div className="kinetic-set" aria-hidden="true">
            {favorites.map((item) => (
              <FavoriteCard key={`duplicate-${item.name}`} item={item} duplicate />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
