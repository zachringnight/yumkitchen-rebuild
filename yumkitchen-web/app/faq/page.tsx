import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteSiteUrl, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle('frequently asked questions'),
  description: 'Answers about ordering, Patticake delivery, cakes, catering, hours, locations, and allergens at yum! Kitchen and Bakery.',
  alternates: { canonical: yumCanonical('/faq') },
  openGraph: yumOpenGraph('/og/default.jpg'),
  twitter: { images: ['/og/default.jpg'] },
};

const faqSections = [
  {
    heading: 'ordering a cake',
    items: [
      { q: 'Can I order a Patticake online?', a: 'Yes. Choose your cake, add a delivery date and gift message, and check out. Send it nationwide, or pick up locally at any of our four Twin Cities restaurants.' },
      { q: 'How does cake shipping work?', a: 'Pick a delivery date at checkout and we bake fresh and ship it ready to share. Add a gift note and we tuck it right in.' },
      { q: 'Can I send cakes to more than one person?', a: 'Yes. At checkout you can send the same cake to several addresses at once — handy for teams, family, and thank-yous.' },
      { q: 'What cakes can I choose from?', a: 'Patticake, our signature triple-layer chocolate cake with vanilla buttercream, plus Baker’s Man and Coconut Cake. For custom and wedding cakes, start a cake inquiry and our team will follow up.' },
    ],
  },
  {
    heading: 'catering',
    items: [
      { q: 'What does catering include?', a: 'Sandwich platters, box lunches, salads, baked goods, and more, ready for pickup with 24-hour notice.' },
      { q: 'How do I plan a bigger event?', a: 'Start a catering note or call your nearest yum! and we’ll help you sort out the details.' },
    ],
  },
  {
    heading: 'visiting yum!',
    items: [
      { q: 'Where are you located?', a: 'Four Twin Cities metro locations: St. Louis Park, Shady Oak in Minnetonka, St. Paul, and Woodbury. Each one is easy to find and easy to park.' },
      { q: 'What are your hours?', a: 'Our restaurants are open daily. Check your location page for current hours before you head over.' },
      { q: 'How do I order for pickup?', a: 'Order online from your nearest location, or stop in at the counter. Breakfast, lunch, dinner, and the bakery case are all ready to go.' },
    ],
  },
  {
    heading: 'allergens and questions',
    items: [
      { q: 'Do you have allergen information?', a: 'For allergy questions, please review the current allergen information and call the location before ordering. Our team is happy to help you choose carefully.' },
      { q: 'Who do I call with a question?', a: 'Reach out through our contact page or call your nearest location directly. We’re happy to help.' },
    ],
  },
] as const;

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  ),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'yum! Kitchen and Bakery', item: absoluteSiteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: absoluteSiteUrl('/faq') },
  ],
};

export default function FaqPage() {
  return (
    <main className="bg-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-cream px-6 py-section">
        <div className="container-content">
          <h1 className="text-display lowercase">frequently asked questions</h1>
          <p className="mt-5 max-w-2xl text-xl leading-9 text-body">
            Ordering, delivery, cakes, catering, hours, and more. Still need a hand? We&apos;re happy to help.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[1000px] gap-12">
          {faqSections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-h2 lowercase">{section.heading}</h2>
              <div className="mt-5 grid gap-3">
                {section.items.map((item) => (
                  <details key={item.q} className="group border border-ink/12 bg-white p-5 open:border-brand-red">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-2xl lowercase text-ink marker:content-['']">
                      {item.q}
                      <span aria-hidden="true" className="text-2xl text-brand-primary transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-4 text-lg leading-8 text-body">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-[1000px] flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">
            Contact us
          </Link>
          <Link href="/patticake#national-order" className="btn-secondary">
            Ship a Cake
          </Link>
        </div>
      </section>
    </main>
  );
}
