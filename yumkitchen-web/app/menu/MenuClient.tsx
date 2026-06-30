'use client';

import { useEffect, useMemo, useState } from 'react';
import { MenuMotionIntro } from '@/components/MenuMotionIntro';
import { getMenuSearchText, getPriceLabel, menu, menuDisclosure } from '@/lib/menu';

const anchors = [
  { href: '#lunch-dinner', label: 'Lunch & Dinner' },
  { href: '#breakfast', label: 'Breakfast' },
  { href: '#bakery', label: 'Bakery' },
  { href: '/catering', label: 'Catering' },
  { href: '/pdfs/gf-allergy-menu.pdf', label: 'Gluten & Allergens', external: true },
  { href: '/pdfs/takeout-menu.pdf', label: 'Printable Menu', external: true },
] as const;

const searchSuggestions = ['salmon', 'breakfast', 'soup', 'sandwiches', 'cookies'] as const;

function sectionId(name: string, meal: string) {
  if (name === 'appetizers') return 'lunch-dinner';
  if (name === 'pies, bars & cookies') return 'bakery';
  return name.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || meal;
}

export function MenuClient() {
  const [query, setQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('lunch-dinner');
  const displayedQuery = query.trim();
  const normalizedQuery = displayedQuery.toLowerCase();
  const sections = useMemo(() => {
    if (!normalizedQuery) return menu.sections;
    return menu.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => getMenuSearchText(item, section).includes(normalizedQuery)),
      }))
      .filter((section) => section.items.length > 0);
  }, [normalizedQuery]);
  const visibleItemCount = sections.reduce((sum, section) => sum + section.items.length, 0);
  const sectionLinks = useMemo(
    () =>
      sections.map((section) => ({
        id: sectionId(section.name, section.meal),
        label: section.name,
        meal: section.meal,
        count: section.items.length,
      })),
    [sections],
  );
  const currentActiveSectionId = sectionLinks.some((section) => section.id === activeSectionId)
    ? activeSectionId
    : sectionLinks[0]?.id ?? '';

  useEffect(() => {
    if (sectionLinks.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSectionId(visible.target.id);
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0.1, 0.25, 0.5] },
    );
    for (const link of sectionLinks) {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sectionLinks]);

  return (
    <>
      <section className="bg-cream py-10 lg:py-16">
        <div className="container-content">
          <h1 className="text-display lowercase">fresh and friendly food</h1>
          <p className="mt-5 max-w-2xl text-xl leading-9">Serving made-from-scratch seasonal food for lunch, dinner, bakery, catering, and takeout.</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.5fr]">
            <nav className="flex flex-wrap items-start gap-3" aria-label="Menu sections">
              {anchors.map((anchor) => {
                const isExternal = 'external' in anchor && anchor.external;
                return (
                  <a
                    key={anchor.label}
                    href={anchor.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="btn-secondary px-5 py-3"
                  >
                    {anchor.label}
                  </a>
                );
              })}
            </nav>
            <div className="grid gap-2">
              <label className="field">
                <span>Search menu</span>
                <span className="flex gap-2">
                  <input className="min-w-0 flex-1" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search soup, salad, bakery..." />
                  {query && (
                    <button type="button" className="btn-secondary shrink-0 px-4 py-3 text-base" onClick={() => setQuery('')}>
                      Clear
                    </button>
                  )}
                </span>
              </label>
              <p className="break-words text-sm font-bold uppercase tracking-[0.14em] text-ink/75" aria-live="polite">
                {normalizedQuery ? `${visibleItemCount} result${visibleItemCount === 1 ? '' : 's'} for "${displayedQuery}"` : `${visibleItemCount} menu items across lunch, dinner, and bakery`}
              </p>
              <div className="flex flex-wrap gap-2" aria-label="Popular menu searches">
                {searchSuggestions.map((suggestion) => {
                  const selected = normalizedQuery === suggestion;
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      className={`border px-3 py-2 text-base leading-none transition ${
                        selected ? 'border-brand-primary bg-brand-primary text-white' : 'border-ink/25 bg-white text-ink hover:border-brand-red'
                      }`}
                      aria-pressed={selected}
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MenuMotionIntro />

      <section className="bg-page py-12 lg:py-section">
        <div className="container-content">
          {sectionLinks.length > 0 && (
            <nav className="menu-section-rail sticky top-[72px] z-30 -mx-6 mb-8 border-y border-blue-soft/60 bg-blue-tint/95 px-6 py-3 backdrop-blur md:mx-0 md:border md:bg-white/95" aria-label="Menu category jump list">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sectionLinks.map((section) => (
                  <a
                    key={`${section.meal}-${section.id}`}
                    href={`#${section.id}`}
                    aria-current={currentActiveSectionId === section.id ? 'true' : undefined}
                    className={`shrink-0 border px-3 py-2 text-base font-bold leading-none lowercase transition ${
                      currentActiveSectionId === section.id
                        ? 'border-brand-red bg-brand-red text-white'
                        : 'border-ink/20 bg-white text-ink hover:border-brand-red'
                    }`}
                  >
                    {section.label}
                    <span className="ml-2 text-sm font-normal opacity-80">{section.count}</span>
                  </a>
                ))}
              </div>
            </nav>
          )}
          <div className="grid gap-10">
            {sections.map((section) => (
              <section key={`${section.meal}-${section.name}`} id={sectionId(section.name, section.meal)} className="scroll-mt-28 border-t border-ink/15 pt-8">
                <p className="section-label">{section.meal}</p>
                <h2 className="text-h2 lowercase">{section.name}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {section.items.map((item, index) => (
                    <article key={`${section.meal}-${section.name}-${item.name}-${index}`} className="bg-white p-5 shadow-xs">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl lowercase">{item.name}</h3>
                        <p className="shrink-0 font-bold text-ink">{getPriceLabel(item.prices)}</p>
                      </div>
                      {item.description && <p className="mt-2 text-base leading-7">{item.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 border-t border-ink/15 pt-6">
            <p className="max-w-3xl text-base leading-7 text-body">{menuDisclosure}</p>
          </div>
          {sections.length === 0 && (
            <div className="bg-white p-8 text-center">
              <h2 className="text-h3 lowercase">no menu items found</h2>
              <p className="mt-2">Try a broader search or clear the field to see the full menu.</p>
              <button type="button" className="btn-primary mt-5" onClick={() => setQuery('')}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
