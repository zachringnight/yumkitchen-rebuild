import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.careers.title,
  description: pageMeta.careers.description,
  alternates: { canonical: '/careers' },
  openGraph: { images: [pageMeta.careers.image] },
};

export default function CareersPage() {
  return (
    <main>
      <Hero
        title="come join us"
        copy="We love what we do. We look forward to investing in happy people who make yum! a great place to work and eat. We are hiring!"
        image="/images/hero-sandwich.jpg"
        imageAlt="yum! sandwiches and food"
        priority
      />
      <section className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">work @ yum!</p>
            <h2 className="text-h2 lowercase">kind, committed, and happy people</h2>
            <p className="mt-5 text-xl leading-9">
              We are looking for people who are excited about hospitality. Help us share the love in the kitchen, bakery, counter, dining room, and leadership teams.
            </p>
          </div>
          <InquiryForm kind="careers" />
        </div>
      </section>
      <InquiryMomentumBand
        title="show applicants the kind of room they are joining"
        copy="Real food, clear expectations, and a warm path to apply make the opportunity more tangible."
        primaryHref="/careers"
        primaryLabel="Apply Now"
        secondaryHref="/about"
        secondaryLabel="Meet Yum"
        image="/images/about-food.jpg"
        imageAlt="yum! food spread"
      />
    </main>
  );
}
