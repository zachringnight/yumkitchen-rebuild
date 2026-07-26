'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LocationPickerModal } from '@/components/LocationPickerModal';
import { MenuMotionIntro } from '@/components/MenuMotionIntro';
import { OpenStatus } from '@/components/OpenStatus';
import { getMenuSearchText, getPriceLabel, menu, menuDisclosure } from '@/lib/menu';
import { usePreferredLocation } from '@/lib/usePreferredLocation';

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
  const { location } = usePreferredLocation();
  const [query, setQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('lunch-dinner');
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const displayedQuery = query.trim();
  const normalizedQuery = displayedQuery.toLowerCase();
  const favoritesHref = normalizedQuery ? `/order?q=${encodeURIComponent(displayedQuery)}#favorites` : '/order#favorites';
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
          <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div className="grid gap-5">
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
            <aside className="border border-ink/15 bg-white p-5 shadow-[0_0.8rem_2.2rem_rgb(45_45_45_/_0.08)]" aria-label="Pickup actions">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="section-label mb-2">pickup restaurant</p>
                  <h2 className="font-serif text-4xl font-normal lowercase leading-none text-ink">{location.short_name}</h2>
                </div>
                <button type="button" className="btn-secondary px-4 py-3 text-base" onClick={() => setLocationPickerOpen(true)}>
                  Change Restaurant
                </button>
              </div>
              <OpenStatus className="mt-3 text-base leading-7 text-body" />
              <p className="mt-4 text-base leading-7 text-body">
                Browse what sounds good, then start pickup from {location.short_name}.
              </p>
              <div className="mt-5 grid gap-2">
                <a
                  href={location.order_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center"
                  data-event="click_order_online"
                  data-location={location.slug}
                  data-source="menu_order_panel"
                >
                  Order from {location.short_name}
                </a>
                <Link href={favoritesHref} prefetch={false} className="btn-secondary text-center">
                  Start with Favorites
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <LocationPickerModal open={locationPickerOpen} onClose={() => setLocationPickerOpen(false)} mode="select" selectedSlug={location.slug} />

      <MenuMotionIntro />

      <section className="bg-cream py-12 lg:py-section">
        <div className="container-content">
          {sectionLinks.length > 0 && (
            <nav className="menu-section-rail sticky top-[72px] z-30 -mx-6 mb-8 border-y border-blue-soft/60 bg-blue-tint/95 px-6 py-3 backdrop-blur md:mx-0 md:border md:bg-white/95" aria-label="Menu sections">
              <div className="menu-section-scroll flex gap-2 overflow-x-auto pb-1">
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
                    <article key={`${section.meal}-${section.name}-${item.name}-${index}`} className="menu-item-card flex gap-4 bg-white p-5 shadow-xs">
                      {item.image && (
                        <div className="relative size-24 shrink-0 overflow-hidden bg-cream sm:size-28">
                          <Image src={item.image} alt={item.imageAlt ?? item.name} fill sizes="112px" className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {/* Wraps rather than forcing one line: multi-price items such as
                            "$7.95 / $8.95 / $16.95" cannot shrink, and alongside a
                            thumbnail they pushed the mobile page into sideways scroll. */}
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                          <h3 className="menu-item-title text-2xl lowercase">{item.name}</h3>
                          <p className="menu-item-price font-bold text-ink">{getPriceLabel(item.prices)}</p>
                        </div>
                        {item.description && <p className="menu-item-description mt-2 text-base leading-7">{item.description}</p>}
                      </div>
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
