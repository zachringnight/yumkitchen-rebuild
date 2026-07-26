import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CakeGallery } from '@/components/CakeGallery';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { PressButton } from '@/components/motion/PressButton';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { PatticakeHeroPeek } from '@/components/PatticakeHeroPeek';
import { PatticakeMessagePreview } from '@/components/PatticakeMessagePreview';
import { PatticakeMessageRibbon } from '@/components/PatticakeMessageRibbon';
import { PatticakeProcessSteps } from '@/components/PatticakeProcessSteps';
import { pageMeta, patticakeCanonical, patticakeNationalOrderUrl, patticakeOpenGraph, patticakeTitle } from '@/lib/site';

export const metadata: Metadata = {
  title: patticakeTitle(pageMeta.cake.title),
  description: pageMeta.cake.description,
  alternates: { canonical: patticakeCanonical('/order-a-cake') },
  openGraph: patticakeOpenGraph(pageMeta.cake.image),
  twitter: { images: [pageMeta.cake.image] },
};

const proofPoints = [
  {
    title: 'Patticake',
    copy: 'triple-layer chocolate cake, vanilla buttercream, baked by the yum! team',
  },
  {
    title: 'made fresh to order',
    copy: 'baked close to your date with the message you want on top',
  },
  {
    title: 'available nationwide',
    copy: 'send Patticake beyond the Twin Cities or pick it up at yum!',
  },
  {
    title: 'made for real moments',
    copy: 'birthdays, thank-yous, weddings, office days, and family tables',
  },
] as const;

