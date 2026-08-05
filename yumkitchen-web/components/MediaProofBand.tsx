import Link from 'next/link';
import { mediaHighlights } from '@/lib/site';
import { ratingHeadline } from '@/lib/reviews';

// One confident proof band, sized to stay under a single screen. The 2026-08
// audit measured press + ratings at 2,281px on /patticake, 1.6x the buy
// module; a press kit was crowding out the product. This keeps the two
// citations that describe the cake itself and the one number that carries
// real weight, and sends everything else to /in-the-news.
const cakeCitations = mediaHighlights.filter((item) => item.category === 'bakery and desserts');

export function MediaProofBand() {
  return (
    <section className="bg-cream px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto max-w-[1240px]">
        <div className="overflow-hidden border-2 border-brand-red lg:grid lg:grid-cols-[0.62fr_1.38fr]">
          <a
            href={ratingHeadline.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[240px] flex-col justify-center gap-4 bg-brand-primary p-7 text-white transition-colors hover:bg-brand-primary-darker focus:outline-solid focus:outline-4 focus:outline-offset-[-4px] focus:outline-blue-tint sm:p-10"
          >
            <span className="block font-serif text-[clamp(4.5rem,9vw,7rem)] leading-[0.78] tracking-[-0.05em]">
              {ratingHeadline.value.toFixed(1)}
            </span>
            <span className="block max-w-[18rem] text-xl leading-tight text-white">
              from {ratingHeadline.sourceCount} {ratingHeadline.source} ratings
            </span>
          </a>

          <div className="flex flex-col justify-between bg-white p-7 sm:p-10">
            <div>
              <p className="section-label">people are talking</p>
              <h2 className="text-h2 lowercase text-ink">the cake people write about</h2>
            </div>
            <div className="mt-8 border-b border-brand-red/35">
              {cakeCitations.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid gap-2 border-t border-brand-red/35 py-5 text-ink transition-colors hover:bg-blue-soft/45 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red sm:grid-cols-[1fr_auto] sm:items-baseline sm:px-3"
                >
                  <span className="font-serif text-2xl leading-snug">{item.summary}</span>
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-brand-primary">{item.outlet}</span>
                </a>
              ))}
            </div>
            <Link href="/in-the-news" className="btn-link mt-7 inline-block">
              View Press Highlights
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
