'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatedYumLogo } from './AnimatedYumLogo';
import { LocationPickerModal } from './LocationPickerModal';

const heroImages = [
  { src: '/images/yum-hero-1698.jpg', label: 'scratch food' },
  { src: '/images/social-grainy-salmon.jpg', label: 'dinner plates' },
  { src: '/images/yum-bobs-tomato-soup.jpg', label: 'soup counter' },
  { src: '/images/social-picnic-perfect.jpg', label: 'take-home boxes' },
  { src: '/images/yum-szecret-salmon.png', label: 'seasonal entrees' },
  { src: '/images/social-cake-slice.jpg', label: 'bakery case' },
] as const;

const heroProofItems = [
  { value: '4', label: 'neighborhood kitchens' },
  { value: '8am - 8pm', label: 'open daily' },
  { value: 'since 2005', label: 'made from scratch' },
] as const;

const menuFeatureItems = [
  { name: 'shrimp louie', image: '/images/yum-mixed-berry-salad.png' },
  { name: 'grainy mustard salmon', image: '/images/yum-grainy-mustard-salmon.png' },
  { name: 'ahi tuna sandwich', image: '/images/yum-ahi-tuna.png' },
  { name: 'tortilla soup', image: '/images/yum-soups-tortilla.jpg' },
  { name: 'rhubarb upside down cupcake', image: '/images/yum-bakery-rhubarb-cupcake.jpg' },
  { name: 'mini key lime pie', image: '/images/yum-bakery-key-lime-pie.jpg' },
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
    <section className="home-hero relative min-h-[720px] overflow-hidden bg-ink md:min-h-[810px]">
      <div className="home-hero-media" aria-hidden="true">
        <Image
          key={currentHero.src}
          src={currentHero.src}
          alt=""
          fill
          preload={current === 0}
          loading={current === 0 ? 'eager' : 'lazy'}
          sizes="100vw"
          className="home-hero-image is-active object-cover"
        />
      </div>
      <div className="container-content relative z-10 flex min-h-[720px] items-center py-10 md:min-h-[810px] md:py-16">
        <div className="hero-panel motion-role-entrance max-w-[540px] bg-cream/90 px-8 py-8 md:px-10">
          <AnimatedYumLogo className="hero-yum-logo" decorative priority />
          <h1 className="font-serif text-[2.45rem] font-normal leading-[1.1] lowercase text-ink md:text-[2.75rem]" aria-label="made from scratch with love">
            made from scratch
            <br />
            with love
          </h1>
          <div className="my-5 h-px bg-ink/20" />
          <p className="text-lg leading-8 text-body">
            Eat at one of our four locations, take us to work or take us home for breakfast, lunch or dinner. Open daily 8am - 8pm.
          </p>
          <div className="hero-proof-grid" aria-label="Yum Kitchen proof points">
            {heroProofItems.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {announcedHeroLabel ? `Showing ${announcedHeroLabel}` : ''}
          </p>
          <div className="my-5 h-px bg-ink/20" />
          <div className="home-hero-actions flex flex-wrap gap-3">
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
      <div className="home-hero-footer absolute bottom-5 left-6 right-6 z-10 flex flex-col gap-4 text-cream md:left-auto md:right-7 md:w-[24rem]">
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
    <section className="red-band-motion relative overflow-hidden bg-brand-red px-6 py-10 text-center">
      <div className="mx-auto max-w-[980px]">
        <svg viewBox="0 0 500 80" className="red-band-curve mx-auto mb-2 block w-[280px]" aria-hidden="true">
          <path id="yum-curve" d="M 60,70 Q 250,10 440,70" fill="none" />
          <text className="fill-cream/70 font-sans text-[14px]">
            <textPath href="#yum-curve" startOffset="50%" textAnchor="middle">
              kitchen and bakery
            </textPath>
          </text>
        </svg>
        <h2 className="font-serif text-[2rem] font-normal leading-[1.3] lowercase text-white">
          serving great food for now or for later
        </h2>
        <p className="mt-2 font-serif text-[1.4rem] leading-snug text-white">preparing the best food of each season</p>
        <p className="mt-1 font-serif text-[1.4rem] leading-snug text-white">loving what we do and how we do it</p>
        <div className="mx-auto my-6 h-px max-w-[200px] bg-white/40" />
        <Link href="/menu" prefetch={false} className="inline-block border-2 border-white px-6 py-3 text-lg font-bold leading-none text-white transition hover:bg-white hover:text-ink">
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
    <section className="bg-page px-6 py-section">
      <div className="mx-auto grid max-w-[980px] items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-serif text-[2.1rem] font-normal leading-tight lowercase text-ink">
            welcome back your favorites or discover new eats on our menu
          </h2>
          <Link href="/menu" prefetch={false} className="btn-primary mt-7">
            See What&apos;s New
          </Link>
        </div>
        <div>
          <div className="menu-feature-frame relative aspect-[4/3] bg-white">
            <Image
              key={item.image}
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="menu-feature-photo object-cover"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {menuFeatureItems.map((menuItem, index) => (
              <button
                key={menuItem.name}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-label={`Show ${menuItem.name}`}
                className={`border px-3 py-1.5 text-sm leading-none transition ${
                  index === active ? 'border-brand-red bg-brand-red text-white' : 'border-body bg-transparent text-body hover:border-ink hover:text-ink'
                }`}
              >
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
    <section className="relative min-h-[420px] overflow-hidden bg-ink">
      <Image
        src="/images/yum-catering-veggie-platters.jpg"
        alt="yum! catering sandwich and veggie platters"
        fill
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="container-content relative z-10 flex min-h-[420px] items-center py-14">
        <div className="max-w-[460px] bg-cream/90 px-8 py-8 md:px-10">
          <h2 className="font-serif text-[2.2rem] font-normal leading-tight lowercase text-ink">yum! catering</h2>
          <div className="my-4 h-px bg-ink/20" />
          <p className="text-lg leading-8 text-body">
            Sandwich platters, box lunches, salads, baked goods, and more available for pick up with 24 hour notice. Call with questions.
          </p>
          <div className="my-4 h-px bg-ink/20" />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={() => setCallOpen(true)}>
              Call Us
            </button>
            <Link href="/order-a-cake" className="btn-primary">
              yum! wedding cakes
            </Link>
          </div>
        </div>
      </div>
      <LocationPickerModal open={callOpen} onClose={closeCall} mode="call" />
    </section>
  );
}
