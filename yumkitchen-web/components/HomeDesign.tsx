'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatedYumLogo } from './AnimatedYumLogo';
import { LocationPickerModal } from './LocationPickerModal';
import { locations } from '@/lib/locations';

const heroImages = [
  { src: '/images/yum-hero-1698.jpg', label: 'scratch food' },
  { src: '/images/yum-grainy-mustard-salmon.png', label: 'dinner plates' },
  { src: '/images/yum-bobs-tomato-soup.jpg', label: 'soup counter' },
  { src: '/images/yum-catering-tray.jpg', label: 'take-home boxes' },
  { src: '/images/yum-szecret-salmon.png', label: 'seasonal entrees' },
  { src: '/images/yum-bakery-key-lime-pie.jpg', label: 'bakery case' },
] as const;

const heroProofItems = [
  { value: '4', label: 'neighborhood kitchens' },
  { value: '8am - 8pm', label: 'open daily' },
  { value: 'since 2005', label: 'made from scratch' },
] as const;

const menuFeatureItems = [
  {
    name: 'mixed berry salad',
    category: 'salads',
    price: '$15.95',
    copy: 'Bright greens, berries, goat cheese, sweet and spicy pecans, and a maple vinaigrette finish.',
    image: '/images/yum-mixed-berry-salad.png',
  },
  {
    name: 'grainy mustard salmon',
    category: 'dinner',
    price: '$23.95',
    copy: 'One of the great take-home dinners: seasonal vegetables, sauce, and a clean finish.',
    image: '/images/yum-grainy-mustard-salmon.png',
  },
  {
    name: 'ahi tuna sandwich',
    category: 'sandwiches',
    price: '$18.95',
    copy: 'Seared ahi, crisp slaw, and big flavor built for lunch at yum! or dinner at home.',
    image: '/images/yum-ahi-tuna.png',
  },
  {
    name: 'tortilla soup',
    category: 'soups',
    price: '$6.95 / $7.95 / $15.95',
    copy: 'A counter favorite for quick lunches, family dinners, and easy weeknight backup.',
    image: '/images/yum-soups-tortilla.jpg',
  },
  {
    name: 'rhubarb upside down cupcake',
    category: 'bakery',
    price: '$4.95',
    copy: 'Seasonal bakery case energy: bright, pretty, and ready for the ride home.',
    image: '/images/yum-bakery-rhubarb-cupcake.jpg',
  },
  {
    name: 'mini key lime pie',
    category: 'dessert',
    price: '$7.95',
    copy: 'Small enough for one, good enough to justify bringing extra.',
    image: '/images/yum-bakery-key-lime-pie.jpg',
  },
] as const;

