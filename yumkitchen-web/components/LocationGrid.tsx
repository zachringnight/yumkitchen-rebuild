import { locations } from '@/lib/locations';
import { LocationCard } from './LocationCard';

export function LocationGrid() {
  return (
    <section id="locations" className="location-section bg-page py-14 md:py-18">
      <div className="container-content">
        <div className="mb-8 grid items-end gap-5 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-[2.2rem] font-normal leading-tight lowercase text-ink md:text-[2.9rem]">easy to find, easy to park</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-body">Four neighborhood kitchens, open daily 8am - 8pm, built for dine-in, pickup, and the ride home.</p>
          </div>
          <a href="tel:+19529229999" className="btn-secondary">
            Call yum!
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((loc) => (
            <LocationCard key={loc.slug} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}
