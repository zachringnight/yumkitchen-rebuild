'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { formatUsd } from '@/lib/patticake/catalog';

export default function ConfirmationPage() {
  const router = useRouter();
  const { lastOrder, reorder } = useCart();

  if (!lastOrder) {
    return (
      <main className="bg-cream">
        <section className="container-content py-section text-center">
          <p className="section-label">order</p>
          <h1 className="text-h2 lowercase">no recent order</h1>
          <Link href="/patticake#national-order" className="btn-primary mt-6">
            Send a cake
          </Link>
        </section>
      </main>
    );
  }

  const deliveryLabel = lastOrder.deliveryDate
    ? new Date(`${lastOrder.deliveryDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  return (
    <main className="bg-cream">
      <section className="bg-blue-tint px-6 py-section">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-red text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="section-label mt-5 text-ink">order placed</p>
          <h1 className="text-h2 lowercase">the cake is on its way</h1>
          <p className="mt-4 text-xl leading-9 text-ink">
            Order <span className="font-bold">{lastOrder.orderNumber}</span>. A confirmation is headed to {lastOrder.senderEmail}.
          </p>
          <p className="mt-2 inline-block bg-white/70 px-3 py-1 text-sm font-medium text-ink">
            Demo order. No card was charged.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:py-section">
        <div className="mx-auto grid max-w-[900px] gap-8 lg:grid-cols-2">
          <div className="border border-ink/12 bg-white p-6">
            <h2 className="font-serif text-2xl lowercase text-ink">arriving {deliveryLabel}</h2>
            <ul className="mt-4 grid gap-4">
              {lastOrder.recipients.map((r) => (
                <li key={r.id} className="border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                  <p className="font-sans text-base font-bold text-ink">{r.name}</p>
                  <p className="text-base leading-7 text-body">
                    {r.address1}{r.address2 ? `, ${r.address2}` : ''}, {r.city}, {r.state} {r.zip}
                  </p>
                </li>
              ))}
            </ul>
            {lastOrder.giftMessage && (
              <div className="mt-5 border-l-4 border-brand-red bg-cream p-4">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-primary">gift note</p>
                <p className="mt-1 font-serif text-lg italic leading-8 text-ink">&ldquo;{lastOrder.giftMessage}&rdquo;</p>
              </div>
            )}
          </div>

          <div className="border border-ink/12 bg-white p-6">
            <h2 className="font-serif text-2xl lowercase text-ink">what you sent</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {lastOrder.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-base text-ink">
                    <span className="font-serif text-lg lowercase">{item.name}</span> · {item.formatLabel} × {item.qty}
                  </span>
                  <span className="font-sans text-base font-bold text-ink">{formatUsd(item.unitPrice * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid gap-2 border-t border-ink/15 pt-4 text-base text-ink">
              <div className="flex justify-between"><dt className="text-body">Subtotal</dt><dd>{formatUsd(lastOrder.itemsSubtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-body">Shipping</dt><dd>{formatUsd(lastOrder.shipping)}</dd></div>
              <div className="flex justify-between border-t border-ink/15 pt-2 font-serif text-2xl"><dt>Total</dt><dd>{formatUsd(lastOrder.total)}</dd></div>
            </dl>
            <button
              type="button"
              onClick={() => {
                reorder(lastOrder);
                router.push('/patticake/checkout');
              }}
              className="btn-secondary mt-5 w-full"
            >
              Reorder this
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[900px] text-center">
          <Link href="/patticake#national-order" className="btn-primary">
            Send another cake
          </Link>
        </div>
      </section>
    </main>
  );
}
