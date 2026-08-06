import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { JsonLd } from '@/components/JsonLd';
import { aboutPageJsonLd } from '@/lib/schema';
import { leaderCards, pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.about.title),
  description: pageMeta.about.description,
  alternates: { canonical: yumCanonical('/about') },
  openGraph: yumOpenGraph(pageMeta.about.image),
  twitter: { images: [pageMeta.about.image] },
};

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={aboutPageJsonLd()} />
      <Hero
        title="made from scratch since 2005"
        copy="Led by Patti and Robbie Soskin and a dedicated team, yum! is built around generous food, warm hospitality, and taking good care of people."
        image="/images/yum-dining-room.jpg"
        imageAlt="guests dining inside yum!"
        objectPosition="center 60%"
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
          {/* Provenance: the original yumkitchen.com about page ran this exact
              portrait (Yum_0467.jpg) beside "Led by Patti and Robbie Soskin",
              verified 2026-08-05 against the site archive's about.html. Patti's
              identity is cross-confirmed against the labeled photo that
              previously sat here (now only in PatticakeOriginBand). */}
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden bg-cream">
              <Image src="/images/yum-founders-patti-robbie.jpg" alt="founders Patti and Robbie Soskin, arm in arm" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-base leading-7 text-body">founders Patti and Robbie Soskin</figcaption>
          </figure>
        </div>
      </section>
      <section className="bg-cream py-section">
        <div className="container-content">
          <p className="section-label">behind the counter</p>
          <h2 className="text-h2 lowercase">people who make the room feel like yum!</h2>
          {/* Four cards since Patti joined the grid: 2x2 at md, one row at lg. */}
          <div className="stagger-reveal mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4" data-reveal>
            {leaderCards.map((leader) => {
              const body = (
                <>
                  {leader.image && (
                    <div className="relative aspect-4/3 overflow-hidden bg-cream">
                      <Image src={leader.image} alt={leader.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="image-lift object-cover" />
                    </div>
                  )}
                  <div className="p-7">
                    <h3 className="text-h3 lowercase">{leader.name}</h3>
                    <p className="mt-2 text-lg leading-8">{leader.role}</p>
                    {leader.href && <span className="btn-link mt-4 inline-block">Visit Location</span>}
                  </div>
                </>
              );

              // A card only becomes a link when it points at a real location
              // page. Without that, "Visit Location" is a dead click, which
              // reads worse than a plain card.
              return leader.href ? (
                <Link key={leader.name} href={leader.href} className="accent-card group bg-white shadow-xs">
                  {body}
                </Link>
              ) : (
                <div key={leader.name} className="accent-card bg-white shadow-xs">
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* The parade film: cut 2026-08-05 from the owned "Yum! Parade v1.mov"
          (media-for-review archive), a professionally shot community parade
          with a "thank you for a decade of yum!" banner. Copy sits in its own
          column per the motion rules; the video runs unobstructed. Reduced
          motion hides the video and leaves the poster (globals.css). */}
      <section className="bg-white py-section" data-reveal>
        <div className="container-content grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-center">
          <div>
            <p className="section-label">from the neighborhood</p>
            <h2 className="text-h2 lowercase">ten years in, the neighborhood threw a parade</h2>
            <p className="mt-5 text-xl leading-9">
              A banner that read &ldquo;thank you for a decade of yum!&rdquo;, balloons, a fire truck, and the team marching down the street. This is the part of the story no menu can tell.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden bg-cream shadow-xl">
            <Image
              src="/images/yum-parade-poster.jpg"
              alt="the yum! anniversary parade: a thank-you banner carried down the street"
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover"
            />
            <video
              className="parade-film-video absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/yum-parade-poster.jpg"
            >
              <source src="/videos/yum-parade-decade.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <InquiryMomentumBand
        title="family-owned hospitality, made visible"
        copy="People, food, local stories, and four neighborhood restaurants all point to the same promise: made from scratch with love."
        primaryHref="/in-the-news"
        primaryLabel="Read Stories"
        secondaryHref="/order"
        secondaryLabel="Order Now"
        image="/images/yum-packaging-counter.jpg"
        imageAlt="yum! takeout packaging at the counter"
      />
    </main>
  );
}
