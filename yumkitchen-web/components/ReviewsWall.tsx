import { pressPullQuotes, ratingHeadline, ratingPlatforms, sampleReviews } from '@/lib/reviews';

function Stars({ value, className = '' }: { value: number; className?: string }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value} out of 5 stars`} className={`inline-flex gap-0.5 text-brand-red ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className={i < full ? 'opacity-100' : 'opacity-25'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewsWall() {
  return (
    <section className="bg-white px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">people love it</p>
            <h2 className="text-h2 lowercase">loved across the twin cities</h2>
            <div className="mt-5 flex items-center gap-4">
              <span className="font-serif text-6xl leading-none text-ink">{ratingHeadline.value.toFixed(1)}</span>
              <span>
                <Stars value={ratingHeadline.value} className="text-2xl" />
                <span className="mt-1 block text-base leading-tight text-body">
                  from {ratingHeadline.sourceCount} {ratingHeadline.source} reviews
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {ratingPlatforms.map((p) => (
              <div key={p.platform} className="border border-ink/15 bg-page px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-primary">{p.platform}</p>
                <p className="mt-1 font-serif text-2xl leading-none text-ink">
                  {p.value.toFixed(1)} <span className="text-brand-red">★</span>
                </p>
                <p className="mt-1 text-sm leading-tight text-body">{p.count.toLocaleString()} reviews</p>
              </div>
            ))}
          </div>
        </div>

        {/* Press pull-quotes (attributed) */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pressPullQuotes.map((q) => (
            <figure key={q.outlet} className="border-l-4 border-brand-red bg-cream p-5">
              <blockquote className="font-serif text-xl leading-snug text-ink">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-brand-primary">{q.outlet}</figcaption>
            </figure>
          ))}
        </div>

        {/* Customer reviews (sample until live reviews connect) */}
        <div className="stagger-reveal mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sampleReviews.map((r) => (
            <article key={r.name} className="border border-ink/12 bg-page p-5">
              <Stars value={r.rating} />
              <p className="mt-3 text-base leading-7 text-ink">&ldquo;{r.text}&rdquo;</p>
              <p className="mt-4 text-sm font-bold text-brand-primary">{r.name}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-body">Live Google and Yelp reviews sync at launch. Sample reviews shown for layout.</p>
      </div>
    </section>
  );
}
