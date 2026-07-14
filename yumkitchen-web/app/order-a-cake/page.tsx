import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CakeGallery } from '@/components/CakeGallery';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { PressButton } from '@/components/motion/PressButton';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { TapeTag } from '@/components/motion/TapeTag';
import { PatticakeHeroPeek } from '@/components/PatticakeHeroPeek';
import { PatticakeMessagePreview } from '@/components/PatticakeMessagePreview';
import { PatticakeMessageRibbon } from '@/components/PatticakeMessageRibbon';
import { PatticakeOriginBand } from '@/components/PatticakeOriginBand';
import { PatticakePathGuide } from '@/components/PatticakePathGuide';
import { pageMeta, patticakeCanonical, patticakeOpenGraph, patticakeTitle } from '@/lib/site';

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
    copy: 'devil\'s food cake, vanilla buttercream, baked by the yum! team',
  },
  {
    title: 'made fresh to order',
    copy: 'baked close to your date with the message you want on top',
  },
  {
    title: 'pickup or delivery',
    copy: 'pick up at yum! or send Patticake beyond the Twin Cities',
  },
  {
    title: 'made for real moments',
    copy: 'birthdays, thank-yous, weddings, office days, and family tables',
  },
] as const;

const cakePaths = [
  {
    title: 'Pick Up Locally',
    description: 'Start a fresh Patticake note for the bakery team and choose the yum! restaurant that works for pickup.',
    image: '/images/patticake/layers_slice_vertical.jpg',
    alt: 'yum! patticake chocolate cake layers close up',
    className: 'crop-patticake-vertical-layer',
    href: '#cake-inquiry',
    action: 'Pick Up Locally',
  },
  {
    title: 'Ship a Cake',
    description: 'Send a Patticake beyond the Twin Cities with the date, address, timing notes, and gift message.',
    image: '/images/patticake/09_slices.jpg',
    alt: 'yum! patticake slices on plates',
    className: 'crop-patticake-slices',
    href: '/patticake',
    action: 'Ship a Cake',
  },
  {
    title: 'celebrations',
    description: 'Plan a birthday, thank-you, wedding, office treat, or just-because cake with the message on top.',
    image: '/images/patticake/06_8inch_a.jpg',
    alt: 'yum! patticake with Just Married message',
    className: 'crop-patticake-message',
    href: '#cake-inquiry',
    action: 'Plan a Celebration',
  },
] as const;

