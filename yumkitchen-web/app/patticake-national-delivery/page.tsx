import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { pageMeta, patticakeNationalOrderUrl, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.patticakeDelivery.title,
  description: pageMeta.patticakeDelivery.description,
  alternates: { canonical: '/patticake-national-delivery' },
  openGraph: { images: [pageMeta.patticakeDelivery.image] },
};

const steps = [
  {
    number: '1',
    title: 'click to order',
    copy: 'Use the national delivery order path when you are ready to send Patticake outside the Twin Cities.',
  },
  {
    number: '2',
    title: 'add delivery details',
    copy: 'Enter the ship-to destination, requested timing, quantity, occasion, and recipient message.',
  },
  {
    number: '3',
    title: 'finish the order',
    copy: 'Complete the national delivery flow or send the details to the bakery team if the order needs support.',
  },
  {
    number: '4',
    title: 'patticake heads out',
    copy: 'The cake is prepared, packed, and sent for the celebration it is meant to reach.',
  },
] as const;

const occasions = [
  {
    title: 'birthdays',
    copy: 'A familiar chocolate cake for the person who should feel remembered.',
    image: '/images/yum-patticake-layers.jpg',
    alt: 'yum! patticake chocolate cake layers',
  },
  {
    title: 'thank you gifts',
    copy: 'A bakery gift that feels more personal than a standard shipped box.',
    image: '/images/yum-patticake-top.jpg',
    alt: 'yum! patticake top with vanilla buttercream',
  },
  {
    title: 'office celebrations',
    copy: 'A shareable dessert for teams, clients, and milestone days.',
    image: '/images/yum-patticake-tier.jpg',
    alt: 'yum! tiered wedding patticake',
  },
  {
    title: 'family moments',
    copy: 'For the table you cannot get to in person, but still want to show up for.',
    image: '/images/yum-patticake-floral-tier.jpg',
    alt: 'yum! floral wedding patticake',
  },
] as const;

const confirmations = [
  'ship-to address and requested date',
  'quantity, servings, and occasion details',
  'packaging approach for the season and route',
  'message, gift note, and recipient instructions',
  'final delivery details before the order is accepted',
] as const;

