import Image from 'next/image';
import Link from 'next/link';
import { patticakeNationalOrderUrl } from '@/lib/site';
import { ParallaxImage } from './motion/ParallaxImage';
import { PressButton } from './motion/PressButton';
import { Reveal } from './motion/Reveal';
import { Stagger, StaggerItem } from './motion/Stagger';
import { PatticakeConciergeBand } from './PatticakeConciergeBand';
import { PatticakeHeroPeek } from './PatticakeHeroPeek';
import { PatticakeOriginBand } from './PatticakeOriginBand';
import { PatticakeMessageRibbon } from './PatticakeMessageRibbon';

// Photos run without visible captions. Alt text stays descriptive; any label
// beyond that would be a food claim yumkitchen.com does not make.
const heroFrames = [
  {
    src: '/images/patticake/layers_slice_vertical.jpg',
    alt: 'yum! patticake chocolate cake layers close up',
    className: 'crop-patticake-vertical-layer',
    sizes: '(min-width: 1024px) 30vw, (min-width: 768px) 44vw, 46vw',
  },
  {
    src: '/images/patticake/03_top_view.jpg',
    alt: 'yum! patticake vanilla buttercream top view',
    className: 'crop-patticake-top',
    sizes: '(min-width: 1024px) 29vw, (min-width: 768px) 42vw, 38vw',
  },
  {
    src: '/images/patticake/09_slices.jpg',
    alt: 'yum! patticake slices on plates',
    className: 'crop-patticake-slices',
    sizes: '(min-width: 1024px) 38vw, (min-width: 768px) 54vw, 68vw',
  },
] as const;

