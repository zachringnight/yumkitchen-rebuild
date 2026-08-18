'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import { formatUsd } from '@/lib/patticake/catalog';

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, itemCount, itemsSubtotal, updateQty, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(closeDrawer);

  useEffect(() => {
    closeRef.current = closeDrawer;
  }, [closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const lastActive = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeRef.current();
      if (e.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
      lastActive?.focus();
    };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-[60] flex justify-end bg-ink/45"
      onClick={closeDrawer}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="motion-role-modal flex h-full w-full max-w-[440px] flex-col border-l-4 border-brand-red bg-blue-tint outline-hidden"
      >
        <div className="flex items-center justify-between border-b border-brand-primary/35 px-6 py-5">
          <h2 id="cart-drawer-heading" className="font-serif text-3xl font-normal lowercase leading-none text-brand-primary">
            your cake box
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center border border-brand-primary/35 bg-white text-ink hover:bg-brand-red hover:text-white focus:outline-solid focus:outline-2 focus:outline-brand-primary"
          >
            <span aria-hidden="true" className="text-3xl leading-none">×</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-serif text-3xl lowercase text-brand-primary">your box is empty</p>
            <p className="text-base leading-7 text-ink">Add a Patticake and we&apos;ll help it travel ready to share.</p>
            <Link href="/patticake#national-order" onClick={closeDrawer} className="btn-primary mt-2">
              Browse cakes
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-brand-primary/25 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.id} className="grid grid-cols-[76px_1fr] gap-4 py-5">
                  <div className="relative aspect-square overflow-hidden border border-ink/10 bg-blue-soft">
                    <Image src={item.image} alt={item.name} fill sizes="76px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-xl lowercase leading-tight text-ink">{item.name}</p>
                        <p className="text-sm leading-tight text-body">
                          {item.formatLabel} · {item.occasion}
                        </p>
                      </div>
                      <p className="whitespace-nowrap font-sans text-base font-bold text-ink">
                        {formatUsd(item.unitPrice * item.qty)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-ink/20 bg-white">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="h-9 w-9 text-xl leading-none text-ink hover:bg-blue-tint focus:outline-solid focus:outline-2 focus:outline-brand-primary"
                        >
                          −
                        </button>
                        <span className="w-9 text-center font-sans text-base font-bold text-ink">{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name}`}
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="h-9 w-9 text-xl leading-none text-ink hover:bg-blue-tint focus:outline-solid focus:outline-2 focus:outline-brand-primary"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-brand-primary underline-offset-2 hover:underline"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t-4 border-brand-red bg-white px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-brand-primary">
                  subtotal ({itemCount})
                </span>
                <span className="font-serif text-2xl text-ink">{formatUsd(itemsSubtotal)}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-body">Shipping, date, cake words, and gift note are set at checkout.</p>
              <Link href="/patticake/checkout" onClick={closeDrawer} className="btn-primary mt-4 w-full">
                Checkout
              </Link>
              <button type="button" onClick={closeDrawer} className="btn-link mt-3 w-full text-center">
                keep shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
