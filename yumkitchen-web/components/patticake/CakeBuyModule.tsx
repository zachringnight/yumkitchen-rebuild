'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import { cakes, findVariant, formatUsd, occasions, type CakeFormat } from '@/lib/patticake/catalog';

const patticake = cakes.find((cake) => cake.signature) ?? cakes[0];
const moreCakes = cakes.filter((cake) => cake.slug !== patticake.slug);

export function CakeBuyModule() {
  const { addItem } = useCart();
  const [format, setFormat] = useState<CakeFormat>('whole');
  const [occasion, setOccasion] = useState<string>(occasions[0]);
  const [qty, setQty] = useState(1);
  const variant = findVariant(patticake, format) ?? patticake.variants[0];

  return (
    <section id="national-order" className="scroll-mt-20 bg-blue-tint px-6 py-12 lg:py-section">
      <div className="mx-auto max-w-[1240px]">
        <p className="section-label text-ink">nationwide delivery</p>
        <h2 className="text-h2 lowercase text-brand-primary">send a patticake</h2>

        <div className="mt-8 grid overflow-hidden border-y border-brand-primary/35 bg-white lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[420px] bg-blue-soft lg:min-h-[680px]">
            <Image
              src={patticake.image}
              alt={patticake.imageAlt}
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col bg-blue-tint p-6 sm:p-8 lg:p-10">
            <div className="border-b border-brand-primary/45 pb-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-primary">the signature</p>
              <h3 className="mt-2 font-serif text-[clamp(2.5rem,4vw,4rem)] font-normal lowercase leading-none text-ink">
                patticake
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-8 text-ink">{patticake.description}</p>
            </div>

            <fieldset className="mt-7">
              <legend className="font-sans text-sm font-bold uppercase tracking-[0.1em] text-ink">choose a size</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {patticake.variants.map((option) => {
                  const active = option.format === format;
                  return (
                    <button
                      key={option.format}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFormat(option.format)}
                      className={`min-h-32 border p-4 text-left transition focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red ${
                        active
                          ? 'border-brand-primary bg-white shadow-[inset_0_4px_0_var(--color-brand-red)]'
                          : 'border-blue-soft bg-white/70 hover:border-brand-primary hover:bg-white'
                      }`}
                    >
                      <span className="block font-serif text-2xl lowercase leading-none text-ink">{option.label}</span>
                      <span className="mt-2 block text-sm leading-5 text-body">{option.serves}</span>
                      <span className="mt-2 block font-serif text-xl text-brand-primary">{formatUsd(option.price)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="field mt-7 block">
              <span>what&apos;s the occasion?</span>
              <select className="!bg-white" value={occasion} onChange={(event) => setOccasion(event.target.value)}>
                {occasions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-7 grid gap-3 sm:grid-cols-[auto_1fr]">
              <div className="flex items-center border border-brand-primary/45 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="h-14 w-12 text-2xl leading-none text-ink hover:bg-blue-tint focus:outline-solid focus:outline-2 focus:outline-brand-primary"
                >
                  −
                </button>
                <span className="w-10 text-center font-sans text-lg font-bold text-ink" aria-live="polite">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((value) => Math.min(24, value + 1))}
                  className="h-14 w-12 text-2xl leading-none text-ink hover:bg-blue-tint focus:outline-solid focus:outline-2 focus:outline-brand-primary"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => addItem({ cakeSlug: patticake.slug, format, occasion, qty })}
                className="btn-primary min-h-14 w-full px-6 py-4"
                data-event="click_patticake_add_to_cart"
                data-source="cake_buy_module"
              >
                Add to box · {formatUsd(variant.price * qty)}
              </button>
            </div>

            <div className="mt-7 border-t border-brand-primary/45 pt-5">
              <p className="font-sans text-base font-bold text-ink">nationwide delivery available</p>
              <p className="mt-1 text-base leading-7 text-ink">Choose the delivery date, address, and gift message at checkout.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-primary/40 pt-6">
          <h3 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-normal lowercase leading-tight text-ink">more cakes from yum!</h3>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {moreCakes.map((cake) => (
              <article key={cake.slug} className="grid border-b border-brand-primary/35 pb-6 sm:grid-cols-[150px_1fr] sm:gap-6">
                <div className="relative aspect-square overflow-hidden border border-brand-primary/25 bg-white">
                  <Image src={cake.image} alt={cake.imageAlt} fill sizes="150px" className="object-cover" />
                </div>
                <div className="pt-4 sm:pt-1">
                  <h4 className="font-serif text-3xl font-normal lowercase leading-none text-ink">{cake.name}</h4>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.1em] text-brand-primary">{cake.tagline}</p>
                  <p className="mt-3 text-base leading-7 text-ink">{cake.description}</p>
                  <Link href="/order-a-cake#cake-inquiry" className="btn-link mt-4 inline-block">
                    plan local pickup
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
