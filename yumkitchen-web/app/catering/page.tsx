import Image from 'next/image';
import type { Metadata } from 'next';
import { CallPickerButton } from '@/components/CallPickerButton';
import { CateringProof } from '@/components/CateringProof';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { JsonLd } from '@/components/JsonLd';
import { LocationGrid } from '@/components/LocationGrid';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { cateringServiceJsonLd } from '@/lib/schema';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

const cateringFaqs = [
  {
    question: 'how much notice do you need?',
    answer: 'Please give the team 24 hours of notice for most pickup catering orders. For bigger orders or special timing, call your yum! restaurant.',
  },
  {
    question: 'where do orders get picked up?',
    answer: 'Any of the four yum! restaurants: St. Louis Park, Shady Oak in Minnetonka, St. Paul, or Woodbury. Choose your pickup restaurant in the inquiry form.',
  },
  {
    question: 'what kinds of food are available?',
    answer: 'Sandwich platters, boxed lunches, salads, sides, baked goods, and comfort food that travels well.',
  },
  {
    question: 'can you help with gluten or allergy questions?',
    answer: 'Yes. Tell us what you need in the inquiry message, and start with the gluten and allergy menu on the menu page. A yum! team member will follow up.',
  },
  {
    question: 'is parking easy?',
    answer: 'Yes. Easy parking at every location, so pickup stays quick.',
  },
  {
    question: 'who can help with an order?',
    answer: 'Call a real yum! team member at your pickup restaurant, or send the inquiry form and the team will follow up.',
  },
] as const;

const cateringFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: cateringFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.catering.title),
  description: pageMeta.catering.description,
  alternates: { canonical: yumCanonical('/catering') },
  openGraph: yumOpenGraph(pageMeta.catering.image),
  twitter: { images: [pageMeta.catering.image] },
};

export default function CateringPage() {
  return (
    <main>
      <JsonLd data={cateringServiceJsonLd()} />
      <JsonLd data={cateringFaqJsonLd} />
      <Hero
        title="yum! catering"
        copy="Sandwich platters, box lunches, salads, baked goods, and more available for pick up with 24 hour notice. Call with questions."
        image="/images/yum-catering-sandwiches-live.jpg"
        imageAlt="yum! catering sandwich platter"
        priority
      >
        <CallPickerButton />
        <a href="/pdfs/takeout-menu.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
          View Catering Menu
        </a>
      </Hero>
      <CateringProof />
      <section className="bg-white py-section">
        <div className="container-content grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-4/3 overflow-hidden">
            <Image src="/images/yum-catering-platter-steak.jpg" alt="yum! catering trays" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="section-label">for offices, families, and celebrations</p>
            <h2 className="text-h2 lowercase">made from scratch, packed for the room</h2>
            <p className="mt-5 text-xl leading-9">
              Choose sandwich platters, boxed lunches, salads, baked goods, and comfort food that travels well. Tell us the date, guest count, and pickup restaurant, and the team will follow up.
            </p>
          </div>
        </div>
      </section>
      <section id="inquiry" className="bg-page py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">start a catering order</p>
            <h2 className="text-h2 lowercase">tell us what you are planning</h2>
            <p className="mt-5 text-xl leading-9">For best availability, please give the team 24 hours of notice for pickup catering.</p>
          </div>
          <InquiryForm kind="catering" />
        </div>
      </section>
      <InquiryMomentumBand
        title="catering that feels easy to plan"
        copy="Pickup restaurant, food photos, timing, and a simple next step help the planner feel ready."
        primaryHref="/catering#inquiry"
        primaryLabel="Plan Catering"
        secondaryHref="/order"
        secondaryLabel="Order Pickup"
        image="/images/yum-catering-boxed-lunch.jpg"
        imageAlt="yum! boxed catering lunch"
      />
      <section className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="section-label">good to know</p>
            <h2 className="text-h2 lowercase">catering questions, answered</h2>
            <p className="mt-5 text-xl leading-9">The quick answers planners usually call about, so ordering feels easy.</p>
          </div>
          <div className="grid items-start gap-3 md:grid-cols-2">
            {cateringFaqs.map((faq) => (
              <details key={faq.question} className="group border border-ink/15 bg-page p-5">
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
      <LocationGrid />
    </main>
  );
}
