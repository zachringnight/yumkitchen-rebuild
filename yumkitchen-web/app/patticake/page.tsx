import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { MediaProofBand } from '@/components/MediaProofBand';
import { PatticakeMessageRibbon } from '@/components/PatticakeMessageRibbon';
import { PatticakeOriginBand } from '@/components/PatticakeOriginBand';
import { pageMeta, patticakeNationalOrderUrl, patticakeSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.patticakeDelivery.title,
  description: pageMeta.patticakeDelivery.description,
  alternates: { canonical: `${patticakeSiteUrl}/patticake` },
  openGraph: { images: [pageMeta.patticakeDelivery.image] },
  twitter: { images: [pageMeta.patticakeDelivery.image] },
};

const steps = [
  {
    number: '1',
    title: 'start the order',
    copy: 'Order Patticake when the address and date are ready.',
  },
  {
    number: '2',
    title: 'add the gift note',
    copy: 'Share the ship-to address, date, occasion, and message.',
  },
  {
    number: '3',
    title: 'ask us anything',
    copy: 'Send a note if timing, weather, or a bigger order needs a bakery check.',
  },
  {
    number: '4',
    title: 'send the cake',
    copy: 'Patticake is packed with care and sent for the moment it needs to reach.',
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
  'ship-to address and hoped-for delivery date',
  'servings and occasion',
  'gift note or message',
  'packing or timing questions when the day matters',
  'local pickup instead if the cake is staying in the Twin Cities',
] as const;

const faqs = [
  {
    question: 'Can I order national delivery online?',
    answer:
      'Yes. Use the national delivery button on this page. If timing, weather, or a larger order needs a bakery check, send us a note and we’ll help.',
  },
  {
    question: 'Can I include a note?',
    answer: 'Yes. Add the gift note or message with the order.',
  },
  {
    question: 'Can I still order local pickup?',
    answer: 'Yes. Use the local cake pickup page if the Patticake will be picked up from a yum! Kitchen and Bakery location.',
  },
  {
    question: 'What if I need help before ordering?',
    answer: 'Send us a note for delivery questions, bigger orders, special timing, or anything you want the bakery team to see before you order.',
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

      <section className="overflow-hidden bg-cream px-6 py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-[620px]">
            <h1 className="font-serif text-[clamp(3.55rem,7vw,6.7rem)] font-normal leading-[0.9] lowercase text-ink">
              order patticake for national delivery
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-9 text-ink">
              Send yum! Patticake outside the Twin Cities with the date, address, occasion, and gift message.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={patticakeNationalOrderUrl} target={nationalOrderIsExternal ? '_blank' : undefined} rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined} className="btn-primary">
                Order National Delivery
              </a>
              <Link href="/order-a-cake" className="btn-secondary">
                Local Cake Pickup
              </Link>
            </div>
            <div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2">
              <HeroNote title="built for gifting" copy="address, date, occasion, and message" />
              <HeroNote title="ask the bakery" copy="send us a note when timing or weather needs a human check" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.44fr]">
            <div className="patticake-hero-card min-h-[520px]">
              <Image
                src="/images/patticake/09_slices.jpg"
                alt="yum! patticake slices on plates"
                fill
                loading="eager"
                fetchPriority="high"
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

      <PatticakeMessageRibbon tone="blue" />

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
                Start with the order, send us a note if timing needs a human check, and keep the gift message close.
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

      <section className="bg-cream px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="section-label">before you order</p>
            <h2 className="text-h2 lowercase">what to have ready</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              A few notes help the bakery team take good care of the cake, whether you order now or ask us first.
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

      <section id="national-order" className="bg-blue-tint px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="section-label text-ink">ready to send it?</p>
            <h2 className="text-h2 lowercase">send Patticake from here</h2>
            <p className="mt-5 text-xl leading-9 text-ink">
              Start the national delivery order and add the address, date, occasion, and message.
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
                <Image src="/images/patticake/10_layers_slice.jpg" alt="yum! patticake chocolate cake layers close up" fill loading="eager" sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover crop-patticake-layer" />
              </div>
              <div>
                <p className="font-serif text-3xl font-normal lowercase text-ink">Patticake</p>
                <p className="mt-3 text-lg leading-8 text-body">
                  Devil&apos;s food chocolate cake layered with vanilla buttercream, made to send beyond the Twin Cities.
                </p>
                <ul className="mt-5 grid gap-3 text-base leading-7 text-ink">
                  <li>Choose national delivery</li>
                  <li>Add the address and gift note</li>
                  <li>Add timing or weather notes</li>
                  <li>Send Patticake on its way</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery-support" className="bg-white px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="section-label">ask the bakery</p>
            <h2 className="text-h2 lowercase">questions before national delivery?</h2>
            <p className="mt-5 text-xl leading-9 text-body">
              For bigger orders, timing questions, delivery notes, or anything unusual, send a note and the bakery team will help.
            </p>
            <p className="mt-5 text-base leading-7 text-body">
              Your note goes to the yum! bakery team so they can help before you place or adjust a national delivery order.
            </p>
          </div>
          <InquiryForm
            kind="cake"
            defaultSubject="Patticake national delivery order"
            eventDateLabel="Requested delivery date"
            guestsLabel="Quantity or servings"
            locationLabel="Preferred yum! location"
            messageLabel="Ship-to address, occasion, delivery notes, and message"
            submitLabel="Send Bakery Note"
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
            Order National Delivery
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
