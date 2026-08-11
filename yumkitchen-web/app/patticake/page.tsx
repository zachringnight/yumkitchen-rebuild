import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CakeBuyModule } from '@/components/patticake/CakeBuyModule';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { JsonLd } from '@/components/JsonLd';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { PressButton } from '@/components/motion/PressButton';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { MediaProofBand } from '@/components/MediaProofBand';
import { PatticakeHeroPeek } from '@/components/PatticakeHeroPeek';
import { PatticakeMessageRibbon } from '@/components/PatticakeMessageRibbon';
import { PatticakeProcessSteps } from '@/components/PatticakeProcessSteps';
import {
  pageMeta,
  patticakeCanonical,
  patticakeNationalOrderIsExternal as nationalOrderIsExternal,
  patticakeNationalOrderUrl,
  patticakeOpenGraph,
  patticakeTitle,
} from '@/lib/site';

export const metadata: Metadata = {
  title: patticakeTitle(pageMeta.patticakeDelivery.title),
  description: pageMeta.patticakeDelivery.description,
  alternates: { canonical: patticakeCanonical('/patticake') },
  openGraph: patticakeOpenGraph(pageMeta.patticakeDelivery.image),
  twitter: { images: [pageMeta.patticakeDelivery.image] },
};

const occasions = [
  {
    title: 'birthdays',
    copy: 'A chocolate cake with a message that feels made for the person opening it.',
    image: '/images/patticake/09_slices.jpg',
    alt: 'yum! patticake slices on party plates',
    className: 'crop-patticake-slices',
  },
  {
    title: 'thank you gifts',
    copy: 'A bakery gift that feels personal without needing a local pickup.',
    image: '/images/patticake/gift_box_vertical.jpg',
    alt: 'yum! bakery gift box with red ribbon',
    className: 'crop-patticake-gift-box',
  },
  {
    title: 'office celebrations',
    copy: 'A shareable dessert for clients, teams, milestones, and meeting tables.',
    image: '/images/patticake/slices_counter_team.jpg',
    alt: 'a row of triple-layer chocolate Patticake slices on the yum! counter, bakers in red caps behind',
    className: 'crop-patticake-product',
  },
  {
    title: 'family moments',
    copy: 'For the table you cannot get to in person, but still want to show up for.',
    image: '/images/patticake/gift_boxes_stack.jpg',
    alt: 'a stack of baby-blue yum! gift boxes ready to send',
    className: 'crop-patticake-gift-stack',
  },
] as const;

const confirmations = [
  'recipient name and full ship-to address',
  'delivery date, three or more days out',
  'servings, occasion, and gift message',
  'weather, timing, or packing notes',
  'local pickup if the cake is staying in the Twin Cities',
] as const;

const deliveryFacts = [
  {
    title: 'price',
    copy: 'Whole cakes and slices are priced right on this page. Shipping is added at checkout, before you pay.',
  },
  {
    title: 'timing',
    copy: 'Delivery dates start three days out. Pick your date at checkout and we bake close to it.',
  },
  {
    title: 'where it goes',
    copy: 'Patticake ships nationwide. Add the full ship-to address at checkout, or choose local pickup instead.',
  },
  {
    title: 'how it arrives',
    copy: 'Patticake is packed with care, with the message close by and the cake ready to share.',
  },
] as const;

const trustNotes = [
  'made by the same scratch bakery behind four yum! restaurants',
  'gift-ready care from real people at yum!',
  'simple chocolate cake, vanilla buttercream, and a message people remember',
] as const;

const cakeDetails = [
  {
    title: 'made from scratch',
    copy: 'Triple-layer chocolate cake and vanilla buttercream, baked by the yum! team.',
  },
  {
    title: 'made to share',
    copy: 'An 8-inch round that serves 8 to 16, or send it by the slice.',
  },
] as const;

