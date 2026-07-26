import { locations } from '@/lib/locations';
import { LocationCard } from './LocationCard';

// excludeSlug drops one restaurant from the grid. A location page passes its own
// slug so the grid reads as "the other restaurants" instead of linking the page
// to itself and showing that storefront photo a third time on its own page.
export function LocationGrid({ excludeSlug }: { excludeSlug?: string } = {}) {
  const shown = excludeSlug ? locations.filter((loc) => loc.slug !== excludeSlug) : locations;
  const heading = excludeSlug ? 'the other yum! restaurants' : 'easy to find, easy to park';
  const intro = excludeSlug
    ? 'Three more neighborhood restaurants, regular hours 8am - 8pm daily. Holiday hours may vary.'
    : 'Four neighborhood restaurants, regular hours 8am - 8pm daily. Holiday hours may vary.';

  return (
    <section id="locations" className="location-section bg-cream py-10 md:py-18">
      <div className="container-content">
        <div className="mb-8 grid items-end gap-5 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-[2.2rem] font-normal leading-tight lowercase text-ink md:text-[2.9rem]">{heading}</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-body">{intro}</p>
          </div>
          <a href="tel:+19529229999" className="btn-secondary">
            Call yum!
          </a>
        </div>
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${excludeSlug ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}>
          {shown.map((loc) => (
            <LocationCard key={loc.slug} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}
