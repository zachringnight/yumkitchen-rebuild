import Image from 'next/image';
import Link from 'next/link';

export function SummerTakeoutBand() {
  return (
    <section className="bg-blue-tint/70 py-section" data-reveal>
      <div className="container-content grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="section-label">take it outside</p>
          <h2 className="text-h2 lowercase">lake days, office days, and backyard dinners</h2>
          <p className="mt-5 max-w-2xl text-xl leading-9 text-ink">
            The same favorites that work for lunch also travel beautifully: sandwiches, salads, soups, bakery, and branded boxes that make pickup feel considered.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/order" className="btn-primary">
              Start an Order
            </Link>
            <Link href="/catering" className="btn-secondary">
              Plan Catering
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
          <div className="relative aspect-square overflow-hidden bg-white shadow-xs">
            <Image src="/images/social-take-it-to-lake.jpg" alt="yum! take it to the lake summer graphic" fill sizes="(min-width: 1024px) 24vw, 50vw" className="object-cover" />
          </div>
          <div className="relative min-h-[340px] overflow-hidden bg-white shadow-xl">
            <Image src="/images/social-picnic-perfect.jpg" alt="yum! picnic lunch with sandwich, fruit, chips, and branded takeout box" fill sizes="(min-width: 1024px) 42vw, 100vw" className="image-lift object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