// Wording tracks lib/patticake/catalog.ts, which is the confirmed product copy.
const proof = ['made from scratch since 2005', 'triple-layer chocolate cake', 'vanilla buttercream', 'made by yum! Kitchen and Bakery'] as const;

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export function PatticakeHome() {
  return (
    <main className="bg-blue-tint">
      <section className="patticake-home-hero overflow-hidden bg-blue-tint px-6 py-[clamp(3.25rem,7vw,7rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="max-w-[570px]">
            <Reveal as="p" className="section-label" y={10}>now available nationwide · made by yum!</Reveal>
            <Reveal as="h1" className="font-serif text-[clamp(4rem,8vw,7.4rem)] font-normal leading-[0.9] lowercase text-brand-primary" fade={false} y={14} delay={0.05}>
              patticake
            </Reveal>
            <PatticakeHeroPeek
              src="/images/patticake/09_slices_mobile_lcp.webp"
              alt="yum! patticake slices on plates"
              className="crop-patticake-slices"
              unoptimized
            />
            <Reveal as="p" className="mt-7 max-w-[520px] text-xl leading-9 text-ink" delay={0.12} y={16}>
              Ship yum!&apos;s triple-layer chocolate cake, vanilla buttercream, and a message made for the table anywhere nationwide.
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap gap-3" delay={0.18} y={14}>
              <PressButton>
                <a
                  href={patticakeNationalOrderUrl}
                  target={nationalOrderIsExternal ? '_blank' : undefined}
                  rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className="btn-primary"
                  data-event="click_patticake_national_delivery_order"
                  data-source="patticake_home_hero"
                >
                  Ship a Cake
                </a>
              </PressButton>
              <PressButton>
                <Link href="/order-a-cake#cake-inquiry" className="btn-secondary">
                  Pick Up Locally
                </Link>
              </PressButton>
            </Reveal>
            <Stagger className="mt-9 grid gap-3 sm:grid-cols-2" gap={0.06}>
              {proof.map((item) => (
                <StaggerItem key={item} className="border-t border-brand-red/30 pt-3">
                  <p className="text-base font-bold leading-6 text-ink">{item}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="patticake-photo-grid" role="group" aria-label="Patticake cake photography">
            {heroFrames.map((frame, index) => (
              <Reveal as="figure" key={frame.src} className={`patticake-photo-grid-frame patticake-photo-grid-frame-${index + 1}`} y={12} delay={0.15 + index * 0.12}>
                <div className="patticake-photo-grid-image">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    quality={60}
                    sizes={frame.sizes}
                    loading="eager"
                    className={`object-cover ${frame.className}`}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PatticakeMessageRibbon tone="blue" />

      <Reveal as="section" className="bg-white px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden border-y border-brand-primary/25 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[420px] bg-blue-soft lg:min-h-[620px]">
            <Image
              src="/images/patticake/gift_box_vertical.jpg"
              alt="bright baby-blue yum! bakery gift box with red ribbon"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover crop-patticake-gift-box"
            />
          </div>
          <div className="flex flex-col bg-blue-tint p-[clamp(2rem,5vw,4.75rem)]">
            <div>
              <p className="section-label text-ink">nationwide gifting</p>
              <h2 className="mt-3 font-serif text-[clamp(3.25rem,6vw,5.75rem)] font-normal leading-[0.92] lowercase text-brand-primary">
                send cake,
                <br />
                not a card.
              </h2>
              <p className="mt-6 max-w-xl text-xl leading-9 text-ink">
                A fresh bakery cake, a personal note, and a bright baby-blue box, now available nationwide.
              </p>
              <PressButton className="mt-8">
                <a
                  href={patticakeNationalOrderUrl}
                  target={nationalOrderIsExternal ? '_blank' : undefined}
                  rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className="btn-primary"
                  data-event="click_patticake_national_delivery_order"
                  data-source="patticake_home_nationwide_feature"
                >
                  Ship a Patticake
                </a>
              </PressButton>
            </div>
            <div className="mt-10 grid border-t border-brand-primary/30 sm:mt-auto sm:grid-cols-2">
              <Link href="/order-a-cake#cake-inquiry" className="group py-5 sm:pr-6">
                <span className="block text-sm font-bold uppercase tracking-[0.14em] text-ink">staying nearby?</span>
                <span className="mt-2 block font-serif text-2xl lowercase text-brand-primary group-hover:underline">pick up at yum!</span>
              </Link>
              <Link href="/yum-kitchen" className="group border-t border-brand-primary/30 py-5 sm:border-l sm:border-t-0 sm:pl-6">
                <span className="block text-sm font-bold uppercase tracking-[0.14em] text-ink">meet the bakery</span>
                <span className="mt-2 block font-serif text-2xl lowercase text-brand-primary group-hover:underline">visit yum! Kitchen</span>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <PatticakeConciergeBand />

      <Reveal as="section" className="bg-blue-tint px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="section-label text-ink">what you get</p>
            <h2 className="text-h2 lowercase">a real scratch bakery cake, shipped to your door</h2>
            <p className="mt-5 max-w-xl text-xl leading-9 text-ink">
              Patticake keeps things simple and happy: chocolate cake, vanilla buttercream, made fresh, with the yum! bakery behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PressButton>
                <Link href="/patticake" className="btn-primary">
                  Shipping Details
                </Link>
              </PressButton>
              <PressButton>
                <Link href="/order-a-cake" className="btn-secondary">
                  Pick Up Locally
                </Link>
              </PressButton>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
            <ParallaxImage className="relative aspect-[4/5] bg-cream shadow-xl">
              <Image
                src="/images/patticake/02_tier_wedding_a.jpg"
                alt="yum! floral wedding patticake detail"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover crop-patticake-wedding"
              />
            </ParallaxImage>
            <div className="grid gap-4">
              <div className="relative min-h-[240px] overflow-hidden bg-cream shadow-lg">
                <Image
                  src="/images/patticake/03_top_view.jpg"
                  alt="yum! patticake vanilla buttercream top view"
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover crop-patticake-top"
                />
              </div>
              <div className="bg-white p-6 shadow-lg">
                <p className="font-serif text-4xl font-normal lowercase leading-none text-brand-primary">patticake</p>
                <p className="mt-3 text-lg leading-8 text-body">made at yum!, shared as the cake people ask for by name.</p>
                <Link href="/order-a-cake#message-maker" className="btn-link mt-4 inline-block">
                  try the message maker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <PatticakeOriginBand />
    </main>
  );
}
