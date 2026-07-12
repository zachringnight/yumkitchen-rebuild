import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CakeBuyModule } from '@/components/patticake/CakeBuyModule';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { JsonLd } from '@/components/JsonLd';
import { MediaProofBand } from '@/components/MediaProofBand';
import { ReviewsWall } from '@/components/ReviewsWall';
import { PatticakeHeroPeek } from '@/components/PatticakeHeroPeek';
import { PatticakeMessageRibbon } from '@/components/PatticakeMessageRibbon';
import { PatticakeMessagePreview } from '@/components/PatticakeMessagePreview';
import { PatticakeOriginBand } from '@/components/PatticakeOriginBand';
import { PatticakePathGuide } from '@/components/PatticakePathGuide';
import { pageMeta, patticakeCanonical, patticakeNationalOrderUrl, patticakeOpenGraph, patticakeTitle } from '@/lib/site';

export const metadata: Metadata = {
  title: patticakeTitle(pageMeta.patticakeDelivery.title),
  description: pageMeta.patticakeDelivery.description,
  alternates: { canonical: patticakeCanonical('/patticake') },
  openGraph: patticakeOpenGraph(pageMeta.patticakeDelivery.image),
  twitter: { images: [pageMeta.patticakeDelivery.image] },
};

const steps = [
  {
    number: '1',
    title: 'choose your cake',
    copy: 'Pick a whole cake or slices, and tell us the occasion.',
  },
  {
    number: '2',
    title: 'set the delivery',
    copy: 'Add the ship-to address and delivery date at checkout.',
  },
  {
    number: '3',
    title: 'add the words',
    copy: 'Write the gift message that should travel with the cake.',
  },
  {
    number: '4',
    title: 'we bake and send',
    copy: 'Patticake is baked fresh, packed with care, and sent ready to share.',
  },
] as const;

