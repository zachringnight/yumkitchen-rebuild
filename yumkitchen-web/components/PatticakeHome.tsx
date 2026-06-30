import Image from 'next/image';
import Link from 'next/link';
import { PatticakeOriginBand } from './PatticakeOriginBand';
import { PatticakeMessageRibbon } from './PatticakeMessageRibbon';
import { patticakeNationalOrderUrl } from '@/lib/site';

const heroFrames = [
  {
    src: '/images/patticake/layers_slice_vertical.jpg',
    alt: 'yum! patticake chocolate cake layers close up',
    label: 'devil’s food layers',
    className: 'crop-patticake-vertical-layer',
  },
  {
    src: '/images/patticake/03_top_view.jpg',
    alt: 'yum! patticake vanilla buttercream top view',
    label: 'vanilla buttercream',
    className: 'crop-patticake-top',
  },
  {
    src: '/images/patticake/09_slices.jpg',
    alt: 'yum! patticake slices on plates',
    label: 'ready to share',
    className: 'crop-patticake-slices',
  },
] as const;

const moments = [
  {
    title: 'ship it',
    copy: 'national delivery for birthdays, thank-yous, office celebrations, and long-distance family tables.',
    href: '/patticake#national-order',
    action: 'Order National Delivery',
    image: '/images/patticake/gift_box_vertical.jpg',
    alt: 'yum! bakery gift box with red ribbon',
    className: 'crop-patticake-gift-box',
  },
  {
    title: 'pick it up',
    copy: 'local pickup from yum! Kitchen and Bakery when the cake is staying in the Twin Cities.',
    href: '/order-a-cake#cake-inquiry',
    action: 'Start Local Pickup',
    image: '/images/patticake/layers_slice_vertical.jpg',
    alt: 'yum! patticake chocolate cake layers close up',
    className: 'crop-patticake-vertical-layer',
  },
  {
    title: 'meet the kitchen',
    copy: 'Patticake comes from the same scratch bakery team behind four yum! neighborhood restaurants.',
    href: '/yum-kitchen',
    action: 'Visit yum! Kitchen',
    image: '/images/patticake/01_cover.jpg',
    alt: 'Patti and Kelli at yum! Kitchen and Bakery',
    className: 'crop-patticake-cover',
  },
] as const;

const proof = ['Patticake', 'devil’s food chocolate cake', 'vanilla buttercream', 'made by yum! Kitchen and Bakery'] as const;

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export function PatticakeHome() {
  return (
    <main className="bg-page">
      <section className="patticake-home-hero overflow-hidden bg-cream px-6 py-[clamp(3.25rem,7vw,7rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="max-w-[570px]">
            <p className="section-label">yum! Kitchen and Bakery presents</p>
            <h1 className="font-serif text-[clamp(4rem,8vw,7.4rem)] font-normal leading-[0.9] lowercase text-ink">
              patticake
            </h1>
            <p className="mt-7 max-w-[520px] text-xl leading-9 text-ink">
              Patticake is devil&apos;s food layers, vanilla buttercream, and a message made for the table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={patticakeNationalOrderUrl}
                target={nationalOrderIsExternal ? '_blank' : undefined}
                rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                className="btn-primary"
                data-event="click_patticake_national_delivery_order"
                data-source="patticake_home_hero"
              >
                Order National Delivery
              </a>
              <Link href="/order-a-cake#cake-inquiry" className="btn-secondary">
                Local Pickup
              </Link>
              <Link href="/yum-kitchen" className="btn-secondary">
                yum! Kitchen
              </Link>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {proof.map((item) => (
                <div key={item} className="border-t border-ink/15 pt-3">
                  <p className="text-base font-bold leading-6 text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="patticake-remotion-board motion-role-ambient" aria-label="Patticake animated product story">
            <div className="patticake-floating-messages" aria-hidden="true">
              <span>happy birthday</span>
              <span>thank you</span>
              <span>just because</span>
            </div>
            <div className="patticake-remotion-title">
              <span>one cake</span>
              <span>three ways to share it</span>
            </div>
            {heroFrames.map((frame, index) => (
              <figure key={frame.src} className={`patticake-remotion-frame patticake-remotion-frame-${index + 1}`}>
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 30vw, 82vw"
                  className={`object-cover ${frame.className}`}
                />
                <figcaption>{frame.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <PatticakeMessageRibbon tone="blue" />

      <section className="bg-white px-6 py-12 lg:py-section" data-reveal>
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-end gap-7 lg:grid-cols-[0.68fr_1.32fr]">
            <div>
              <p className="section-label">pick your cake moment</p>
              <h2 className="text-h2 lowercase">ship it, pick it up, or visit the kitchen</h2>
            </div>
            <p className="max-w-2xl text-xl leading-9 text-body">
              Patticake comes first. The yum! kitchens are right here for breakfast, lunch, dinner, catering, and local pickup.
            </p>
          </div>

          <div className="stagger-reveal mt-10 grid gap-5 md:grid-cols-3">
            {moments.map((moment) => (
              <article key={moment.title} className="patticake-action-card group">
                <div className="relative aspect-[4/5] overflow-hidden bg-blue-soft">
                  <Image
                    src={moment.image}
                    alt={moment.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`image-lift object-cover transition duration-500 ${moment.className}`}
                  />
                </div>
                <div className="grid flex-1 p-6">
                  <h3 className="font-serif text-3xl font-normal lowercase text-ink">{moment.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-body">{moment.copy}</p>
                  <Link href={moment.href} className="btn-primary mt-6 self-end">
                    {moment.action}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-tint px-6 py-12 lg:py-section" data-reveal>
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="section-label text-ink">what you get</p>
            <h2 className="text-h2 lowercase">a real bakery cake, not a generic shipped dessert</h2>
            <p className="mt-5 max-w-xl text-xl leading-9 text-ink">
              Patticake keeps things simple and happy: chocolate cake, vanilla buttercream, made fresh, with the yum! bakery behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/patticake" className="btn-primary">
                National Delivery Details
              </Link>
              <Link href="/order-a-cake" className="btn-secondary">
                Local Cake Pickup
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream shadow-xl">
              <Image
                src="/images/patticake/08_tier_wedding_d.jpg"
                alt="yum! floral wedding patticake detail"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover crop-patticake-wedding"
              />
            </div>
            <div className="grid gap-4">
              <div className="relative min-h-[240px] overflow-hidden bg-cream shadow-lg">
                <Image
                  src="/images/patticake/03_top_view.jpg"
                  alt="yum! patticake vanilla buttercream top view"
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover crop-patticake-top"
                />
              </div>
              <div className="bg-white p-6 shadow-lg">
                <p className="font-serif text-4xl font-normal lowercase leading-none text-brand-primary">patticake</p>
                <p className="mt-3 text-lg leading-8 text-body">made at yum!, shared as the cake people ask for by name.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PatticakeOriginBand />
    </main>
  );
}