const orderSteps = [
  {
    number: '1',
    title: 'choose your cake moment',
    description: 'Start with local pickup, shipping, or a celebration plan.',
  },
  {
    number: '2',
    title: 'add the message',
    description: 'Share the date, size, pickup restaurant, who it is for, and words for the cake.',
  },
  {
    number: '3',
    title: 'we bake fresh',
    description: 'yum! finishes the Patticake close to the celebration date.',
  },
  {
    number: '4',
    title: 'serve it happy',
    description: 'Pick it up, send it out, or bring it to the table ready to share.',
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

const gallery = [
  { src: '/images/patticake/layers_slice_vertical.jpg', alt: 'yum! patticake chocolate cake layers close up', className: 'crop-patticake-vertical-layer' },
  { src: '/images/patticake/slices_plates_vertical.jpg', alt: 'yum! patticake slices on plates', className: 'crop-patticake-vertical-slices' },
  { src: '/images/patticake/gift_box_vertical.jpg', alt: 'yum! bakery gift box with red ribbon', className: 'crop-patticake-gift-box' },
  { src: '/images/patticake/06_8inch_a.jpg', alt: 'yum! patticake with Just Married message', className: 'crop-patticake-message' },
] as const;

export default function CakePage() {
  return (
    <main className="bg-page">
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
              label="chocolate layers"
              className="crop-patticake-vertical-layer"
            />
            <Reveal as="p" className="mt-7 max-w-[500px] text-xl leading-8 text-ink" delay={0.1} y={16}>
              Patticake is devil&apos;s food chocolate cake layered with vanilla buttercream, baked fresh for birthdays, thank-yous, weddings, and every table worth celebrating.
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap items-center gap-3" delay={0.16} y={14}>
              <PressButton>
                <a href="#cake-inquiry" className="btn-primary">
                  Pick Up Locally
                </a>
              </PressButton>
              <PressButton>
                <Link href="/patticake" className="btn-secondary">
                  Ship a Cake
                </Link>
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
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover crop-patticake-vertical-layer"
            />
            <div className="absolute left-4 top-4 bg-brand-red px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white md:left-6 md:top-6">
              patticake
            </div>
            <div className="cake-message-tags" aria-hidden="true">
              <TapeTag delay={0.45}>happy birthday</TapeTag>
              <TapeTag delay={0.67}>just married</TapeTag>
              <TapeTag delay={0.89}>love you</TapeTag>
            </div>
            <div className="absolute bottom-4 left-4 right-4 grid gap-3 bg-cream/95 p-4 shadow-xl md:bottom-6 md:left-6 md:right-6 md:grid-cols-[1fr_auto] md:items-end md:p-5">
              <div>
                <p className="font-serif text-2xl leading-tight text-ink">chocolate layers, vanilla buttercream</p>
                <p className="mt-1 text-base leading-6 text-body">the cake people ask for by name</p>
              </div>
              <a href="#shop-patticake" className="btn-secondary bg-white px-4 py-3 text-base hover:bg-brand-red">
                Choose Your Cake
              </a>
            </div>
          </div>
        </div>
      </section>

      <PatticakeMessageRibbon tone="cream" />
      <PatticakePathGuide activePath="pickup" />

      <section className="bg-page px-6 py-8">
        <div className="mx-auto max-w-[1240px]">
          <Stagger className="patticake-ticket" gap={0.12}>
            <StaggerItem variant="stamp" baseRotate={180} className="patticake-ticket-stub patticake-ticket-stub-brand">
              yum!
              <br />
              Kitchen and Bakery
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

      <section id="shop-patticake" className="bg-cream px-6 py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-end gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-label">shop patticake</p>
              <h2 className="text-h2 lowercase">one cake, three happy ways</h2>
            </div>
            <p className="max-w-2xl text-xl leading-9 text-ink">
              Choose local pickup, shipping, or celebration planning, then tell us what would make the day feel sweet.
            </p>
          </div>
          <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {cakePaths.map((path) => (
              <StaggerItem as="article" key={path.title} className="patticake-action-card group" hoverLift>
                <div className="relative aspect-[5/4] overflow-hidden bg-blue-soft">
                  <Image src={path.image} alt={path.alt} fill loading={path.image === '/images/patticake/layers_slice_vertical.jpg' ? 'eager' : undefined} sizes="(min-width: 768px) 33vw, 100vw" className={`image-lift object-cover transition duration-500 ${path.className}`} />
                </div>
                <div className="grid flex-1 p-6">
                  <h3 className="font-serif text-3xl font-normal lowercase text-ink">{path.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-body">{path.description}</p>
                  <PressButton className="mt-6 self-end">
                    <a href={path.href} className="btn-primary">
                      {path.action}
                    </a>
                  </PressButton>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="delivery" className="bg-white px-6 py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="section-label">how ordering works</p>
              <h2 className="text-h2 lowercase">from message to table, clearly</h2>
              <p className="mt-5 text-xl leading-9 text-body">
                Start with how the cake needs to travel, then add the date, message, size, and pickup or delivery notes.
              </p>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden bg-blue-soft">
              <Image src="/images/patticake/09_slices.jpg" alt="yum! patticake slices ready to share" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover crop-patticake-slices" />
            </div>
          </div>
          <Stagger className="mt-11 grid gap-5 md:grid-cols-4">
            {orderSteps.map((step) => (
              <StaggerItem as="article" key={step.number} className="border-t-2 border-brand-primary pt-5">
                <p className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-tint font-serif text-xl text-ink">{step.number}</p>
                <h3 className="mt-5 font-serif text-2xl font-normal lowercase text-ink">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-body">{step.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <PatticakeMessagePreview />

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

      <PatticakeOriginBand />

      <section className="bg-white px-6 py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="section-label">patticake gallery</p>
              <h2 className="text-h2 lowercase">made for every celebration</h2>
            </div>
            <a href="#cake-inquiry" className="btn-link">
              Plan a cake
            </a>
          </div>
          <Stagger className="grid gap-4 md:grid-cols-4" gap={0.06}>
            {gallery.map((image, index) => (
              <StaggerItem key={`${image.alt}-${index}`} className={`relative overflow-hidden bg-page ${index === 1 ? 'aspect-[4/5]' : 'aspect-square'}`}>
                <Image src={image.src} alt={image.alt} fill loading={image.src === '/images/patticake/layers_slice_vertical.jpg' ? 'eager' : undefined} sizes="(min-width: 768px) 25vw, 100vw" className={`object-cover ${image.className}`} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

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
