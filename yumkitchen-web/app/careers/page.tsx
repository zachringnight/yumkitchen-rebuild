import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { locations } from '@/lib/locations';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.careers.title),
  description: pageMeta.careers.description,
  alternates: { canonical: yumCanonical('/careers') },
  openGraph: yumOpenGraph(pageMeta.careers.image),
  twitter: { images: [pageMeta.careers.image] },
};

const teams = ['culinary team', 'bakery', 'counter', 'dining room'];

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
        <div className="container-content">
          <div className="max-w-3xl">
            <p className="section-label">work @ yum!</p>
            <h2 className="text-h2 lowercase">kind, committed, and happy people</h2>
            <p className="mt-5 text-xl leading-9">
              We are looking for people who are excited about hospitality. Help us share the love on the culinary team, bakery, counter, and dining room.
            </p>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-h3 lowercase">teams you could join</h3>
              <ul className="mt-4">
                {teams.map((team) => (
                  <li key={team} className="border-t border-ink/15 py-3 font-sans text-lg text-ink">
                    {team}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-lg leading-8">
                Openings change through the year. Send an application below and tell us where you fit.
              </p>
              <div className="relative mt-8 aspect-4/3 overflow-hidden bg-cream">
                <Image
                  src="/images/yum-kitchen-stockpot.jpg"
                  alt="a yum! cook working the range, stockpot steaming, the line busy behind"
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-h3 lowercase">we hire at all four restaurants</h3>
              <ul className="mt-4">
                {locations.map((loc) => (
                  <li key={loc.slug} className="border-t border-ink/15 py-3">
                    <Link
                      href={`/location/${loc.slug}`}
                      className="font-sans text-lg lowercase text-ink hover:text-brand-primary hover:underline"
                    >
                      {loc.name}
                    </Link>
                    <p className="font-sans text-base text-body">
                      {loc.address.street}, {loc.address.city}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="apply" className="bg-cream py-section">
        <div className="container-content">
          <div className="max-w-3xl">
            <p className="section-label">apply</p>
            <h2 className="text-h2 lowercase">tell us about yourself</h2>
            <p className="mt-5 text-xl leading-9">
              The application takes a few minutes. Pick the restaurant closest to you and we will get your note to the right person.
            </p>
          </div>
          <div className="mt-10 max-w-4xl">
            <InquiryForm kind="careers" />
          </div>
        </div>
      </section>
      <InquiryMomentumBand
        title="come meet the people you would work with"
        copy="Real food, kind people, and a team that will teach you the rest."
        primaryHref="/careers#apply"
        primaryLabel="Apply Now"
        secondaryHref="/about"
        secondaryLabel="Meet Yum"
        image="/images/yum-team-jacob-doug.jpg"
        imageAlt="two yum! chefs in whites and red caps, arm over shoulder, outside the restaurant on a snowy morning"
      />
    </main>
  );
}
