import type { Metadata } from 'next';
import Link from 'next/link';
import { yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle('page not found'),
  description: 'Find yum! Kitchen and Bakery menu, ordering, restaurants, and contact pages.',
  openGraph: yumOpenGraph('/og/default.jpg'),
  robots: { index: false, follow: true },
  twitter: { images: ['/og/default.jpg'] },
};

export default function NotFound() {
  return (
    <main className="bg-cream">
      <section className="container-content py-16 md:py-24">
        <p className="section-label">404</p>
        <h1 className="mt-2 font-serif text-[2.4rem] font-normal leading-tight lowercase text-ink md:text-[3.2rem]">
          we could not find that page
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-body">
          The page may have moved or the link may be out of date. Here are a few good places to land instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/order" prefetch={false} className="btn-primary">
            Order Online
          </Link>
          <Link href="/menu" prefetch={false} className="btn-secondary">
            Browse Menu
          </Link>
          <Link href="/yum-kitchen#locations" prefetch={false} className="btn-secondary">
            Find a Restaurant
          </Link>
        </div>
        <p className="mt-10 text-base leading-7 text-body">
          Still stuck? Visit the <Link href="/" prefetch={false} className="btn-link">homepage</Link> or our{' '}
          <Link href="/contact" prefetch={false} className="btn-link">contact page</Link>.
        </p>
      </section>
    </main>
  );
}
