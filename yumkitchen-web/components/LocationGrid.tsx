import { locations } from '@/lib/locations';
import { LocationCard } from './LocationCard';

export function LocationGrid() {
  return (
    <section id="locations" className="bg-page py-section">
      <div className="container-content">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-h2 lowercase">easy to find, easy to park</h2>
          <p className="mt-3">Eat at one of our four locations, take us to work or take us home.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((loc) => (
            <LocationCard key={loc.slug} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}
