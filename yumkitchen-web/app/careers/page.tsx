import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.careers.title),
  description: pageMeta.careers.description,
  alternates: { canonical: yumCanonical('/careers') },
  openGraph: yumOpenGraph(pageMeta.careers.image),
  twitter: { images: [pageMeta.careers.image] },
};

export default function CareersPage() {
  return (
    <main>
      <Hero
        title="come join us"
        copy="We love what we do. We are looking for happy people who care about food, guests, and each other."
        image="/images/yum-chef-team.jpg"
        imageAlt="yum! restaurant team"
        priority
      />
      <section className="bg-white py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">work @ yum!</p>
            <h2 className="text-h2 lowercase">kind, committed, and happy people</h2>
            <p className="mt-5 text-xl leading-9">
              We are looking for people who are excited about hospitality. Help us share the love on the culinary team, bakery, counter, and dining room.
            </p>
          </div>
          <InquiryForm kind="careers" />
        </div>
      </section>
      <InquiryMomentumBand
        title="come see the room you could join"
        copy="Real food, kind people, and a warm invitation to apply."
        primaryHref="/careers"
        primaryLabel="Apply Now"
        secondaryHref="/about"
        secondaryLabel="Meet Yum"
        image="/images/yum-dining-room.jpg"
        imageAlt="yum! dining room"
      />
    </main>
  );
}
