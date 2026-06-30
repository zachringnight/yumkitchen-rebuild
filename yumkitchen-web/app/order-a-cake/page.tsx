import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { PatticakeOriginBand } from '@/components/PatticakeOriginBand';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.cake.title,
  description: pageMeta.cake.description,
  alternates: { canonical: '/order-a-cake' },
  openGraph: { images: [pageMeta.cake.image] },
};

const proofPoints = [
  {
    title: "patti's original recipe",
    copy: 'devil\'s food cake, vanilla buttercream, baked by the yum! team',
  },
  {
    title: 'made fresh to order',
    copy: 'built around your date, pickup location, message, and celebration',
  },
  {
    title: 'local pickup or delivery help',
    copy: 'start local cake pickup here or use the national delivery page',
  },
  {
    title: 'made for real moments',
    copy: 'birthdays, thank-yous, weddings, office days, and family tables',
  },
] as const;

const cakePaths = [
  {
    title: 'local pickup',
    description: 'Order a fresh Patticake from the bakery team and choose the yum! location that works for pickup.',
    image: '/images/yum-patticake-layer-closeup.jpeg',
    alt: 'yum! patticake chocolate cake layers close up',
    href: '#cake-inquiry',
    action: 'Start Pickup Request',
  },
  {
    title: 'national delivery',
    description: 'Use the dedicated Patticake delivery page for ship-to details, timing questions, and gift notes.',
    image: '/images/yum-patticake-share-slices.jpeg',
    alt: 'yum! patticake slices on plates',
    href: '/patticake',
    action: 'Ship a Patticake',
  },
  {
    title: 'celebrations',
    description: 'Plan a birthday, thank-you, wedding, office treat, or just-because cake with the message on top.',
    image: '/images/yum-patticake-just-married.jpeg',
    alt: 'yum! patticake with Just Married message',
    href: '#cake-inquiry',
    action: 'Plan a Celebration',
  },
] as const;

const orderSteps = [
  {
    number: '1',
    title: 'choose the path',
    description: 'Start with local pickup, national delivery, or a celebration request.',
  },
  {
    number: '2',
    title: 'add the message',
    description: 'Share the date, size, pickup location, recipient, and words for the cake.',
  },
  {
    number: '3',
    title: 'we bake fresh',
    description: 'The bakery team finishes the Patticake close to the celebration date.',
  },
  {
    number: '4',
    title: 'serve it happy',
    description: 'Pick it up, send it out, or bring it to the table ready to share.',
  },
] as const;

const celebrationPhotos = [
  {
    src: '/images/yum-patticake-wedding-detail.jpeg',
    alt: 'yum! floral wedding patticake detail',
  },
  {
    src: '/images/yum-patticake-top-view.jpeg',
    alt: 'yum! patticake vanilla buttercream top view',
  },
  {
    src: '/images/yum-patticake-tier.jpg',
    alt: 'yum! tiered wedding patticake',
  },
] as const;

const gallery = [
  { src: '/images/yum-patticake-layer-closeup.jpeg', alt: 'yum! patticake chocolate cake layers close up' },
  { src: '/images/yum-patticake-share-slices.jpeg', alt: 'yum! patticake slices on plates' },
  { src: '/images/yum-patticake-top-view.jpeg', alt: 'yum! patticake top with vanilla buttercream' },
  { src: '/images/yum-patticake-just-married.jpeg', alt: 'yum! patticake with Just Married message' },
] as const;