const celebrationPhotos = [
  {
    src: '/images/patticake/02_tier_wedding_a.jpg',
    alt: 'yum! floral wedding patticake detail',
  },
  {
    src: '/images/patticake/03_top_view.jpg',
    alt: 'yum! patticake vanilla buttercream top view',
  },
  {
    src: '/images/patticake/05_tier_wedding_c.jpg',
    alt: 'yum! tiered wedding patticake',
  },
] as const;

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export default function CakePage() {
  return (
    <main className="bg-cream">
      <section className="overflow-hidden bg-cream px-6 py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-[580px]">
            <Reveal fade={false} y={14}>
              <h1 className="font-serif text-[clamp(4rem,8vw,7.5rem)] font-normal leading-[0.88] lowercase text-ink" aria-label="order a patticake">
                order a{' '}
                <br />
                <span className="text-brand-primary">patticake</span>
              </h1>
            </Reveal>
            <PatticakeHeroPeek
              src="/images/patticake/layers_slice_vertical.jpg"
              alt="yum! patticake chocolate cake layers close up"
              className="crop-patticake-vertical-layer"
            />
            <Reveal as="p" className="mt-7 max-w-[500px] text-xl leading-8 text-ink" delay={0.1} y={16}>
              Patticake is triple-layer chocolate cake with vanilla buttercream, baked fresh for birthdays, thank-yous, weddings, and every table worth celebrating.
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap items-center gap-3" delay={0.16} y={14}>
              <PressButton>
                <a
                  href={patticakeNationalOrderUrl}
                  target={nationalOrderIsExternal ? '_blank' : undefined}
                  rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className="btn-primary"
                >
                  Ship Nationwide
                </a>
              </PressButton>
              <PressButton>
                <a href="#cake-inquiry" className="btn-secondary">
                  Pick Up Locally
                </a>
              </PressButton>
            </Reveal>
            <Stagger className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2" gap={0.08}>
              <StaggerItem><HeroNote title="pickup" copy="four yum! restaurants, 8am to 8pm daily" /></StaggerItem>
              <StaggerItem><HeroNote title="shipping" copy="we help with timing and delivery" /></StaggerItem>
            </Stagger>
          </div>

          <div className="patticake-hero-card motion-role-entrance">
            <Image
              src="/images/patticake/layers_slice_vertical.jpg"
              alt="yum! patticake chocolate cake layers close up"
              fill
              loading="eager"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover crop-patticake-vertical-layer"
            />
          </div>
        </div>
      </section>

      <PatticakeMessageRibbon tone="cream" />

      <section className="bg-cream px-6 py-8">
        <div className="mx-auto max-w-[1240px]">
          <Stagger className="patticake-process-panel" gap={0.12}>
            <StaggerItem className="patticake-process-eyebrow">
              <p>made at yum!</p>
            </StaggerItem>
            <StaggerItem>
              <h2 className="font-serif text-[2.7rem] font-normal leading-tight lowercase text-brand-primary">
                born at <span className="normal-case">yum! Kitchen and Bakery</span>. made to share.
              </h2>
              <p className="mt-4 max-w-[560px] text-lg leading-8 text-ink">
                Patticake keeps the bakery story simple: familiar ingredients, a generous chocolate cake, and care from the team that knows this cake by heart.
              </p>
            </StaggerItem>
            <div className="grid gap-5 sm:grid-cols-2">
              {proofPoints.map((point) => (
                <StaggerItem as="article" key={point.title} className="border-t border-ink/15 pt-4">
                  <h3 className="font-serif text-2xl font-normal lowercase text-ink">{point.title}</h3>
                  <p className="mt-2 text-base leading-7 text-body">{point.copy}</p>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      <section id="shop-patticake" className="scroll-mt-24 bg-cream px-6 py-section md:scroll-mt-28">
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
                send patticake
                <br />
                farther.
              </h2>
              <p className="mt-6 max-w-xl text-xl leading-9 text-ink">
                When the celebration is outside the Twin Cities, the same Patticake ships nationwide. Order online with a delivery date and gift message, and we pack it to travel.
              </p>
              <PressButton className="mt-8">
                <a
                  href={patticakeNationalOrderUrl}
                  target={nationalOrderIsExternal ? '_blank' : undefined}
                  rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className="btn-primary"
                >
                  Ship a Patticake
                </a>
              </PressButton>
            </div>
            <div className="mt-10 grid border-t border-brand-primary/30 sm:mt-auto sm:grid-cols-2">
              <a href="#cake-inquiry" className="group py-5 sm:pr-6">
                <span className="block text-sm font-bold uppercase tracking-[0.14em] text-ink">staying nearby?</span>
                <span className="mt-2 block font-serif text-2xl lowercase text-brand-primary group-hover:underline">start your pickup note</span>
              </a>
              <a href="#celebrations" className="group border-t border-brand-primary/30 py-5 sm:border-l sm:border-t-0 sm:pl-6">
                <span className="block text-sm font-bold uppercase tracking-[0.14em] text-ink">planning a bigger table?</span>
                <span className="mt-2 block font-serif text-2xl lowercase text-brand-primary group-hover:underline">plan a celebration</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <PatticakeProcessSteps tone="white" />

      <PatticakeMessagePreview />

      <section id="celebrations" className="scroll-mt-24 bg-cream px-6 py-section md:scroll-mt-28">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="section-label">for the big day</p>
            <h2 className="font-serif text-[2.875rem] font-normal leading-tight lowercase text-ink">
              bakery <span className="text-brand-primary">celebrations</span>
              <br />
              with a real cake at the center.
            </h2>
            <p className="mt-5 text-xl leading-9 text-body">
              Wedding tables, milestone parties, and family celebrations can all start with Patticake.
            </p>
            <PressButton className="mt-8">
              <a href="#cake-inquiry" className="btn-primary">
                Plan a Cake
              </a>
            </PressButton>
          </div>
          <div className="grid grid-cols-[1.18fr_1fr] gap-4">
            <ParallaxImage className="relative row-span-2 aspect-[3/4] bg-blue-soft">
              <Image src={celebrationPhotos[0].src} alt={celebrationPhotos[0].alt} fill sizes="(min-width: 1024px) 32vw, 58vw" className="object-cover crop-patticake-wedding" />
            </ParallaxImage>
            {celebrationPhotos.slice(1).map((photo, index) => (
              <div key={`${photo.alt}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-blue-soft">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 22vw, 42vw" className="object-cover crop-patticake-product" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CakeGallery />

      <section id="cake-inquiry" className="scroll-mt-24 bg-blue-tint px-6 py-section md:scroll-mt-28">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <p className="section-label">start your cake</p>
            <h2 className="text-h2 lowercase">start your pickup note</h2>
            <p className="mt-5 text-xl leading-9 text-ink">
              Share the pickup restaurant, date, servings, and message on top. Someone from yum! will reply with the next sweet step.
            </p>
            <div className="mt-7 border border-brand-primary/30 bg-cream p-5">
              <p className="font-serif text-2xl font-normal lowercase text-ink">sending Patticake outside the Twin Cities?</p>
              <Link href="/patticake" className="btn-link mt-3 inline-block">
                Start a Shipping Note
              </Link>
            </div>
          </Reveal>
          <InquiryForm
            kind="cake"
            cakeMode="pickup"
            defaultSubject="Patticake pickup note"
            eventDateLabel="Pickup date"
            guestsLabel="Servings or size"
            locationLabel="Pickup restaurant"
            hideSubject
            messageLabel="Cake notes, message on top, and celebration plans"
            submitLabel="Send Pickup Note"
            successMessage="We got it. Someone from yum! will reply with the next sweet step."
          />
        </div>
      </section>

      <section className="bg-brand-red px-6 py-section text-white">
        <Reveal className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto_auto] md:items-center md:text-left">
          <h2 className="font-serif text-[3rem] font-normal leading-tight lowercase text-white">ready to make someone&apos;s day?</h2>
          <PressButton>
            <a href="#cake-inquiry" className="inline-block bg-white px-8 py-4 text-lg font-bold leading-none text-brand-primary transition hover:bg-blue-tint hover:text-ink">
              Pick Up Locally
            </a>
          </PressButton>
          <PressButton>
            <Link href="/patticake" className="inline-block border-2 border-white px-8 py-4 text-lg font-bold leading-none text-white transition hover:bg-white hover:text-brand-primary">
              Ship a Cake
            </Link>
          </PressButton>
        </Reveal>
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
