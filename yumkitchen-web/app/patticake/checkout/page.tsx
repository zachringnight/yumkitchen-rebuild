'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { m } from 'motion/react';
import { useCart, type Recipient } from '@/lib/cart/CartContext';
import { formatUsd } from '@/lib/patticake/catalog';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { snap } from '@/components/motion/springs';

type DraftRecipient = Omit<Recipient, 'id'>;

// All 50 states + DC; the module ships nationwide. MN stays the default.
const US_STATES = [
  'MN', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN',
  'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV',
  'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY',
];

function blankRecipient(): DraftRecipient {
  return { name: '', address1: '', address2: '', city: '', state: 'MN', zip: '' };
}

function minDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemsSubtotal, updateQty, removeItem, recipients: savedRecipients, saveRecipient, shippingFor, submitOrder } = useCart();

  const [recipients, setRecipients] = useState<DraftRecipient[]>([blankRecipient()]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const minDate = useMemo(() => minDeliveryDate(), []);
  const shipping = shippingFor(recipients.length);
  const total = itemsSubtotal + shipping;

  function setRecipient(index: number, patch: Partial<DraftRecipient>) {
    setRecipients((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function usableSaved(): Recipient[] {
    return savedRecipients.filter((s) => !recipients.some((r) => r.name === s.name && r.zip === s.zip));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    recipients.forEach((r, i) => {
      if (!r.name.trim()) next[`r${i}-name`] = 'Add a recipient name';
      if (!r.address1.trim()) next[`r${i}-address1`] = 'Add a street address';
      if (!r.city.trim()) next[`r${i}-city`] = 'Add a city';
      if (!/^\d{5}$/.test(r.zip.trim())) next[`r${i}-zip`] = 'Enter a 5-digit ZIP';
    });
    if (!deliveryDate) next.deliveryDate = 'Choose a delivery date';
    if (!senderName.trim()) next.senderName = 'Add your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(senderEmail.trim())) next.senderEmail = 'Enter a valid email';
    if (card.number.replace(/\s/g, '').length < 15) next.cardNumber = 'Enter a card number';
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) next.cardExp = 'MM/YY';
    if (card.cvc.length < 3) next.cardCvc = 'CVC';
    if (!card.name.trim()) next.cardName = 'Name on card';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first?.focus();
      return false;
    }
    return true;
  }

  async function placeOrder() {
    if (!validate()) return;
    setSubmitting(true);
    const savedIds = recipients.map((r) => saveRecipient(r));
    await submitOrder({
      recipients: savedIds,
      deliveryDate,
      giftMessage,
      senderName,
      senderEmail,
    });
    router.push('/patticake/checkout/confirmation');
  }

  if (items.length === 0) {
    return (
      <main className="bg-blue-tint">
        <section className="container-content py-section text-center">
          <p className="section-label">checkout</p>
          <h1 className="text-h2 lowercase text-brand-primary">your box is empty</h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-ink">Add a Patticake and it will show up here, ready to send.</p>
          <Link href="/patticake#national-order" className="btn-primary mt-6">
            Browse cakes
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-blue-tint">
      <section className="border-b border-brand-primary/35 bg-blue-tint px-6 py-8">
        <Reveal className="mx-auto max-w-[1180px]" y={12}>
          <p className="section-label">checkout</p>
          <h1 className="text-h2 lowercase text-brand-primary">send your cake</h1>
          <p className="mt-5 max-w-2xl border-y border-brand-primary/40 bg-white px-4 py-3 text-base font-bold leading-7 text-ink">
            <span className="text-brand-primary">Demo checkout.</span> No payment is processed and no card is charged.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-10 lg:grid-cols-[1.4fr_0.85fr] lg:py-section">
        {/* form column */}
        <div className="grid gap-10">
          {/* Recipients */}
          <section aria-labelledby="ship-heading">
            <h2 id="ship-heading" className="text-h3 lowercase">who is it going to?</h2>
            <p className="mt-1 text-base leading-7 text-body">Send one cake, or the same cake to several people at once.</p>

            {usableSaved().length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="self-center text-sm font-medium text-body">Saved:</span>
                {usableSaved().map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setRecipients((prev) => [...prev.filter((r) => r.name || r.address1), { name: s.name, address1: s.address1, address2: s.address2, city: s.city, state: s.state, zip: s.zip }])}
                    className="border border-ink/20 bg-white px-3 py-1.5 text-sm text-ink hover:border-brand-red"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 grid gap-5">
              {recipients.map((r, i) => (
                <fieldset key={i} className="form-surface border-l-4 !border-l-brand-red">
                  <div className="flex items-center justify-between">
                    <legend className="font-serif text-2xl lowercase text-ink">recipient {i + 1}</legend>
                    {recipients.length > 1 && (
                      <button type="button" onClick={() => setRecipients((prev) => prev.filter((_, idx) => idx !== i))} className="text-sm font-medium text-brand-primary hover:underline">
                        remove
                      </button>
                    )}
                  </div>
                  <label className="field">
                    <span>Recipient name</span>
                    <input value={r.name} onChange={(e) => setRecipient(i, { name: e.target.value })} data-invalid={Boolean(errors[`r${i}-name`])} autoComplete="name" />
                    {errors[`r${i}-name`] && <span className="field-error">{errors[`r${i}-name`]}</span>}
                  </label>
                  <label className="field">
                    <span>Street address</span>
                    <input value={r.address1} onChange={(e) => setRecipient(i, { address1: e.target.value })} data-invalid={Boolean(errors[`r${i}-address1`])} autoComplete="address-line1" />
                    {errors[`r${i}-address1`] && <span className="field-error">{errors[`r${i}-address1`]}</span>}
                  </label>
                  <label className="field">
                    <span>Apt, suite (optional)</span>
                    <input value={r.address2} onChange={(e) => setRecipient(i, { address2: e.target.value })} autoComplete="address-line2" />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-[1.4fr_0.7fr_0.9fr]">
                    <label className="field">
                      <span>City</span>
                      <input value={r.city} onChange={(e) => setRecipient(i, { city: e.target.value })} data-invalid={Boolean(errors[`r${i}-city`])} autoComplete="address-level2" />
                      {errors[`r${i}-city`] && <span className="field-error">{errors[`r${i}-city`]}</span>}
                    </label>
                    <label className="field">
                      <span>State</span>
                      <select value={r.state} onChange={(e) => setRecipient(i, { state: e.target.value })}>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span>ZIP</span>
                      <input value={r.zip} inputMode="numeric" maxLength={5} onChange={(e) => setRecipient(i, { zip: e.target.value.replace(/\D/g, '') })} data-invalid={Boolean(errors[`r${i}-zip`])} autoComplete="postal-code" />
                      {errors[`r${i}-zip`] && <span className="field-error">{errors[`r${i}-zip`]}</span>}
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
            <button type="button" onClick={() => setRecipients((prev) => [...prev, blankRecipient()])} className="btn-secondary mt-4">
              + Send to another address
            </button>
          </section>

          {/* Delivery + gift */}
          <section aria-labelledby="gift-heading" className="grid gap-5">
            <h2 id="gift-heading" className="text-h3 lowercase">delivery and gift note</h2>
            <label className="field max-w-xs">
              <span>Delivery date</span>
              <input type="date" min={minDate} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} data-invalid={Boolean(errors.deliveryDate)} />
              {errors.deliveryDate && <span className="field-error">{errors.deliveryDate}</span>}
            </label>
            <label className="field">
              <span>Gift message (optional)</span>
              <textarea rows={3} maxLength={240} value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} placeholder="Happy birthday! Wish we could share a slice with you." />
              <span className="text-sm text-body">{giftMessage.length}/240</span>
            </label>
          </section>

          {/* Sender */}
          <section aria-labelledby="sender-heading" className="grid gap-5">
            <h2 id="sender-heading" className="text-h3 lowercase">your info</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field">
                <span>Your name</span>
                <input value={senderName} onChange={(e) => setSenderName(e.target.value)} data-invalid={Boolean(errors.senderName)} autoComplete="name" />
                {errors.senderName && <span className="field-error">{errors.senderName}</span>}
              </label>
              <label className="field">
                <span>Email for updates</span>
                <input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} data-invalid={Boolean(errors.senderEmail)} autoComplete="email" />
                {errors.senderEmail && <span className="field-error">{errors.senderEmail}</span>}
              </label>
            </div>
          </section>

          {/* Payment (mock) */}
          <section aria-labelledby="pay-heading" className="grid gap-5">
            <h2 id="pay-heading" className="text-h3 lowercase">payment</h2>
            <div className="form-surface border-l-4 !border-l-brand-red">
              <label className="field">
                <span>Card number</span>
                <input
                  value={card.number}
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                  data-invalid={Boolean(errors.cardNumber)}
                />
                {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
              </label>
              <div className="grid gap-5 sm:grid-cols-[0.6fr_0.5fr_1fr]">
                <label className="field">
                  <span>Expiry</span>
                  <input
                    value={card.exp}
                    placeholder="MM/YY"
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setCard((c) => ({ ...c, exp: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits }));
                    }}
                    data-invalid={Boolean(errors.cardExp)}
                  />
                  {errors.cardExp && <span className="field-error">{errors.cardExp}</span>}
                </label>
                <label className="field">
                  <span>CVC</span>
                  <input value={card.cvc} inputMode="numeric" maxLength={4} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }))} data-invalid={Boolean(errors.cardCvc)} />
                  {errors.cardCvc && <span className="field-error">{errors.cardCvc}</span>}
                </label>
                <label className="field">
                  <span>Name on card</span>
                  <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} data-invalid={Boolean(errors.cardName)} />
                  {errors.cardName && <span className="field-error">{errors.cardName}</span>}
                </label>
              </div>
              <p className="text-sm leading-6 text-body">Demo only. Use any numbers, like 4242 4242 4242 4242.</p>
            </div>
          </section>
        </div>

        {/* summary column */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="border border-brand-primary/35 bg-white p-6 shadow-[inset_0_5px_0_var(--color-blue-soft)]">
            <h2 className="font-serif text-3xl lowercase text-brand-primary">order summary</h2>
            <Stagger as="ul" className="mt-4 divide-y divide-ink/10" gap={0.06}>
              {items.map((item) => (
                <StaggerItem as="li" key={item.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-3">
                  <div className="relative aspect-square overflow-hidden border border-ink/10 bg-blue-soft">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-lg lowercase leading-tight text-ink">{item.name}</p>
                    <p className="text-sm leading-tight text-body">{item.formatLabel}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button type="button" aria-label="Decrease" onClick={() => updateQty(item.id, item.qty - 1)} className="h-6 w-6 border border-ink/20 text-ink hover:bg-blue-tint">−</button>
                      <span className="text-sm font-bold text-ink">{item.qty}</span>
                      <button type="button" aria-label="Increase" onClick={() => updateQty(item.id, item.qty + 1)} className="h-6 w-6 border border-ink/20 text-ink hover:bg-blue-tint">+</button>
                      <button type="button" onClick={() => removeItem(item.id)} className="ml-1 text-xs text-brand-primary hover:underline">remove</button>
                    </div>
                  </div>
                  <span className="self-start font-sans text-base font-bold text-ink">{formatUsd(item.unitPrice * item.qty)}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <dl className="mt-4 grid gap-2 border-t border-ink/15 pt-4 text-base text-ink">
              <div className="flex justify-between">
                <dt className="text-body">Subtotal</dt>
                <dd>{formatUsd(itemsSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-body">Shipping ({recipients.length} {recipients.length === 1 ? 'address' : 'addresses'})</dt>
                <dd>{formatUsd(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t-4 border-brand-red pt-3 font-serif text-2xl">
                <dt>Total</dt>
                <dd>{formatUsd(total)}</dd>
              </div>
            </dl>
            <m.button type="button" onClick={placeOrder} disabled={submitting} className="btn-primary mt-5 w-full" whileTap={{ scale: 0.98 }} transition={snap}>
              {submitting ? 'Placing order…' : `Place order · ${formatUsd(total)}`}
            </m.button>
            <Link href="/patticake#national-order" className="btn-link mt-3 block text-center">
              keep shopping
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