const occasions = [
  {
    title: 'birthdays',
    copy: 'A chocolate cake with a message that feels made for the person opening it.',
    image: '/images/patticake/03_top_view.jpg',
    alt: 'yum! patticake vanilla buttercream top view',
    className: 'crop-patticake-top',
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
    image: '/images/patticake/slices_plates_vertical.jpg',
    alt: 'yum! patticake slices on plates',
    className: 'crop-patticake-vertical-slices',
  },
  {
    title: 'family moments',
    copy: 'For the table you cannot get to in person, but still want to show up for.',
    image: '/images/yum-patticake-slice-togo.jpeg',
    alt: 'yum! patticake slice in to-go packaging',
    className: 'crop-patticake-togo',
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

const cakeFacts = [
  {
    title: 'the cake',
    copy: 'yum!’s signature: a towering triple-layer chocolate cake with vanilla buttercream, baked from scratch.',
  },
  {
    title: 'the size',
    copy: 'An 8-inch round that serves 8 to 16, or send it by the slice.',
  },
  {
    title: 'the lineup',
    copy: 'One of three signature yum! cakes, alongside Baker’s Man and Coconut.',
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
    'yum! Kitchen and Bakery’s signature Patticake: a towering triple-layer chocolate cake with vanilla buttercream, baked from scratch. Available as an 8-inch round that serves 8 to 16, or by the slice.',
  image: [
    patticakeCanonical('/images/patticake/03_top_view.jpg'),
    patticakeCanonical('/images/patticake/09_slices.jpg'),
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

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export default function PatticakeNationalDeliveryPage() {
  return (
    <main className="bg-page">
      <JsonLd data={jsonLd} />
      <JsonLd data={productJsonLd} />

      <section className="overflow-hidden bg-cream px-6 py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-[620px]">
            <h1 className="font-serif text-[clamp(3.55rem,7vw,6.7rem)] font-normal leading-[0.9] lowercase text-ink">
              ship a patticake
            </h1>
            <PatticakeHeroPeek
              src="/images/patticake/09_slices.jpg"
              alt="yum! patticake slices on plates"
              label="ready to send"
              className="crop-patticake-slices"
            />
            <p className="mt-7 max-w-xl text-xl leading-9 text-ink">
              Tell us where it is headed, when it should arrive, and the words that should travel with it. We&apos;ll help it get there ready to share.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={patticakeNationalOrderUrl} target={nationalOrderIsExternal ? '_blank' : undefined} rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined} className="btn-primary">
                Ship a Cake
              </a>
              <Link href="/order-a-cake" className="btn-secondary">
                Pick Up Locally
              </Link>
            </div>
            <p className="mt-4 max-w-lg text-base font-bold leading-7 text-brand-primary">
              Order online in a few taps, or start a note and we&apos;ll help you plan it.
            </p>
            <div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2">
              <HeroNote title="built for gifting" copy="address, date, occasion, and message" />
              <HeroNote title="bakery checked" copy="timing, weather, and the best way to send it" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.44fr]">
            <div className="patticake-hero-card min-h-[520px]">
              <Image
                src="/images/patticake/09_slices.jpg"
                alt="yum! patticake slices on plates"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover crop-patticake-slices"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-cream/95 p-5 shadow-xl">
                <p className="font-serif text-3xl leading-tight text-ink">ship the cake people remember</p>
                <p className="mt-2 text-base leading-6 text-body">same Patticake story, sent farther from home</p>
              </div>
              <div className="cake-message-tags cake-message-tags-delivery" aria-hidden="true">
                <span>miss you</span>
                <span>thank you</span>
                <span>go team</span>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="border border-brand-primary/30 bg-white p-5">
                <p className="font-serif text-5xl leading-none text-brand-primary">1</p>
                <p className="mt-3 text-base leading-7 text-body">signature chocolate cake made for sending.</p>
              </div>
              <div className="relative min-h-[210px] overflow-hidden border border-ink/10 bg-blue-soft">
                <Image src="/images/patticake/03_top_view.jpg" alt="yum! patticake vanilla buttercream top view" fill loading="eager" sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover crop-patticake-top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 lg:py-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-2xl">
            <p className="section-label">meet the cake</p>
            <h2 className="text-h2 lowercase">what you&apos;re sending</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              Patticake is yum!&apos;s signature: a towering triple-layer chocolate cake with vanilla buttercream, baked from scratch and packed to travel.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {cakeFacts.map((fact) => (
              <article key={fact.title} className="border border-ink/10 bg-page p-6">
                <h3 className="text-h3 lowercase">{fact.title}</h3>
                <p className="mt-3 text-base leading-7 text-body">{fact.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CakeBuyModule />

      <PatticakeMessageRibbon tone="blue" />
      <PatticakePathGuide activePath="shipping" />

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
            <div className="relative min-h-[360px] overflow-hidden border border-ink/10 bg-blue-soft">
              <Image
                src="/images/patticake/gift_box_vertical.jpg"
                alt="yum! bakery gift box with red ribbon"
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover crop-patticake-gift-box"
              />
            </div>
            <div className="delivery-logistics-grid">
              {deliveryFacts.map((fact) => (
                <article key={fact.title}>
                  <h3>{fact.title}</h3>
                  <p>{fact.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-page px-6 py-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="patticake-ticket">
            <div className="patticake-ticket-stub">
              admit one
              <br />
              patticake
            </div>
            <div>
              <h2 className="font-serif text-[2.7rem] font-normal leading-tight lowercase text-brand-primary">a clearer way to send it.</h2>
              <p className="mt-4 max-w-[560px] text-lg leading-8 text-ink">
                Pick the cake, set the date and message at checkout, and we&apos;ll help it travel with care.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <article key={step.number} className="border-t border-ink/15 pt-4">
                  <p className="font-serif text-3xl leading-none text-brand-primary">{step.number}</p>
                  <h3 className="mt-3 font-serif text-2xl font-normal lowercase text-ink">{step.title}</h3>
                  <p className="mt-2 text-base leading-7 text-body">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

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
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {occasions.map((occasion) => (
              <article key={occasion.title} className="patticake-action-card group">
                <div className="relative aspect-[4/3] overflow-hidden bg-blue-soft">
                  <Image src={occasion.image} alt={occasion.alt} fill sizes="(min-width: 768px) 25vw, 100vw" className={`image-lift object-cover transition duration-500 ${occasion.className}`} />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl font-normal lowercase text-ink">{occasion.title}</h3>
                  <p className="mt-3 text-base leading-7 text-body">{occasion.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PatticakeMessagePreview formHref="#delivery-support" />

      <section className="bg-cream px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="section-label">before you order</p>
            <h2 className="text-h2 lowercase">what to have ready</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              A few notes help us take good care of the cake, whether you order now or ask us first.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.78fr_1fr]">
            <div className="relative min-h-[330px] overflow-hidden border border-ink/10 bg-white">
              <Image src="/images/yum-patticake-slice-togo.jpeg" alt="yum! patticake slice in to-go packaging" fill sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover crop-patticake-togo" />
            </div>
            <div className="border border-brand-primary/20 bg-white p-6">
              <ul className="grid gap-4">
                {confirmations.map((item, index) => (
                  <li key={item} className="grid grid-cols-[2rem_1fr] items-start gap-3 border-b border-blue-soft/70 pb-4 last:border-0 last:pb-0">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-red font-serif text-base leading-none text-white">{index + 1}</span>
                    <span className="text-lg leading-7 text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PatticakeOriginBand />
      <MediaProofBand />
      <ReviewsWall />

      <section className="bg-page px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="section-label">frequently asked questions</p>
            <h2 className="text-h2 lowercase">a few helpful notes before you order</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border border-ink/15 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl lowercase text-ink">
                  {faq.question}
                  <span className="font-sans text-2xl leading-none text-brand-primary transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-base leading-7 text-body">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery-support" className="scroll-mt-24 bg-white px-6 py-12 md:scroll-mt-28 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="section-label">shipping help</p>
            <h2 className="text-h2 lowercase">start your shipping note</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              Share where the cake is going, when it should arrive, and what you want written with it. This starts a bakery note, not a confirmed order.
            </p>
          </div>
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
      </section>

      <section className="bg-brand-red px-6 py-12 lg:py-section text-white">
        <div className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
          <h2 className="font-serif text-[3rem] font-normal leading-tight lowercase text-white">ready to send a patticake?</h2>
          <a
            href={patticakeNationalOrderUrl}
            target={nationalOrderIsExternal ? '_blank' : undefined}
            rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
            className="inline-block border-2 border-white bg-white px-8 py-4 text-lg font-bold leading-none text-brand-primary transition hover:bg-blue-tint hover:text-ink"
            data-event="click_patticake_national_delivery_order"
          >
            Ship a Cake
          </a>
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
