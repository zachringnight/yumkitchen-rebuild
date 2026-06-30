import type { Metadata } from 'next';
import { CallPickerButton } from '@/components/CallPickerButton';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { JsonLd } from '@/components/JsonLd';
import { LocationGrid } from '@/components/LocationGrid';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { contactPageJsonLd } from '@/lib/schema';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.contact.title,
  description: pageMeta.contact.description,
  alternates: { canonical: '/contact' },
  openGraph: { images: [pageMeta.contact.image] },
  twitter: { images: [pageMeta.contact.image] },
};

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={contactPageJsonLd()} />
      <Hero
        title="we'd love to hear from you"
        copy="Call a location, send us a note, or tell us how we can help. Someone from yum! will get back to you soon."
        image="/images/yum-mixed-berry-salad.png"
        imageAlt="yum! mixed berry salad"
        priority
      >
        <CallPickerButton />
      </Hero>
      <section className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">contact us</p>
            <h2 className="text-h2 lowercase">send us a note</h2>
            <p className="mt-5 text-xl leading-9">For online ordering questions, call the location directly. For general notes, use the form and we will get it to the right person.</p>
          </div>
          <InquiryForm kind="contact" />
        </div>
      </section>
      <InquiryMomentumBand
        title="choose the quickest way to reach us"
        copy="For ordering questions, the quickest move is a direct call to the pickup kitchen. For everything else, send a note and we’ll get it to the right person."
        primaryHref="/yum-kitchen#locations"
        primaryLabel="Find a Location"
        secondaryHref="/order"
        secondaryLabel="Start Order"
        image="/images/yum-chef-kitchen.jpg"
        imageAlt="yum! chef in the kitchen"
      />
      <LocationGrid />
    </main>
  );
}