const faqs = [
  {
    question: 'Can I pay online right now?',
    answer:
      'Yes. Choose your cake, add a delivery date and gift message, and check out securely. We bake fresh and ship it ready to share.',
  },
  {
    question: 'Can I include a gift message?',
    answer: 'Yes. Add the cake message and a gift note. If it needs a little help, we will work with you.',
  },
  {
    question: 'Where can Patticake ship?',
    answer: 'Patticake ships nationwide. Add the ship-to address at checkout and we pack it to travel. Staying in the Twin Cities? Local pickup works too.',
  },
  {
    question: 'How soon should I order?',
    answer: 'Delivery dates start three days out, and earlier is better for big moments. We bake close to your date so it arrives fresh.',
  },
  {
    question: 'Can I pick up locally?',
    answer: 'Yes. If the Patticake is staying local, start a Pick Up Locally note and choose your yum! restaurant.',
  },
  {
    question: 'What if I need help before shipping?',
    answer: 'Send us a note for delivery questions, bigger orders, special timing, or anything you want us to know before we bake.',
  },
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Patticake',
  description:
    'yum! Kitchen and Bakery’s signature Patticake: a towering triple-layer chocolate cake with vanilla buttercream, baked from scratch and available nationwide as an 8-inch round that serves 8 to 16, or by the slice.',
  image: [
    patticakeCanonical('/images/patticake/10_layers_slice.jpg'),
    patticakeCanonical('/images/patticake/slices_rows.jpg'),
  ],
  brand: {
    '@type': 'Brand',
    name: 'yum! Kitchen and Bakery',
  },
  category: 'Cake',
  url: patticakeCanonical('/patticake'),
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '7.50',
    highPrice: '59.95',
    offerCount: 2,
    availability: 'https://schema.org/InStock',
    url: patticakeCanonical('/patticake'),
  },
};

