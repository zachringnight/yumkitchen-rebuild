import type { Metadata } from 'next';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { LocationGrid } from '@/components/LocationGrid';
import { PressExplorer } from '@/components/PressExplorer';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.news.title,
  description: pageMeta.news.description,
  alternates: { canonical: '/in-the-news' },
  openGraph: { images: [pageMeta.news.image] },
};

export default function NewsPage() {
  return (
    <main>
      <section className="bg-cream py-section">
        <div className="container-content">
          <h1 className="text-display lowercase">yum! in the news</h1>
          <p className="mt-5 max-w-3xl text-xl leading-9">
            A curated view of awards, critic mentions, TV segments, founder stories, community moments, and expansion coverage from Twin Cities media.
          </p>
        </div>
      </section>
      <PressExplorer />
      <InquiryMomentumBand
        title="recognized by people who know food here"
        copy="Guests can scan the proof, understand the signature items, and move directly into menu, catering, or ordering."
        primaryHref="/menu"
        primaryLabel="Browse Menu"
        secondaryHref="/catering"
        secondaryLabel="Plan Catering"
        image="/images/social-key-lime-pie.jpg"
        imageAlt="yum! key lime pie"
      />
      <LocationGrid />
    </main>
  );
}
