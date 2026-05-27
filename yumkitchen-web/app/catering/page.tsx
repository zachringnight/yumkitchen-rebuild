import Image from 'next/image';
import type { Metadata } from 'next';
import { CallPickerButton } from '@/components/CallPickerButton';
import { CateringProof } from '@/components/CateringProof';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { LocationGrid } from '@/components/LocationGrid';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.catering.title,
  description: pageMeta.catering.description,
  alternates: { canonical: '/catering' },
  openGraph: { images: [pageMeta.catering.image] },
};

export default function CateringPage() {
  return (
    <main>
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
              Choose sandwich platters, boxed lunches, salads, baked goods, and comfort food that travels well. Tell us the date, guest count, and pickup location, and the team will follow up.
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
        copy="Pickup location, real food photography, notice timing, and a clear follow-up path help the planner feel ready before they submit."
        primaryHref="/catering#inquiry"
        primaryLabel="Start Inquiry"
        secondaryHref="/order"
        secondaryLabel="Order Pickup"
        image="/images/yum-catering-boxed-lunch.jpg"
        imageAlt="yum! boxed catering lunch"
      />
      <LocationGrid />
    </main>
  );
}
