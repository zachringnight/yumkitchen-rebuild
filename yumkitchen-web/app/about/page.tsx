import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { leaderCards, pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.about.title,
  description: pageMeta.about.description,
  alternates: { canonical: '/about' },
  openGraph: { images: [pageMeta.about.image] },
};

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="made from scratch since 2005"
        copy="Led by Patti and Robbie Soskin and a dedicated team, yum! is built around generous food, warm hospitality, and taking good care of people."
        image="/images/yum-dining-room.jpg"
        imageAlt="guests dining inside yum!"
        priority
      />
      <section className="bg-white py-section">
        <div className="container-content grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="section-label">we&apos;re here to share the love</p>
            <h2 className="text-h2 lowercase">family roots, everyday hospitality</h2>
            <div className="prose-yum mt-6">
              <p>
                Patti and Robbie Soskin built yum! around food that feels cared for: soups, salads, sandwiches, bakery, cakes, and the take-home meals people come back to again and again.
              </p>
              <p className="mt-5">Food is how we love people up. On good days and other days, alone or with many, food feeds our soul.</p>
              <p className="mt-5">That trust shows up in the food, the people, the locations, and the warmth behind the counter.</p>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden bg-page">
            <Image src="/images/yum-packaging-counter.jpg" alt="yum! takeout packaging at the counter" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
      <section className="bg-cream py-section">
        <div className="container-content">
          <p className="section-label">behind the counter</p>
          <h2 className="text-h2 lowercase">people who make the room feel like yum!</h2>
          <div className="stagger-reveal mt-8 grid gap-5 md:grid-cols-3" data-reveal>
            {leaderCards.map((leader) => (
              <Link key={leader.name} href={leader.href} className="accent-card group bg-white shadow-xs">
                <div className="relative aspect-4/3 overflow-hidden bg-page">
                  <Image src={leader.image} alt={leader.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="image-lift object-cover" />
                </div>
                <div className="p-7">
                  <h3 className="text-h3 lowercase">{leader.name}</h3>
                  <p className="mt-2 text-lg leading-8">{leader.role}</p>
                  <span className="btn-link mt-4 inline-block">Visit Location</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <InquiryMomentumBand
        title="family-owned hospitality, made visible"
        copy="People, food, press recognition, and four neighborhood kitchens all point to the same promise: made from scratch with love."
        primaryHref="/in-the-news"
        primaryLabel="See Recognition"
        secondaryHref="/order"
        secondaryLabel="Order Now"
        image="/images/yum-patti-kelli.jpeg"
        imageAlt="Patti and Kelli at yum!"
      />
    </main>
  );
}