export default function CakePage() {
  return (
    <main className="bg-page">
      <section className="overflow-hidden bg-cream px-6 py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-[580px]">
            <h1 className="font-serif text-[clamp(4rem,8vw,7.5rem)] font-normal leading-[0.88] lowercase text-ink">
              the original
              <br />
              <span className="text-brand-primary">patticake</span>
            </h1>
            <p className="mt-7 max-w-[500px] text-xl leading-8 text-ink">
              Devil&apos;s food chocolate cake layered with vanilla buttercream. Patti&apos;s recipe, baked fresh for birthdays, thank-yous, weddings, and every table worth celebrating.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#cake-inquiry" className="btn-primary">
                Order a Patticake
              </a>
              <Link href="/patticake" className="btn-secondary">
                National Delivery
              </Link>
            </div>
            <div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2">
              <HeroNote title="pickup" copy="four yum! kitchens, 8am to 8pm daily" />
              <HeroNote title="delivery" copy="a dedicated national order path" />
            </div>
          </div>

          <div className="patticake-hero-card motion-role-entrance">
            <Image
              src="/images/yum-patticake-layer-closeup.jpeg"
              alt="yum! patticake chocolate cake layers close up"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute left-4 top-4 bg-brand-red px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white md:left-6 md:top-6">
              patti&apos;s recipe
            </div>
            <div className="absolute bottom-4 left-4 right-4 grid gap-3 bg-cream/95 p-4 shadow-xl md:bottom-6 md:left-6 md:right-6 md:grid-cols-[1fr_auto] md:items-end md:p-5">
              <div>
                <p className="font-serif text-2xl leading-tight text-ink">chocolate layers, vanilla buttercream</p>
                <p className="mt-1 text-base leading-6 text-body">the cake people ask for by name</p>
              </div>
              <a href="#shop-patticake" className="btn-secondary bg-white px-4 py-3 text-base">
                Choose a Path
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-page px-6 py-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="patticake-ticket">
            <div className="patticake-ticket-stub">
              yum! kitchen
              <br />
              and bakery
            </div>
            <div>
              <h2 className="font-serif text-[2.7rem] font-normal leading-tight lowercase text-brand-primary">born at yum! kitchen. made to share.</h2>
              <p className="mt-4 max-w-[560px] text-lg leading-8 text-ink">
                Patticake keeps the bakery story simple: familiar ingredients, a generous chocolate cake, and care from the team that knows the recipe.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {proofPoints.map((point) => (
                <article key={point.title} className="border-t border-ink/15 pt-4">
                  <h3 className="font-serif text-2xl font-normal lowercase text-ink">{point.title}</h3>
                  <p className="mt-2 text-base leading-7 text-body">{point.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="shop-patticake" className="bg-cream px-6 py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-end gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-label">shop patticake</p>
              <h2 className="text-h2 lowercase">one cake, three clear paths</h2>
            </div>
            <p className="max-w-2xl text-xl leading-9 text-ink">
              Choose local pickup, national delivery, or celebration planning, then send the bakery team the details that matter.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {cakePaths.map((path) => (
              <article key={path.title} className="patticake-action-card group">
                <div className="relative aspect-[5/4] overflow-hidden bg-blue-soft">
                  <Image src={path.image} alt={path.alt} fill loading="eager" sizes="(min-width: 768px) 33vw, 100vw" className="image-lift object-cover transition duration-500" />
                </div>
                <div className="grid flex-1 p-6">
                  <h3 className="font-serif text-3xl font-normal lowercase text-ink">{path.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-body">{path.description}</p>
                  <a href={path.href} className="btn-primary mt-6 self-end">
                    {path.action}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="bg-white px-6 py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="section-label">how ordering works</p>
              <h2 className="text-h2 lowercase">from message to table, clearly</h2>
              <p className="mt-5 text-xl leading-9 text-body">
                Start with the way the cake needs to travel, then add the date, message, size, and pickup or delivery details.
              </p>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden bg-blue-soft">
              <Image src="/images/yum-patticake-share-slices.jpeg" alt="yum! patticake slices ready to share" fill loading="eager" sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="mt-11 grid gap-5 md:grid-cols-4">
            {orderSteps.map((step) => (
              <article key={step.number} className="border-t-2 border-brand-primary pt-5">
                <p className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-tint font-serif text-xl text-ink">{step.number}</p>
                <h3 className="mt-5 font-serif text-2xl font-normal lowercase text-ink">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-body">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-section">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="section-label">for the big day</p>
            <h2 className="font-serif text-[2.875rem] font-normal leading-tight lowercase text-ink">
              bakery <span className="text-brand-primary">celebrations</span>
              <br />
              with a real cake at the center.
            </h2>
            <p className="mt-5 text-xl leading-9 text-body">
              Wedding tables, milestone parties, and family celebrations can all start with the original chocolate cake Patti made famous.
            </p>
            <a href="#cake-inquiry" className="btn-primary mt-8">
              Plan a Cake
            </a>
          </div>
          <div className="grid grid-cols-[1.18fr_1fr] gap-4">
            <div className="relative row-span-2 aspect-[3/4] overflow-hidden bg-blue-soft">
              <Image src={celebrationPhotos[0].src} alt={celebrationPhotos[0].alt} fill loading="eager" sizes="(min-width: 1024px) 32vw, 58vw" className="object-cover" />
            </div>
            {celebrationPhotos.slice(1).map((photo, index) => (
              <div key={`${photo.alt}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-blue-soft">
                <Image src={photo.src} alt={photo.alt} fill loading="eager" sizes="(min-width: 1024px) 22vw, 42vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PatticakeOriginBand />

      <section className="bg-white px-6 py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="section-label">patticake gallery</p>
              <h2 className="text-h2 lowercase">made for every celebration</h2>
            </div>
            <a href="#cake-inquiry" className="btn-link">
              Start a cake request
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {gallery.map((image, index) => (
              <div key={`${image.alt}-${index}`} className={`relative overflow-hidden bg-page ${index === 1 ? 'aspect-[4/5]' : 'aspect-square'}`}>
                <Image src={image.src} alt={image.alt} fill loading="eager" sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cake-inquiry" className="bg-blue-tint px-6 py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="section-label">start your cake</p>
            <h2 className="text-h2 lowercase">have a question or special request?</h2>
            <p className="mt-5 text-xl leading-9 text-ink">
              Share the date, pickup location, servings, message on top, and any delivery questions. The bakery team can route the request from there.
            </p>
            <div className="mt-7 border border-brand-primary/30 bg-cream p-5">
              <p className="font-serif text-2xl font-normal lowercase text-ink">sending Patticake outside the Twin Cities?</p>
              <Link href="/patticake" className="btn-link mt-3 inline-block">
                Use the national delivery page
              </Link>
            </div>
          </div>
          <InquiryForm
            kind="cake"
            defaultSubject="Patticake order"
            eventDateLabel="Date of event"
            guestsLabel="Servings or size"
            locationLabel="Pickup location"
            messageLabel="Cake details, message on top, and celebration notes"
            submitLabel="Send Cake Request"
          />
        </div>
      </section>

      <section className="bg-brand-red px-6 py-section text-white">
        <div className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto_auto] md:items-center md:text-left">
          <h2 className="font-serif text-[3rem] font-normal leading-tight lowercase text-white">ready to make someone&apos;s day?</h2>
          <a href="#cake-inquiry" className="inline-block bg-white px-8 py-4 text-lg font-bold leading-none text-brand-primary transition hover:bg-blue-tint hover:text-ink">
            Order a Patticake
          </a>
          <Link href="/patticake" className="inline-block border-2 border-white px-8 py-4 text-lg font-bold leading-none text-white transition hover:bg-white hover:text-brand-primary">
            National Delivery
          </Link>
        </div>
      </section>
    </main>
  );
}

function HeroNote({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="border-t border-ink/15 pt-4">
      <p className="font-serif text-2xl font-normal lowercase text-ink">{title}</p>
      <p className="mt-1 text-base leading-6 text-body">{copy}</p>
    </div>
  );
}
