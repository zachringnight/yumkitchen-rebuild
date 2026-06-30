import Image from 'next/image';
import Link from 'next/link';
import { cakeGallery } from '@/lib/site';

export function CakeStudioBand() {
  return (
    <section className="cake-studio bg-cream py-section" data-reveal>
      <div className="container-content grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div className="cake-studio-board" aria-label="Yum bakery dessert gallery">
          {cakeGallery.map((image, index) => (
            <div key={image.src} className={`cake-studio-photo cake-studio-photo-${index + 1}`}>
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 26vw, 70vw" className="object-cover" />
            </div>
          ))}
          <div className="cake-studio-note">
            <span>yum!</span>
            <span>bakery case to celebration table</span>
          </div>
        </div>
        <div>
          <p className="section-label">bakery love</p>
          <h2 className="text-h2 lowercase">from the bakery case to the celebration table</h2>
          <p className="mt-5 text-xl leading-9">
            Patticake, coconut cake, and bakery favorites are made for the birthdays, weddings, office parties, and just-because days that need something sweet.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/order-a-cake#shop-patticake" className="btn-primary">
              Pick Up Locally
            </Link>
            <Link href="/patticake" className="btn-secondary">
              Ship a Cake
            </Link>
            <Link href="/menu#bakery" className="btn-secondary">
              See Bakery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
