'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { locations, type LocationSlug } from '@/lib/locations';
import { orderDemoItems } from '@/lib/site';
import { usePreferredLocation } from '@/lib/usePreferredLocation';
import { OpenStatus } from '@/components/OpenStatus';

type Cart = Record<string, number>;

const orderSearchSuggestions = ['salmon', 'sandwich', 'salad', 'soup', 'bakery'] as const;

const orderCategoryFilters = [
  { value: 'all', label: 'all favorites' },
  { value: 'breakfast', label: 'breakfast' },
  { value: 'entree', label: 'entrees' },
  { value: 'sandwich', label: 'sandwiches' },
  { value: 'salad', label: 'salads' },
  { value: 'soup', label: 'soups' },
  { value: 'bakery', label: 'bakery' },
] as const;

type OrderCategory = (typeof orderCategoryFilters)[number]['value'];

const orderCategoryValues = new Set<OrderCategory>(orderCategoryFilters.map((filter) => filter.value));

function isOrderCategory(value: string | null): value is OrderCategory {
  return Boolean(value && orderCategoryValues.has(value as OrderCategory));
}

type Props = {
  initialCategory?: string;
  initialQuery?: string;
};

export function OrderClient({ initialCategory, initialQuery = '' }: Props) {
  const requestedCategory = initialCategory ?? null;
  const initialSelectedCategory: OrderCategory = isOrderCategory(requestedCategory) ? requestedCategory : 'all';
  const { slug: selectedSlug, location: selectedLocation, setSlug: setSelectedSlug } = usePreferredLocation();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<OrderCategory>(initialSelectedCategory);
  const [cart, setCart] = useState<Cart>({});
  const [lastAdded, setLastAdded] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const items = useMemo(() => {
    return orderDemoItems.filter((item) => {
      const matchesQuery = !normalizedQuery || [item.name, item.category, item.description].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [normalizedQuery, selectedCategory]);

  const cartEntries = orderDemoItems
    .map((item) => ({ item, quantity: cart[item.name] ?? 0 }))
    .filter((entry) => entry.quantity > 0);
  const cartCount = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = cartEntries.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  function addItem(name: string) {
    setCart((current) => ({ ...current, [name]: (current[name] ?? 0) + 1 }));
    setLastAdded(name);
  }

  function removeItem(name: string) {
    setCart((current) => {
      const nextQuantity = Math.max((current[name] ?? 0) - 1, 0);
      const next = { ...current, [name]: nextQuantity };
      if (nextQuantity === 0) delete next[name];
      return next;
    });
  }

  function clearOrder() {
    setCart({});
    setLastAdded('');
  }

  function chooseCategory(category: OrderCategory) {
    setSelectedCategory(category);
    const url = new URL(window.location.href);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function chooseLocation(slug: LocationSlug) {
    setSelectedSlug(slug);
  }

  return (
    <main>
      <section className="bg-cream py-14 lg:py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <h1 className="text-display lowercase">start your yum! order</h1>
            <p className="mt-5 max-w-2xl text-xl leading-9">
              Choose your pickup restaurant, browse a few favorites, and we&apos;ll send you to the right checkout.
            </p>
          </div>
          <div className="accent-card bg-white p-6 shadow-xl">
            <p className="section-label">current pickup restaurant</p>
            <h2 className="text-h3 lowercase">{selectedLocation.name}</h2>
            <p className="mt-2 text-lg leading-8">{selectedLocation.address.street}</p>
            <p className="text-lg leading-8">
              {selectedLocation.address.city}, {selectedLocation.address.state} {selectedLocation.address.zip}
            </p>
            <OpenStatus className="mt-3 text-lg leading-8 text-body" />
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#favorites" className="btn-primary">
                Browse Favorites
              </a>
              <a href={selectedLocation.order_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" data-event="click_order_online" data-location={selectedLocation.slug} data-source="order_page_hero">
                Continue to Checkout
              </a>
              <a href={selectedLocation.maps_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="order-momentum bg-white py-section" data-reveal>
        <div className="container-content grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="section-label">order online</p>
            <h2 className="text-h2 lowercase">choose your restaurant, then order what sounds good</h2>
            <p className="mt-5 text-xl leading-9">
              Choose your pickup restaurant and browse favorites. When you are ready, we&apos;ll send you to the right checkout.
            </p>
            <div className="mt-7 grid gap-3">
              {['choose pickup restaurant once', 'browse favorites or the full menu', 'finish your order'].map((step, index) => (
                <div key={step} className="order-step-row">
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-momentum-board">
            <div className="order-location-ticket">
              <p className="section-label">pickup</p>
              <h3>{selectedLocation.short_name}</h3>
              <OpenStatus compact />
            </div>
            {orderDemoItems.slice(0, 4).map((item, index) => (
              <div key={item.name} className={`order-photo-chip order-photo-chip-${index + 1}`}>
                <Image src={item.image} alt={item.name} fill sizes="220px" className="object-cover" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="favorites" className="bg-cream py-section">
        <div className="container-content grid gap-8 xl:grid-cols-[280px_1fr_330px]">
          <aside className="grid content-start gap-3 md:grid-cols-2 xl:sticky xl:top-28 xl:grid-cols-1">
            <p className="section-label">choose pickup</p>
            {locations.map((loc) => (
              <button
                key={loc.slug}
                type="button"
                onClick={() => chooseLocation(loc.slug)}
                aria-pressed={loc.slug === selectedSlug}
                className={`border p-4 text-left transition ${
                  loc.slug === selectedSlug ? 'border-brand-primary bg-white shadow-lg' : 'border-ink/10 bg-white hover:border-brand-red'
                }`}
              >
                <span className="block font-serif text-2xl lowercase text-ink">{loc.short_name}</span>
                <OpenStatus compact className="mt-1 block text-base leading-6 text-body" />
              </button>
            ))}
          </aside>

          <section>
            <div className="bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <label className="field md:min-w-[360px]">
                  <span>Search favorites</span>
                  <span className="flex gap-2">
                    <input className="min-w-0 flex-1" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search salmon, soup, cookie..." />
                    {query && (
                      <button type="button" className="btn-secondary shrink-0 px-4 py-3 text-base" onClick={() => setQuery('')}>
                        Clear
                      </button>
                    )}
                  </span>
                </label>
                <Link href="/menu" className="btn-secondary">
                  Full Menu
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink/75" aria-live="polite">
                  {items.length} favorite{items.length === 1 ? '' : 's'} shown
                </p>
                {lastAdded && <p className="text-base font-bold text-brand-primary" aria-live="polite">Added {lastAdded}</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Favorite searches">
                {orderSearchSuggestions.map((suggestion) => {
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
              <div className="order-filter-row" role="group" aria-label="Favorite types">
                {orderCategoryFilters.map((filter) => {
                  const selected = selectedCategory === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      className={`border px-3 py-2 text-base leading-none transition ${
                        selected ? 'border-brand-primary bg-brand-primary text-white' : 'border-ink/25 bg-white text-ink hover:border-brand-red'
                      }`}
                      aria-pressed={selected}
                      onClick={() => chooseCategory(filter.value)}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="stagger-reveal mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2" data-reveal>
              {items.map((item) => {
                const quantity = cart[item.name] ?? 0;
                return (
                  <article key={item.name} className="accent-card grid gap-4 bg-white p-4 shadow-xs sm:grid-cols-[132px_1fr]">
                    <div className="relative aspect-square overflow-hidden bg-cream">
                      <Image src={item.image} alt={item.name} fill sizes="132px" className="image-lift object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary-deep">{item.category}</p>
                          <h2 className="mt-1 text-2xl lowercase">{item.name}</h2>
                        </div>
                        <p className="font-bold text-ink">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-2 text-base leading-7">{item.description}</p>
                      {quantity > 0 && <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-primary">{quantity} in order</p>}
                      <button
                        type="button"
                        className="btn-primary mt-auto px-4 py-2 text-sm"
                        onClick={() => addItem(item.name)}
                        aria-label={quantity > 0 ? `Add another ${item.name}` : `Add ${item.name}`}
                      >
                        {quantity > 0 ? 'Add Another' : 'Add'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {items.length === 0 && (
              <div className="mt-6 bg-white p-8 text-center">
                <h2 className="text-h3 lowercase">no favorites found</h2>
                <p className="mt-2">Try a broader search or open the full menu.</p>
                <button
                  type="button"
                  className="btn-primary mt-5"
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Show All Favorites
                </button>
              </div>
            )}
          </section>

          <aside className="accent-card bg-white p-6 shadow-xl xl:sticky xl:top-28">
            <p className="section-label">your favorites</p>
            <h2 className="text-h3 lowercase" aria-live="polite">{cartCount} favorite{cartCount === 1 ? '' : 's'} selected</h2>
            <div className="mt-2 border-t border-ink/10 pt-3 text-base leading-7">
              <p className="font-bold text-ink">Pickup at {selectedLocation.short_name}</p>
              <OpenStatus compact />
            </div>
            <div className="mt-5 grid gap-4">
              {cartEntries.length === 0 ? (
                <p className="text-lg leading-8">Add a favorite to plan ahead.</p>
              ) : (
                cartEntries.map(({ item, quantity }) => (
                  <div key={item.name} className="border-t border-ink/10 pt-4">
                    <div className="flex justify-between gap-4">
                      <p className="font-bold text-ink">{item.name}</p>
                      <p>${(item.price * quantity).toFixed(2)}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" className="h-9 w-9 border border-ink/25 text-xl" onClick={() => removeItem(item.name)} aria-label={`Remove ${item.name}`}>
                        -
                      </button>
                      <span className="min-w-8 text-center font-bold">{quantity}</span>
                      <button type="button" className="h-9 w-9 border border-ink/25 text-xl" onClick={() => addItem(item.name)} aria-label={`Add ${item.name}`}>
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 border-t border-ink/15 pt-5">
              <div className="flex justify-between text-xl font-bold text-ink">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {cartCount > 0 && (
                <button type="button" className="btn-secondary mt-5 w-full px-4 py-3 text-base" onClick={clearOrder}>
                  Clear Favorites
                </button>
              )}
              <a href={selectedLocation.order_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full" data-event="click_order_online" data-location={selectedLocation.slug} data-source="order_page_favorites">
                Finish Your Order
              </a>
              <p className="mt-3 text-sm leading-6">You can add more, confirm pickup time, and pay on the next screen.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