export function HomeHero() {
  const [current, setCurrent] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);
  const [announcedHeroLabel, setAnnouncedHeroLabel] = useState('');
  const currentHero = heroImages[current];
  const currentHeroLabel = heroImages[current].label;
  const closeOrder = useCallback(() => setOrderOpen(false), []);

  const showHero = (index: number) => {
    setCurrent(index);
    setAnnouncedHeroLabel(heroImages[index].label);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % heroImages.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="home-hero relative min-h-[660px] overflow-hidden bg-ink md:min-h-[730px]">
      <div className="home-hero-media" aria-hidden="true">
        <Image
          key={currentHero.src}
          src={currentHero.src}
          alt=""
          fill
          preload={current === 0}
          fetchPriority={current === 0 ? 'high' : undefined}
          loading={current === 0 ? 'eager' : 'lazy'}
          sizes="100vw"
          className="home-hero-image is-active object-cover"
        />
      </div>
      <div className="container-content relative z-10 flex min-h-[660px] items-center py-8 md:min-h-[730px] md:py-12">
        <div className="hero-panel motion-role-entrance max-w-[520px] border border-white/70 bg-white/95 px-6 py-6 shadow-[0_1.4rem_4rem_rgb(45_45_45_/_0.24)] backdrop-blur-[2px] md:px-9 md:py-8">
          <AnimatedYumLogo className="hero-yum-logo" decorative priority />
          <h1 className="font-serif text-[2.35rem] font-normal leading-[1.08] lowercase text-ink md:text-[3rem]" aria-label="made from scratch with love">
            made from scratch
            <br />
            with love
          </h1>
          <div className="my-4 h-px bg-ink/20" />
          <p className="text-[1.08rem] leading-7 text-body md:text-lg">
            Eat at one of our four neighborhood kitchens, take us to work, or bring dinner home. Open daily 8am - 8pm.
          </p>
          <div className="hero-proof-grid" aria-label="Yum Kitchen proof points">
            {heroProofItems.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2" aria-label="yum! locations">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/location/${location.slug}`}
                prefetch={false}
                className="border border-ink/15 bg-page px-3 py-2 text-center text-sm font-bold leading-none text-ink transition hover:border-brand-red hover:bg-brand-red hover:text-white"
              >
                {location.short_name}
              </Link>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {announcedHeroLabel ? `Showing ${announcedHeroLabel}` : ''}
          </p>
          <div className="my-4 h-px bg-ink/20" />
          <div className="home-hero-actions grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link href="/#locations" prefetch={false} className="btn-secondary">
              Find a Kitchen
            </Link>
            <Link href="/menu" prefetch={false} className="btn-secondary">
              Browse Menu
            </Link>
            <button type="button" className="btn-primary" onClick={() => setOrderOpen(true)}>
              Start Order
            </button>
          </div>
        </div>
      </div>
      <div className="home-hero-footer absolute bottom-4 left-6 right-6 z-10 flex flex-col gap-3 text-cream md:left-auto md:right-7 md:w-[23rem]">
        <div className="text-xs font-medium uppercase tracking-[0.1em] text-cream/75 md:text-right" aria-label={`Now showing ${currentHeroLabel}`}>
          made from scratch since 2005
        </div>
        <div className="home-hero-controls" aria-label="Featured yum! photography">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Show ${image.label}`}
              aria-pressed={index === current}
              className="home-hero-indicator"
              onClick={() => showHero(index)}
            >
              <span>{image.label}</span>
            </button>
          ))}
        </div>
      </div>
      <LocationPickerModal open={orderOpen} onClose={closeOrder} mode="order" />
    </section>
  );
}

export function RedBand() {
  return (
    <section className="red-band-motion relative overflow-hidden bg-brand-red px-6 py-8 text-white md:py-10">
      <div className="mx-auto grid max-w-[1180px] items-center gap-6 md:grid-cols-[1.1fr_2fr_auto]">
        <h2 className="font-serif text-[1.95rem] font-normal leading-tight lowercase md:text-[2.45rem]">
          serving great food for now or for later
        </h2>
        <div className="grid gap-3 text-[1.1rem] leading-snug text-white md:grid-cols-3">
          <p className="text-white">preparing the best food of each season</p>
          <p className="text-white">loving what we do and how we do it</p>
          <p className="text-white">breakfast, lunch, dinner, bakery, and catering</p>
        </div>
        <Link href="/menu" prefetch={false} className="inline-block border-2 border-white px-5 py-3 text-center text-lg font-bold leading-none text-white transition hover:bg-white hover:text-ink">
          See the Menu
        </Link>
      </div>
    </section>
  );
}

export function MenuFeature() {
  const [active, setActive] = useState(0);
  const item = menuFeatureItems[active];

  return (
    <section className="bg-page px-6 py-14 md:py-18">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="menu-feature-copy">
          <h2 className="font-serif text-[2.15rem] font-normal leading-tight lowercase text-ink md:text-[2.75rem]">
            welcome back your favorites or discover new eats
          </h2>
          <p className="mt-4 max-w-[34rem] text-lg leading-8 text-body">
            The homepage now works harder: quick categories, real food cards, prices, and direct routes to the full menu or ordering.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/menu" prefetch={false} className="btn-primary">
              Browse Full Menu
            </Link>
            <Link href="/order" prefetch={false} className="btn-secondary">
              Build an Order
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2" aria-label="menu highlights">
            <span className="block border-t border-ink/20 pt-3 text-sm font-bold leading-tight text-body">
              <strong className="mb-1 block font-serif text-[1.35rem] font-normal leading-none text-ink">all day</strong>
              breakfast
            </span>
            <span className="block border-t border-ink/20 pt-3 text-sm font-bold leading-tight text-body">
              <strong className="mb-1 block font-serif text-[1.35rem] font-normal leading-none text-ink">bakery</strong>
              daily case
            </span>
            <span className="block border-t border-ink/20 pt-3 text-sm font-bold leading-tight text-body">
              <strong className="mb-1 block font-serif text-[1.35rem] font-normal leading-none text-ink">takeout</strong>
              family dinner
            </span>
          </div>
        </div>
        <div className="menu-feature-board">
          <div className="menu-feature-frame relative aspect-[4/3] bg-white">
            <Image
              key={item.image}
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="menu-feature-photo object-cover"
            />
            <div className="menu-feature-active absolute bottom-4 left-4 right-4 z-10 bg-white/95 p-4 shadow-[0_0.75rem_2rem_rgb(45_45_45_/_0.16)] md:max-w-[30rem]">
              <span>{item.category}</span>
              <strong>{item.name}</strong>
              <p>{item.copy}</p>
              <em>{item.price}</em>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {menuFeatureItems.map((menuItem, index) => (
              <button
                key={menuItem.name}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-label={`Show ${menuItem.name}`}
                className={`min-h-[4.5rem] border px-3 py-3 text-left text-base font-bold leading-tight lowercase transition ${
                  index === active ? 'border-brand-red bg-brand-red text-white' : 'border-ink/15 bg-white text-ink hover:border-ink'
                }`}
              >
                <span className={`mb-1 block text-xs font-bold uppercase leading-none tracking-[0.08em] ${index === active ? 'text-white' : 'text-brand-red'}`}>
                  {menuItem.category}
                </span>
                {menuItem.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CateringCallout() {
  const [callOpen, setCallOpen] = useState(false);
  const closeCall = useCallback(() => setCallOpen(false), []);

  return (
    <section className="bg-ink px-6 py-14 text-white md:py-18">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="catering-panel bg-white px-7 py-7 text-ink md:px-9 md:py-9">
          <h2 className="font-serif text-[2.25rem] font-normal leading-tight lowercase text-ink md:text-[2.7rem]">yum! catering</h2>
          <p className="mt-4 text-lg leading-8 text-body">
            Sandwich platters, box lunches, salads, baked goods, and family-style favorites with the same yum! counter polish.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <span className="border border-ink/15 px-2 py-3 text-center text-sm font-bold leading-tight text-ink">24 hour notice</span>
            <span className="border border-ink/15 px-2 py-3 text-center text-sm font-bold leading-tight text-ink">pickup ready</span>
            <span className="border border-ink/15 px-2 py-3 text-center text-sm font-bold leading-tight text-ink">office friendly</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={() => setCallOpen(true)}>
              Call Us
            </button>
            <Link href="/catering#inquiry" className="btn-primary">
              Plan Catering
            </Link>
          </div>
        </div>
        <div className="catering-photo-grid" aria-label="catering food photography">
          <div className="relative min-h-[290px] overflow-hidden md:min-h-[390px]">
            <Image
              src="/images/yum-catering-tray.jpg"
              alt="yum! boxed lunch catering tray"
              fill
              loading="eager"
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="catering-mini-grid">
            <div className="relative min-h-[145px] overflow-hidden">
              <Image src="/images/yum-soup-and-sandwich.jpg" alt="yum! soup and sandwich" fill loading="eager" sizes="280px" className="object-cover" />
            </div>
            <div className="relative min-h-[145px] overflow-hidden">
              <Image src="/images/yum-shake-and-sandwich.jpg" alt="yum! shake and sandwich" fill loading="eager" sizes="280px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
      <LocationPickerModal open={callOpen} onClose={closeCall} mode="call" />
    </section>
  );
}