export default function PatticakeNationalDeliveryPage() {
  return (
    <main className="bg-cream">
      <JsonLd data={jsonLd} />
      <JsonLd data={productJsonLd} />

      <section className="overflow-hidden bg-blue-tint px-6 py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-[620px]">
            <Reveal as="p" className="section-label" y={10}>now available nationwide</Reveal>
            <Reveal as="h1" className="font-serif text-[clamp(3.55rem,7vw,6.7rem)] font-normal leading-[0.9] lowercase text-brand-primary" fade={false} y={14} delay={0.05}>
              ship a patticake nationwide
            </Reveal>
            <PatticakeHeroPeek
              src="/images/patticake/10_layers_slice.jpg"
              alt="triple-layer chocolate Patticake cut open to show the layers"
              className="crop-patticake-layer"
            />
            <Reveal as="p" className="mt-7 max-w-xl text-xl leading-9 text-ink" delay={0.1} y={16}>
              Patticake now ships nationwide. Tell us where it is headed, when it should arrive, and the words that should travel with it.
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap gap-3" delay={0.16} y={14}>
              <PressButton>
                <a href={patticakeNationalOrderUrl} target={nationalOrderIsExternal ? '_blank' : undefined} rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined} className="btn-primary">
                  Ship a Cake
                </a>
              </PressButton>
              <PressButton>
                <Link href="/order-a-cake" className="btn-secondary">
                  Pick Up Locally
                </Link>
              </PressButton>
            </Reveal>
            <p className="mt-4 max-w-lg text-base font-bold leading-7 text-brand-primary">
              Order online in a few taps, or start a note and we&apos;ll help you plan it.
            </p>
            <Stagger className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2" gap={0.08}>
              <StaggerItem><HeroNote title="built for gifting" copy="address, date, occasion, and message" /></StaggerItem>
              <StaggerItem><HeroNote title="bakery checked" copy="timing, weather, and the best way to send it" /></StaggerItem>
            </Stagger>
          </div>

          <div className="patticake-delivery-photo-pair">
            <div className="patticake-hero-card min-h-[520px]">
              <Image
                src="/images/patticake/gift_box_tissue.jpg"
                alt="a baby-blue yum! gift box tied with red ribbon on red polka-dot tissue"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover crop-patticake-gift-box"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden border-y border-brand-primary/25 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[420px] bg-blue-soft lg:min-h-[620px]">
            <Image
              src="/images/patticake/slices_rows.jpg"
              alt="rows of triple-layer yum! patticake slices on white plates"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover crop-patticake-slices"
            />
          </div>
          <div className="flex flex-col bg-blue-tint p-[clamp(2rem,5vw,4.75rem)]">
            <Reveal>
              <p className="section-label text-ink">meet the cake</p>
              <h2 className="mt-3 font-serif text-[clamp(3.25rem,6vw,5.75rem)] font-normal leading-[0.92] lowercase text-brand-primary">
                three layers.
                <br />
                one real bakery cake.
              </h2>
              <p className="mt-6 max-w-xl text-xl leading-9 text-ink">
                Patticake is yum!&apos;s signature chocolate cake, packed to travel and ready for the table.
              </p>
            </Reveal>
            <Stagger className="mt-10 divide-y divide-brand-primary/30 border-y border-brand-primary/30 sm:mt-auto">
              {cakeDetails.map((detail) => (
                <StaggerItem as="article" key={detail.title} className="grid gap-2 py-5 sm:grid-cols-[0.42fr_0.58fr] sm:gap-6">
                  <h3 className="font-serif text-2xl font-normal lowercase text-brand-primary">{detail.title}</h3>
                  <p className="text-lg leading-8 text-ink">{detail.copy}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {nationalOrderIsExternal ? (
        <section id="national-order" className="scroll-mt-20 bg-blue-tint px-6 py-12 lg:py-section">
          <div className="mx-auto grid max-w-[1240px] overflow-hidden border-y border-brand-primary/35 bg-white lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[420px] bg-blue-soft lg:min-h-[620px]">
              <Image
                src="/images/patticake/gift_boxes_stack.jpg"
                alt="a stack of baby-blue yum! gift boxes with red ribbon"
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover crop-patticake-gift-stack"
              />
            </div>
            <div className="flex flex-col justify-center bg-blue-tint p-[clamp(2rem,5vw,4.75rem)]">
              <p className="section-label text-ink">nationwide delivery</p>
              <h2 className="font-serif text-[clamp(3.25rem,6vw,5.75rem)] font-normal leading-[0.92] lowercase text-brand-primary">
                send a patticake
              </h2>
              <p className="mt-6 max-w-xl text-xl leading-9 text-ink">
                Choose your delivery date, address, and gift message in the nationwide checkout.
              </p>
              <a
                href={patticakeNationalOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8 self-start"
                data-event="click_patticake_national_delivery_order"
                data-source="national_order_module"
              >
                Ship a Cake
              </a>
            </div>
          </div>
        </section>
      ) : (
        <CakeBuyModule />
      )}

      <PatticakeMessageRibbon tone="blue" />

      <section className="bg-white px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-center">
          <div>
            <p className="section-label">before you ship</p>
            <h2 className="text-h2 lowercase">how shipping works</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              Order online and we take it from there. Prefer to talk it through first? Send a shipping note and a real yum! baker will reply.
            </p>
            <div className="patticake-trust-strip">
              {trustNotes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <ParallaxImage className="relative min-h-[360px] border border-ink/10 bg-blue-soft">
              <Image
                src="/images/yum-packaging-suite.jpg"
                alt="the yum! packaging lineup: baby-blue boxes, a ribboned cake box, and red-logo bags"
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover"
              />
            </ParallaxImage>
            <Stagger className="delivery-logistics-grid">
              {deliveryFacts.map((fact) => (
                <StaggerItem as="article" key={fact.title}>
                  <h3>{fact.title}</h3>
                  <p>{fact.copy}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <PatticakeProcessSteps />

      <section className="bg-white px-6 py-12 lg:py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-end gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="section-label">send it for</p>
              <h2 className="text-h2 lowercase">life&apos;s sweetest long-distance moments</h2>
            </div>
            <p className="max-w-2xl text-xl leading-9 text-body">
              Send Patticake for the moments people recognize right away: birthdays, thank-yous, office celebrations, and family tables away from home.
            </p>
          </div>
          <Stagger className="mt-10 grid gap-5 md:grid-cols-4">
            {occasions.map((occasion) => (
              <StaggerItem as="article" key={occasion.title} className="patticake-action-card group" hoverLift>
                <div className="relative aspect-[4/3] overflow-hidden bg-blue-soft">
                  <Image src={occasion.image} alt={occasion.alt} fill sizes="(min-width: 768px) 25vw, 100vw" className={`image-lift object-cover transition duration-500 ${occasion.className}`} />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl font-normal lowercase text-ink">{occasion.title}</h3>
                  <p className="mt-3 text-base leading-7 text-body">{occasion.copy}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="section-label">before you order</p>
            <h2 className="text-h2 lowercase">what to have ready</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              A few notes help us take good care of the cake, whether you order now or ask us first.
            </p>
          </div>
          <div className="border border-brand-primary/20 bg-white p-6">
            <Stagger as="ul" className="grid gap-4" gap={0.06}>
              {confirmations.map((item, index) => (
                <StaggerItem as="li" key={item} className="grid grid-cols-[2rem_1fr] items-start gap-3 border-b border-blue-soft/70 pb-4 last:border-0 last:pb-0">
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-red font-serif text-base leading-none text-white">{index + 1}</span>
                  <span className="text-lg leading-7 text-ink">{item}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* One proof band, not two. ReviewsWall (1,366px of ratings sources,
          social links, and coverage lists) still runs on the yum! surfaces;
          here it pushed total proof to 2.5 screens against a 1.5-screen buy
          module. MediaProofBand now carries the rating and the two citations
          that describe the cake. */}
      <MediaProofBand />

      <section className="bg-blue-tint/70 px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="section-label">frequently asked questions</p>
            <h2 className="text-h2 lowercase">a few helpful notes before you order</h2>
          </div>
          <Stagger className="grid gap-3 md:grid-cols-2" gap={0.05}>
            {faqs.map((faq) => (
              <StaggerItem key={faq.question}>
                <details className="group h-full border border-ink/15 bg-white p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl lowercase text-ink">
                    {faq.question}
                    <span className="font-sans text-2xl leading-none text-brand-primary transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-base leading-7 text-body">{faq.answer}</p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Deliberately demoted: the checkout above is the way to buy, and this
          is the help path. It used to render all fifteen fields inline, at
          nearly the same size as the buy module, so the page asked visitors
          to choose between a real checkout and a "not a confirmed order"
          form. Collapsed, it stays one click away (and #delivery-support
          still lands here for the header and mobile-bar shortcuts). */}
      <section className="bg-white px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-[860px]">
          <Reveal>
            <p className="section-label">shipping help</p>
            <h2 className="text-h2 lowercase">rather talk it through first?</h2>
            <p className="mt-4 max-w-2xl text-xl leading-9 text-body">
              Ordering happens right on this page. If you have a question about timing, allergies, or the note on top, start a shipping note instead and a real yum! baker will reply. It is a note, not a confirmed order.
            </p>
          </Reveal>
          <details id="delivery-support" className="group mt-6 scroll-mt-24 border border-ink/15 bg-white md:scroll-mt-28">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-serif text-2xl lowercase text-brand-primary">
              start your shipping note
              <span className="font-sans text-3xl leading-none text-brand-primary transition group-open:rotate-45">+</span>
            </summary>
            <div className="border-t border-ink/15 p-5 sm:p-7">
              <InquiryForm
                kind="cake"
                cakeMode="delivery"
                defaultSubject="Patticake shipping note"
                eventDateLabel="Requested delivery date"
                guestsLabel="Quantity or servings"
                showLocation={false}
                hideSubject
                messageLabel="Delivery timing, allergy notes, or anything we should know"
                submitLabel="Send Shipping Note"
                successMessage="We got it. Someone from yum! will reply with the next sweet step."
              />
            </div>
          </details>
        </div>
      </section>

      <section className="bg-brand-red px-6 py-12 lg:py-section text-white">
        <Reveal className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
          <h2 className="font-serif text-[3rem] font-normal leading-tight lowercase text-white">ready to send a patticake?</h2>
          <PressButton>
            <a
              href={patticakeNationalOrderUrl}
              target={nationalOrderIsExternal ? '_blank' : undefined}
              rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
              className="inline-block border-2 border-white bg-white px-8 py-4 text-lg font-bold leading-none text-brand-primary transition hover:bg-blue-tint hover:text-ink"
              data-event="click_patticake_national_delivery_order"
            >
              Ship a Cake
            </a>
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
      <p className="mt-1 text-base leading-6 text-ink">{copy}</p>
    </div>
  );
}
