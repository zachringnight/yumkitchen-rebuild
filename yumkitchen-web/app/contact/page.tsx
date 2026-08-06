import Link from 'next/link';
import type { Metadata } from 'next';
import { CallPickerButton } from '@/components/CallPickerButton';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { LocationGrid } from '@/components/LocationGrid';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { contactPageJsonLd } from '@/lib/schema';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.contact.title),
  description: pageMeta.contact.description,
  alternates: { canonical: yumCanonical('/contact') },
  openGraph: yumOpenGraph(pageMeta.contact.image),
  twitter: { images: [pageMeta.contact.image] },
};

const paths = [
  {
    title: 'ordering and today’s pickup',
    copy: 'Calling your restaurant is the fastest way to get an answer about an order, hours, or something happening today.',
    cta: 'call' as const,
  },
  {
    title: 'catering and events',
    copy: 'Boxed lunches, party trays, and office spreads have their own page with menus and an event form.',
    href: '/catering',
    label: 'Plan Catering',
  },
  {
    title: 'press and media',
    copy: 'Working on a story? Use the note form below with the subject "Press" and we will route it to the right person.',
    href: '#contact-form',
    label: 'Send a Press Note',
  },
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={contactPageJsonLd()} />
      <Hero
        title="we'd love to hear from you"
        copy="Calling your restaurant is the fastest way to reach us. For everything else, pick a path below and we will get your note to the right person."
        // The original site's contact page ran this photo (site archive,
        // contact.html); a wayfinding image fits "reach us" better than the
        // salad that sat here.
        image="/images/yum-sign-brick.jpg"
        imageAlt="the round red yum! sign mounted on a brick storefront"
        objectPosition="center 40%"
        priority
      >
        <CallPickerButton />
      </Hero>
      <section className="bg-cream py-section">
        <div className="container-content">
          <p className="section-label">start here</p>
          <h2 className="text-h2 lowercase">pick the quickest path</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {paths.map((path) => (
              <div key={path.title} className="flex flex-col border-t border-ink/15 pt-5">
                <h3 className="font-serif text-2xl font-normal lowercase text-ink">{path.title}</h3>
                <p className="mt-3 flex-1 text-lg leading-8 text-body">{path.copy}</p>
                <div className="mt-5">
                  {path.cta === 'call' ? (
                    <CallPickerButton label="Call a Restaurant" variant="secondary" />
                  ) : (
                    <Link href={path.href} className="btn-secondary">
                      {path.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact-form" className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">contact us</p>
            <h2 className="text-h2 lowercase">send us a note</h2>
            <p className="mt-5 text-xl leading-9">Use the form for general notes, feedback, and press. We read everything and get it to the right person.</p>
          </div>
          <InquiryForm kind="contact" />
        </div>
      </section>
      <LocationGrid />
    </main>
  );
}
