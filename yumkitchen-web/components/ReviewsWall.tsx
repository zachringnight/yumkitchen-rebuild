import type { LocationSlug } from '@/lib/locations';
import {
  approvedCustomerStories,
  locationRatingPlatforms,
  ownedSocialProfiles,
  pressHighlights,
  ratingHeadline,
  ratingPlatforms,
  type RatingProof,
} from '@/lib/reviews';

function Stars({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className={`inline-flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        // Fractional fill: each star shows exactly its share of the rating,
        // so 4.5 renders as four full stars plus a half-filled fifth star.
        const fillRatio = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} aria-hidden="true" className="relative inline-block">
            <span className="opacity-30">★</span>
            {fillRatio > 0 ? (
              <span
                className="absolute left-0 top-0 h-full overflow-hidden"
                style={{ width: `${fillRatio * 100}%` }}
              >
                ★
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function formatVerifiedOn(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function RatingSourceRow({ proof }: { proof: RatingProof }) {
  return (
    <a
      href={proof.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="grid gap-2 border-t border-brand-red/35 py-4 text-ink transition-colors hover:bg-blue-soft/45 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red sm:grid-cols-[1fr_auto] sm:items-center sm:px-3"
    >
      <span>
        <span className="block text-lg font-bold leading-tight text-brand-primary">{proof.platform}</span>
        <span className="mt-1 block text-sm leading-tight text-ink">
          {proof.scope} · verified <time dateTime={proof.verifiedOn}>{formatVerifiedOn(proof.verifiedOn)}</time>
        </span>
        {proof.verificationNote ? <span className="mt-1 block text-sm leading-tight text-ink">{proof.verificationNote}</span> : null}
      </span>
      <span className="flex items-center gap-3 sm:text-right">
        <span className="font-serif text-3xl leading-none text-ink">{proof.value.toFixed(1)}</span>
        <span className="text-base leading-tight text-ink">{proof.count.toLocaleString()} ratings</span>
      </span>
    </a>
  );
}

type ReviewsWallProps = {
  surface?: 'patticake' | 'yum';
  locationSlug?: LocationSlug;
};

export function ReviewsWall({ surface = 'patticake', locationSlug }: ReviewsWallProps) {
  const locationProof = locationSlug ? locationRatingPlatforms[locationSlug] : undefined;
  const proofs = locationProof ? [locationProof] : ratingPlatforms;
  const headline = locationProof
    ? {
        value: locationProof.value,
        sourceCount: locationProof.count.toLocaleString(),
        source: locationProof.platform,
        sourceUrl: locationProof.sourceUrl,
      }
    : ratingHeadline;
  const heading = locationProof
    ? `loved in ${locationProof.scope.toLowerCase()}`
    : surface === 'yum'
      ? 'real love for yum!'
      : 'loved in st. louis park';
  const intro = locationProof
    ? `A current public rating for our ${locationProof.scope} kitchen, linked right to the source.`
    : 'Current public ratings and independent food coverage, with every source one click away.';
  const headingId = `reviews-heading-${locationSlug ?? surface}`;

  return (
    <section className="bg-blue-tint px-6 py-12 lg:py-section" aria-labelledby={headingId} data-reveal>
      <div className="mx-auto max-w-[1240px]">
        <div className="overflow-hidden border-2 border-brand-red lg:grid lg:grid-cols-[0.72fr_1.28fr]">
          <a
            href={headline.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[300px] flex-col justify-center gap-10 bg-brand-primary p-7 text-white transition-colors hover:bg-brand-primary-darker focus:outline-solid focus:outline-4 focus:outline-offset-[-4px] focus:outline-blue-tint sm:p-10"
          >
            <Stars value={headline.value} className="text-2xl text-white" />
            <span>
              <span className="block font-serif text-[clamp(5.5rem,12vw,9rem)] leading-[0.78] tracking-[-0.05em]">
                {headline.value.toFixed(1)}
              </span>
              <span className="mt-5 block max-w-[18rem] text-xl leading-tight text-white">
                from {headline.sourceCount} {headline.source} ratings
              </span>
            </span>
          </a>

          <div className="flex flex-col justify-between bg-blue-tint p-7 sm:p-10 lg:p-12">
            <div>
              <h2 id={headingId} className="max-w-[760px] font-serif text-[clamp(2.7rem,6vw,5.6rem)] leading-[0.96] lowercase text-brand-primary">
                {heading}
              </h2>
              <p className="mt-5 max-w-[680px] text-xl leading-8 text-ink">{intro}</p>
            </div>
            <div className="mt-10 border-b border-brand-red/35">
              {proofs.map((proof) => (
                <RatingSourceRow key={`${proof.platform}-${proof.scope}`} proof={proof} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-14">
          <div>
            <h3 className="font-serif text-[clamp(2.25rem,4vw,4rem)] leading-none lowercase text-brand-primary">independent food coverage</h3>
            <p className="mt-4 max-w-[28rem] text-lg leading-7 text-ink">Plain, attributed proof. Every item opens the original story.</p>
          </div>
          <div className="border-b-2 border-brand-red">
            {pressHighlights.map((item) => (
              <a
                key={item.outlet}
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid gap-2 border-t-2 border-brand-red py-5 text-ink transition-colors hover:bg-blue-soft/45 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red sm:grid-cols-[1fr_auto] sm:items-baseline sm:px-3"
              >
                <span className="font-serif text-2xl leading-snug">{item.statement}</span>
                <span className="text-sm font-bold uppercase tracking-[0.1em] text-brand-primary">{item.outlet}</span>
              </a>
            ))}
          </div>
        </div>

        {approvedCustomerStories.length > 0 ? (
          <div className="mt-12 border-y-2 border-brand-red py-8" aria-label="Approved customer stories">
            {approvedCustomerStories.map((story) => (
              <figure key={story.id} className="grid gap-3 py-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <blockquote className="max-w-[850px] font-serif text-3xl leading-snug text-ink">&ldquo;{story.content}&rdquo;</blockquote>
                <figcaption className="text-base text-brand-primary">
                  {story.creator}, {story.platform}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-6 bg-brand-primary px-7 py-7 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[680px] font-serif text-3xl leading-tight lowercase text-white">follow along with what is coming out of the kitchen</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {ownedSocialProfiles.map((profile) => (
              <a
                key={profile.platform}
                href={profile.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-white underline decoration-2 underline-offset-4 transition-colors hover:text-blue-tint focus:outline-solid focus:outline-2 focus:outline-offset-4 focus:outline-blue-tint"
              >
                {profile.platform} {profile.handle}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
