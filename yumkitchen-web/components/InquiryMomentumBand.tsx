import Image from 'next/image';
import Link from 'next/link';

type InquiryMomentumBandProps = {
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  image: string;
  imageAlt: string;
};

export function InquiryMomentumBand({
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  image,
  imageAlt,
}: InquiryMomentumBandProps) {
  return (
    <section className="inquiry-momentum bg-blue-tint/70 py-section text-ink" data-reveal>
      <div className="container-content grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
        <div>
          <p className="section-label">fast path</p>
          <h2 className="text-h2 lowercase text-ink">{title}</h2>
          <p className="mt-5 max-w-2xl text-xl leading-9 text-ink">{copy}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={primaryHref} className="btn-primary">
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel && (
              <Link href={secondaryHref} className="border-2 border-body px-7 py-3.5 text-center font-sans text-lg font-bold uppercase tracking-[0.06em] text-ink transition hover:border-brand-red hover:bg-brand-red hover:text-white">
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
        <div className="inquiry-momentum-frame">
          <Image src={image} alt={imageAlt} fill loading="eager" sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          <div className="inquiry-momentum-badge" aria-hidden="true">
            <span>yum!</span>
            <span>real team, real food</span>
          </div>
        </div>
      </div>
    </section>
  );
}
