import Link from 'next/link';
import { mediaHighlights } from '@/lib/site';

const proofChips = ['Mpls.St.Paul Magazine', 'Star Tribune', 'Eater Twin Cities', 'KSTP', 'Woodbury Magazine'] as const;

export function MediaProofBand() {
  const featured = mediaHighlights.slice(0, 5);

  return (
    <section className="bg-ink py-section text-cream" data-reveal>
      <div className="container-content">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="section-label text-blue-soft">outside validation</p>
            <h2 className="text-h2 lowercase text-cream">recognized by people who know food here</h2>
            <p className="mt-5 max-w-2xl text-xl leading-9 text-cream">
              The strongest proof is bigger than one mention: local food writers, TV segments, and Twin Cities publications keep returning to yum! for bakery, hospitality, and neighborhood staying power.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {proofChips.map((chip) => (
              <span key={chip} className="border border-cream/30 px-3 py-2 text-sm font-bold uppercase tracking-[0.12em] text-cream">
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="stagger-reveal mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {featured.map((item) => (
            <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="accent-card bg-white/8 p-5 transition hover:bg-white/13">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-soft">{item.outlet}</p>
              <h3 className="mt-3 font-serif text-2xl lowercase leading-tight text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-cream">{item.summary}</p>
              <span className="mt-5 inline-block text-lg font-normal leading-snug text-blue-tint hover:underline">Read Source</span>
            </a>
          ))}
        </div>
        <Link href="/in-the-news" className="btn-primary mt-9">
          View Press Highlights
        </Link>
      </div>
    </section>
  );
}
