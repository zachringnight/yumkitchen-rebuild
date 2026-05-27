'use client';

import { useMemo, useState } from 'react';
import { mediaHighlights, pressCategories, pressEntries, type PressCategory } from '@/lib/site';

const allFilter = 'all';
type ActiveFilter = typeof allFilter | PressCategory;

export function PressExplorer() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(allFilter);

  const featuredItems = useMemo(() => {
    return activeFilter === allFilter ? mediaHighlights : mediaHighlights.filter((entry) => entry.category === activeFilter);
  }, [activeFilter]);

  const archiveItems = useMemo(() => {
    return activeFilter === allFilter ? pressEntries : pressEntries.filter((entry) => entry.category === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <section className="bg-white py-section">
        <div className="container-content">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="section-label">featured recognition</p>
              <h2 className="text-h2 lowercase">the proof points to lead with</h2>
              <p className="mt-4 text-xl leading-9">
                The best mentions are grouped by what they prove: restaurant staying power, bakery authority, founder story, community, and neighborhood growth.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end" aria-label="Filter press entries">
              <button
                type="button"
                aria-pressed={activeFilter === allFilter}
                onClick={() => setActiveFilter(allFilter)}
                className={`border px-3 py-2 text-sm font-bold uppercase tracking-[0.12em] transition ${
                  activeFilter === allFilter ? 'border-brand-red bg-brand-red text-white' : 'border-ink/20 bg-white text-ink hover:border-brand-red'
                }`}
              >
                all
              </button>
              {pressCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeFilter === category}
                  onClick={() => setActiveFilter(category)}
                  className={`border px-3 py-2 text-sm font-bold uppercase tracking-[0.12em] transition ${
                    activeFilter === category ? 'border-brand-red bg-brand-red text-white' : 'border-ink/20 bg-white text-ink hover:border-brand-red'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="stagger-reveal mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-reveal>
            {featuredItems.map((entry) => (
              <article key={entry.title} className="accent-card bg-page p-6">
                <p className="section-label">{entry.category}</p>
                <h3 className="text-h3 lowercase">{entry.title}</h3>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-ink">
                  {entry.outlet} / {entry.date}
                </p>
                <p className="mt-4 text-lg leading-8">{entry.summary}</p>
                <a href={entry.href} target="_blank" rel="noopener noreferrer" className="btn-link mt-5 inline-block">
                  Read Source
                </a>
              </article>
            ))}
          </div>

          {featuredItems.length === 0 && (
            <div className="mt-8 border border-ink/10 bg-page p-8">
              <h3 className="text-h3 lowercase">no featured cards in this group</h3>
              <p className="mt-3 text-lg leading-8">The archive below still includes supporting mentions for this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-page py-section">
        <div className="container-content">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-3xl">
              <p className="section-label">archive</p>
              <h2 className="text-h2 lowercase">more yum! media moments</h2>
            </div>
            <p className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-ink/70">
              {archiveItems.length} item{archiveItems.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {archiveItems.map((entry) => (
              <article key={entry.headline} className="border border-ink/10 bg-white p-6">
                <p className="section-label">{entry.category}</p>
                <h3 className="text-h3 lowercase">{entry.headline}</h3>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-ink">
                  {entry.outlet} / {entry.date}
                </p>
                <a href={entry.href} target="_blank" rel="noopener noreferrer" className="btn-link mt-5 inline-block">
                  Read More
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
