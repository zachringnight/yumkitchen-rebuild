'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import { cakes, findVariant, formatUsd, occasions, type CakeFormat } from '@/lib/patticake/catalog';

export function CakeBuyModule() {
  const { addItem } = useCart();
  const [activeSlug, setActiveSlug] = useState(cakes[0].slug);
  const [format, setFormat] = useState<CakeFormat>('whole');
  const [occasion, setOccasion] = useState<string>(occasions[0]);
  const [qty, setQty] = useState(1);

  const cake = cakes.find((c) => c.slug === activeSlug) ?? cakes[0];
  const variant = findVariant(cake, format) ?? cake.variants[0];

  return (
    <section id="national-order" className="bg-cream px-6 py-12 lg:py-section">
      <div className="mx-auto max-w-[1240px]">
        <p className="section-label">order online</p>
        <h2 className="text-h2 lowercase">send a cake in a few taps</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden border border-ink/10 bg-blue-soft">
              <Image
                key={cake.image}
                src={cake.image}
                alt={cake.imageAlt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            {cake.signature && (
              <p className="mt-3 border-t border-brand-primary/30 pt-3 text-sm font-bold uppercase tracking-[0.12em] text-brand-primary">
                the signature
              </p>
            )}
          </div>

          <div className="border border-ink/12 bg-white p-6 lg:p-8">
            {/* Cake picker: toggle buttons, not tabs - no tabpanel or arrow-key
                semantics here, so aria-pressed matches the size picker below */}
            <div className="grid gap-2" role="group" aria-label="Choose a cake">
              {cakes.map((c) => {
                const active = c.slug === activeSlug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveSlug(c.slug)}
                    className={`flex items-center justify-between border px-4 py-3 text-left transition focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red ${
                      active ? 'border-brand-primary bg-cream' : 'border-ink/15 bg-page hover:border-brand-red'
                    }`}
                  >
                    <span>
                      <span className="font-serif text-2xl lowercase leading-none text-ink">{c.name}</span>
                      <span className="mt-1 block text-sm leading-tight text-body">{c.tagline}</span>
                    </span>
                    {active && <span aria-hidden="true" className="text-brand-primary">●</span>}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-base leading-7 text-body">{cake.description}</p>

            {/* Format */}
            <fieldset className="mt-6">
              <legend className="font-sans text-sm font-medium text-ink">Choose a size</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {cake.variants.map((v) => {
                  const active = v.format === format;
                  return (
                    <button
                      key={v.format}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFormat(v.format)}
                      className={`border px-4 py-3 text-left transition focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red ${
                        active ? 'border-brand-primary bg-cream' : 'border-ink/15 bg-page hover:border-brand-red'
                      }`}
                    >
                      <span className="block font-sans text-base font-bold text-ink">{v.label}</span>
                      <span className="mt-0.5 block text-sm leading-tight text-body">{v.serves}</span>
                      <span className="mt-1 block font-serif text-xl text-ink">{formatUsd(v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Occasion */}
            <label className="field mt-6 block">
              <span>What&apos;s the occasion?</span>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                {occasions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            {/* Qty + add */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-ink/20 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-12 w-12 text-2xl leading-none text-ink hover:bg-cream focus:outline-solid focus:outline-2 focus:outline-brand-primary"
                >
                  −
                </button>
                <span className="w-10 text-center font-sans text-lg font-bold text-ink">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(24, q + 1))}
                  className="h-12 w-12 text-2xl leading-none text-ink hover:bg-cream focus:outline-solid focus:outline-2 focus:outline-brand-primary"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => addItem({ cakeSlug: cake.slug, format, occasion, qty })}
                className="btn-primary grow px-6 py-4"
                data-event="click_patticake_add_to_cart"
                data-source="cake_buy_module"
              >
                Add to box · {formatUsd(variant.price * qty)}
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-body">
              Shipped nationwide with a delivery date and gift message set at checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