const faqs = [
  {
    question: 'Can I order national delivery online?',
    answer:
      'Yes. Use the national delivery order path on this page. If a destination or timing question needs support, use the order-details form and the bakery team can follow up.',
  },
  {
    question: 'Can I include a note?',
    answer: 'Yes. Add the recipient note or gift message with the national delivery order details.',
  },
  {
    question: 'Can I still order local pickup?',
    answer: 'Yes. Use the local cake pickup page if the Patticake will be picked up from a yum! Kitchen and Bakery location.',
  },
  {
    question: 'What if I need help before ordering?',
    answer: 'Use the form on this page for delivery questions, unusual timing, larger quantities, or special notes before you place the order.',
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

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export default function PatticakeNationalDeliveryPage() {
  return (
    <main className="bg-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="overflow-hidden bg-cream px-6 pb-[78px] pt-[calc(72px+64px)]">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="mb-5 font-sans text-sm font-bold uppercase tracking-[0.14em] text-brand-primary">national delivery</p>
            <h1 className="font-serif text-[3.45rem] font-normal leading-[1.02] lowercase text-ink md:text-[5rem]">
              order patticake for national delivery
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-9 text-body">
              Send the original yum! Patticake outside the Twin Cities with a direct order path built for national delivery. Add the destination, timing, and gift details, then let the cake do the talking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={patticakeNationalOrderUrl} target={nationalOrderIsExternal ? '_blank' : undefined} rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined} className="btn-primary">
                Order National Delivery
              </a>
              <Link href="/order-a-cake" className="btn-secondary">
                Local Cake Pickup
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_0.42fr]">
            <div className="relative min-h-[430px] overflow-hidden border border-ink/10 bg-blue-soft">
              <Image
                src="/images/yum-patticake-layers.jpg"
                alt="yum! patticake chocolate cake layers"
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4">
              <div className="border border-brand-primary/25 bg-white p-5">
                <p className="font-serif text-4xl leading-none text-brand-primary">1</p>
                <p className="mt-3 text-base leading-7 text-body">signature chocolate cake, now with a national delivery order path.</p>
              </div>
              <div className="relative min-h-[180px] overflow-hidden border border-ink/10 bg-white">
                <Image src="/images/yum-patticake-top.jpg" alt="yum! patticake top with vanilla buttercream" fill loading="eager" sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-tint px-6 py-[72px]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center font-serif text-[2.6rem] font-normal leading-tight lowercase text-ink">how national delivery ordering works</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="border-l border-brand-primary/25 bg-white/70 p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-soft font-serif text-xl text-ink">{step.number}</div>
                <h3 className="font-serif text-2xl font-normal lowercase text-ink">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-body">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-section">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-end gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="section-label">send it for</p>
              <h2 className="text-h2 lowercase">life&apos;s sweetest long-distance moments</h2>
            </div>
            <p className="max-w-2xl text-xl leading-9 text-body">
              Send the cake people remember for birthdays, thank-yous, office celebrations, and family moments away from home.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {occasions.map((occasion) => (
              <article key={occasion.title} className="border border-ink/15 bg-page">
                <div className="relative aspect-[4/3] overflow-hidden bg-blue-soft">
                  <Image src={occasion.image} alt={occasion.alt} fill loading="eager" sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
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

      <section className="bg-cream px-6 py-section">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="section-label">built for ordering</p>
            <h2 className="text-h2 lowercase">a clearer national delivery path</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              Choose national delivery, add the recipient details, and use support only when timing, quantity, or destination details need extra help.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1fr]">
            <div className="relative min-h-[280px] overflow-hidden border border-ink/10 bg-white">
              <Image src="/images/yum-patticake-top.jpg" alt="yum! patticake top with vanilla buttercream" fill loading="eager" sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover" />
            </div>
            <div className="border border-brand-primary/20 bg-white p-6">
              <ul className="grid gap-4">
                {confirmations.map((item) => (
                  <li key={item} className="grid grid-cols-[1.75rem_1fr] items-start gap-3 border-b border-blue-soft/70 pb-4 last:border-0 last:pb-0">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-sm font-bold leading-none text-white">✓</span>
                    <span className="text-lg leading-7 text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-page px-6 py-section">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="section-label">frequently asked questions</p>
            <h2 className="text-h2 lowercase">clear expectations before the form</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border border-ink/15 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl lowercase text-ink">
                  {faq.question}
                  <span className="font-sans text-2xl leading-none text-brand-primary group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-base leading-7 text-body">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="national-order" className="bg-blue-soft px-6 py-section">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="mb-3 font-sans text-sm font-bold leading-tight text-ink">click to order</p>
            <h2 className="text-h2 lowercase">start national delivery here</h2>
            <p className="mt-5 text-xl leading-9 text-ink">
              Start the national delivery order and add the ship-to details, timing, quantity, occasion, and message for the recipient.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={patticakeNationalOrderUrl}
                target={nationalOrderIsExternal ? '_blank' : undefined}
                rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                className="btn-primary"
                data-event="click_patticake_national_delivery_order"
              >
                Order National Delivery
              </a>
              <a href="#delivery-support" className="btn-secondary">
                Delivery Questions
              </a>
            </div>
          </div>
          <div className="border border-brand-primary/20 bg-white p-6">
            <div className="grid gap-6 md:grid-cols-[0.52fr_1fr] md:items-center">
              <div className="relative aspect-[4/5] overflow-hidden bg-blue-soft">
                <Image src="/images/yum-patticake-layers.jpg" alt="yum! patticake chocolate cake layers" fill loading="eager" sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover" />
              </div>
              <div>
                <p className="font-serif text-3xl font-normal lowercase text-ink">original Patticake</p>
                <p className="mt-3 text-lg leading-8 text-body">
                  Devil&apos;s food chocolate cake layered with vanilla buttercream, positioned as the national delivery product.
                </p>
                <ul className="mt-5 grid gap-3 text-base leading-7 text-ink">
                  <li>Choose national delivery</li>
                  <li>Add destination and recipient details</li>
                  <li>Add a gift note or celebration message</li>
                  <li>Complete the delivery order path</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery-support" className="bg-white px-6 py-section">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="section-label">order support</p>
            <h2 className="text-h2 lowercase">questions before national delivery?</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              For larger quantities, timing questions, delivery notes, or anything unusual, send the details and the bakery team can help route the order.
            </p>
            <p className="mt-5 text-base leading-7 text-body">
              The form sends the details through {siteUrl.replace('https://', '')} so the yum! bakery team can help before you place or adjust a national delivery order.
            </p>
          </div>
          <InquiryForm
            kind="cake"
            defaultSubject="Patticake national delivery order"
            eventDateLabel="Requested delivery date"
            guestsLabel="Quantity or servings"
            locationLabel="Preferred yum! location"
            messageLabel="Ship-to destination, occasion, delivery notes, and message"
            submitLabel="Send Order Details"
          />
        </div>
      </section>

      <section className="bg-brand-red px-6 py-[70px] text-white">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <h2 className="font-serif text-[3rem] font-normal leading-tight lowercase text-white">ready to send a patticake?</h2>
          <div>
            <p className="max-w-xl text-xl leading-9 text-white">
              Use the national delivery order path when the gift details are ready.
            </p>
            <a
              href={patticakeNationalOrderUrl}
              target={nationalOrderIsExternal ? '_blank' : undefined}
              rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
              className="mt-6 inline-block border-2 border-white bg-white px-7 py-3 text-lg font-bold leading-none text-brand-primary transition hover:bg-blue-tint hover:text-ink"
              data-event="click_patticake_national_delivery_order"
            >
              Order National Delivery
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
