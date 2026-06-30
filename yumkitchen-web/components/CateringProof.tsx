import Image from 'next/image';
import Link from 'next/link';
import { cateringPackages, cateringProof } from '@/lib/site';

export function CateringProof() {
  return (
    <section className="bg-white py-section" data-reveal>
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">catering made easier</p>
            <h2 className="text-h2 lowercase">food people are happy to gather around</h2>
            <p className="mt-5 text-xl leading-9">
              Sandwiches, salads, bakery sweets, and comfort food that travel well for meetings, celebrations, and family tables.
            </p>
            <div className="mt-7 grid gap-3">
              {cateringProof.map((item) => (
                <div key={item} className="flex items-start gap-3 border-t border-ink/10 pt-3">
                  <span aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 bg-brand-primary" />
                  <p className="text-lg font-bold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="stagger-reveal grid gap-5 md:grid-cols-3">
            {cateringPackages.map((item) => (
              <article key={item.title} className="accent-card bg-page shadow-xs">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 20vw, 100vw" className="image-lift object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-2xl lowercase">{item.title}</h3>
                  <p className="mt-2 text-base leading-7">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/catering#inquiry" className="btn-primary">
            Plan Catering
          </Link>
          <a href="/pdfs/takeout-menu.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            View Catering Menu
          </a>
        </div>
      </div>
    </section>
  );
}
