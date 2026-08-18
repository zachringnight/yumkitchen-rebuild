'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { useCart, type Recipient } from '@/lib/cart/CartContext';
import { formatUsd } from '@/lib/patticake/catalog';
import { useLiveIsoDate } from '@/lib/useLiveIsoDate';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { snap } from '@/components/motion/springs';

type DraftRecipient = Omit<Recipient, 'id'>;

// All 50 states + DC. Keep the list predictable while asking for an explicit choice.
const US_STATES = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN',
  'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
  'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY',
];

function blankRecipient(): DraftRecipient {
  return { name: '', address1: '', address2: '', city: '', state: '', zip: '' };
}

// Demo ceiling on addresses. Every path that grows the recipient list has to
// respect it: the add button, and the saved-recipient chips. The cap copy near
// the add button spells this number out, so change both together.
const MAX_RECIPIENTS = 6;

function invalidFieldProps(error: string | undefined, errorId: string) {
  return {
    'data-invalid': Boolean(error),
    'aria-invalid': error ? ('true' as const) : undefined,
    'aria-describedby': error ? errorId : undefined,
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemsSubtotal, updateQty, removeItem, recipients: savedRecipients, saveRecipient, quoteFor, submitOrder } = useCart();

  const [recipients, setRecipients] = useState<DraftRecipient[]>([blankRecipient()]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Live, not build-time: this route is statically prerendered, so a date
  // computed during render would freeze at deploy time.
  const minDate = useLiveIsoDate(3);
  const quote = quoteFor(itemsSubtotal, recipients.length);
  const total = quote.total;
  const errorEntries = Object.entries(errors);
  // Two caps on purpose. The add button counts every row: it appends a blank
  // one, so six rows is full whether or not they are typed into yet. The
  // chips count only filled rows: their click handler drops blank rows first,
  // so a chip still fits while blanks would otherwise hold the count at six.
  const atRecipientCap = recipients.length >= MAX_RECIPIENTS;
  const atFilledRecipientCap = recipients.filter((r) => r.name || r.address1).length >= MAX_RECIPIENTS;

  // Prefill the earliest allowed date once, so the walkthrough does not stall
  // on a date picker. Once only: after that the field is the guest's, and
  // clearing it has to stick so validation can ask for a date.
  const datePrefilled = useRef(false);
  useEffect(() => {
    if (datePrefilled.current || !minDate) return;
    datePrefilled.current = true;
    setDeliveryDate(minDate);
  }, [minDate]);

  useEffect(() => {
    if (validationAttempt === 0) return;
    errorSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    errorSummaryRef.current?.focus();
  }, [validationAttempt]);

  function clearError(key: string) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function setRecipient(index: number, patch: Partial<DraftRecipient>, errorKey?: string) {
    setRecipients((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
    if (errorKey) clearError(errorKey);
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
      if (!r.state) next[`r${i}-state`] = 'Choose a state';
      if (!/^\d{5}$/.test(r.zip.trim())) next[`r${i}-zip`] = 'Enter a 5-digit ZIP';
    });
    if (!deliveryDate) next.deliveryDate = 'Choose a delivery date';
    else if (minDate && deliveryDate < minDate) next.deliveryDate = 'Choose a date at least three days out';
    if (!senderName.trim()) next.senderName = 'Add your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(senderEmail.trim())) next.senderEmail = 'Enter a valid email';
    if (card.number.replace(/\s/g, '').length < 15) next.cardNumber = 'Enter a card number';
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) next.cardExp = 'MM/YY';
    if (card.cvc.length < 3) next.cardCvc = 'CVC';
    if (!card.name.trim()) next.cardName = 'Name on card';
    setErrors(next);
    if (Object.keys(next).length) {
      setValidationAttempt((attempt) => attempt + 1);
      return false;
    }
    return true;
  }

  async function placeOrder() {
    if (submitting || !validate()) return;
    setSubmitting(true);
    const savedIds = recipients.map((r) => saveRecipient(r));
    await submitOrder({
      recipients: savedIds,
      deliveryDate,
      cakeMessage: cakeMessage.trim(),
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

      <form
        className="mx-auto grid max-w-[1180px] gap-10 px-6 py-10 lg:grid-cols-[1.4fr_0.85fr] lg:py-section"
        onSubmit={(event) => {
          event.preventDefault();
          void placeOrder();
        }}
        noValidate
      >
        {/* form column */}
        <div className="grid gap-10">
          {errorEntries.length > 0 && (
            <div
              ref={errorSummaryRef}
              role="alert"
              tabIndex={-1}
              aria-labelledby="checkout-errors-heading"
              className="border border-brand-primary/40 border-l-4 border-l-brand-red bg-white p-5 outline-none focus:ring-4 focus:ring-brand-red/20"
            >
              <h2 id="checkout-errors-heading" className="font-serif text-2xl lowercase text-brand-primary">check these details</h2>
              <p className="mt-2 text-base leading-7 text-ink">
                We found {errorEntries.length} {errorEntries.length === 1 ? 'detail' : 'details'} to fix before the demo order is ready.
              </p>
              <ul className="mt-3 grid gap-1 text-base font-bold text-brand-primary-darker">
                {errorEntries.map(([key, message]) => (
                  <li key={key}>
                    <a href={`#${key}`} className="underline decoration-brand-primary/50 underline-offset-2 hover:decoration-brand-primary">
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recipients */}
          <section aria-labelledby="ship-heading">
            <h2 id="ship-heading" className="text-h3 lowercase">who is it going to?</h2>
            <p className="mt-1 text-base leading-7 text-body">
              One box goes to one address. Add another address and that person gets their own cake, plus demo shipping.
            </p>

            {usableSaved().length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="self-center text-sm font-medium text-body">Saved:</span>
                {usableSaved().map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={atFilledRecipientCap}
                    onClick={() => {
                      setRecipients((prev) => {
                        // Blank rows are dropped first, so a chip can still land
                        // on an untouched form that is nominally at the cap.
                        const kept = prev.filter((r) => r.name || r.address1);
                        if (kept.length >= MAX_RECIPIENTS) return prev;
                        return [...kept, { name: s.name, address1: s.address1, address2: s.address2, city: s.city, state: s.state, zip: s.zip }];
                      });
                      setErrors({});
                    }}
                    className="border border-ink/20 bg-white px-3 py-1.5 text-sm text-ink hover:border-brand-red disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-ink/20"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 grid gap-5">
              {recipients.map((r, i) => (
                <fieldset key={i} className="form-surface border-l-4 !border-l-brand-red">
                  <legend className="sr-only">recipient {i + 1}</legend>
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-2xl lowercase text-ink" aria-hidden="true">recipient {i + 1}</p>
                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setRecipients((prev) => prev.filter((_, idx) => idx !== i));
                          setErrors({});
                        }}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        remove
                      </button>
                    )}
                  </div>
                  <label className="field">
                    <span>Recipient name</span>
                    <input
                      id={`r${i}-name`}
                      name={`recipient-${i}-name`}
                      value={r.name}
                      onChange={(e) => setRecipient(i, { name: e.target.value }, `r${i}-name`)}
                      autoComplete="name"
                      {...invalidFieldProps(errors[`r${i}-name`], `r${i}-name-error`)}
                    />
                    {errors[`r${i}-name`] && <span id={`r${i}-name-error`} className="field-error">{errors[`r${i}-name`]}</span>}
                  </label>
                  <label className="field">
                    <span>Street address</span>
                    <input
                      id={`r${i}-address1`}
                      name={`recipient-${i}-address1`}
                      value={r.address1}
                      onChange={(e) => setRecipient(i, { address1: e.target.value }, `r${i}-address1`)}
                      autoComplete="address-line1"
                      {...invalidFieldProps(errors[`r${i}-address1`], `r${i}-address1-error`)}
                    />
                    {errors[`r${i}-address1`] && <span id={`r${i}-address1-error`} className="field-error">{errors[`r${i}-address1`]}</span>}
                  </label>
                  <label className="field">
                    <span>Apt, suite (optional)</span>
                    <input name={`recipient-${i}-address2`} value={r.address2} onChange={(e) => setRecipient(i, { address2: e.target.value })} autoComplete="address-line2" />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-[1.4fr_0.7fr_0.9fr]">
                    <label className="field">
                      <span>City</span>
                      <input
                        id={`r${i}-city`}
                        name={`recipient-${i}-city`}
                        value={r.city}
                        onChange={(e) => setRecipient(i, { city: e.target.value }, `r${i}-city`)}
                        autoComplete="address-level2"
                        {...invalidFieldProps(errors[`r${i}-city`], `r${i}-city-error`)}
                      />
                      {errors[`r${i}-city`] && <span id={`r${i}-city-error`} className="field-error">{errors[`r${i}-city`]}</span>}
                    </label>
                    <label className="field">
                      <span>State</span>
                      <select
                        id={`r${i}-state`}
                        name={`recipient-${i}-state`}
                        value={r.state}
                        onChange={(e) => setRecipient(i, { state: e.target.value }, `r${i}-state`)}
                        autoComplete="address-level1"
                        {...invalidFieldProps(errors[`r${i}-state`], `r${i}-state-error`)}
                      >
                        <option value="">Select</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors[`r${i}-state`] && <span id={`r${i}-state-error`} className="field-error">{errors[`r${i}-state`]}</span>}
                    </label>
                    <label className="field">
                      <span>ZIP</span>
                      <input
                        id={`r${i}-zip`}
                        name={`recipient-${i}-zip`}
                        value={r.zip}
                        inputMode="numeric"
                        maxLength={5}
                        onChange={(e) => setRecipient(i, { zip: e.target.value.replace(/\D/g, '') }, `r${i}-zip`)}
                        autoComplete="postal-code"
                        {...invalidFieldProps(errors[`r${i}-zip`], `r${i}-zip-error`)}
                      />
                      {errors[`r${i}-zip`] && <span id={`r${i}-zip-error`} className="field-error">{errors[`r${i}-zip`]}</span>}
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setRecipients((prev) => (prev.length >= MAX_RECIPIENTS ? prev : [...prev, blankRecipient()]));
                setErrors({});
              }}
              className="btn-secondary mt-4"
              disabled={atRecipientCap}
            >
              + Send to another address
            </button>
            <p className="mt-2 text-sm leading-6 text-body" aria-live="polite">
              {atRecipientCap
                ? 'Six addresses is the demo maximum.'
                : 'Each extra address adds another cake and the demo shipping rate.'}
            </p>
          </section>

          {/* Delivery + gift */}
          <section aria-labelledby="gift-heading" className="grid gap-5">
            <h2 id="gift-heading" className="text-h3 lowercase">delivery and cake words</h2>
            <label className="field max-w-xs">
              <span>Delivery date</span>
              <input
                id="deliveryDate"
                name="delivery-date"
                type="date"
                min={minDate || undefined}
                value={deliveryDate}
                onChange={(e) => {
                  setDeliveryDate(e.target.value);
                  clearError('deliveryDate');
                }}
                {...invalidFieldProps(errors.deliveryDate, 'deliveryDate-error')}
              />
              {errors.deliveryDate && <span id="deliveryDate-error" className="field-error">{errors.deliveryDate}</span>}
            </label>
            <label className="field max-w-md">
              <span>Words on the cake (optional)</span>
              <input
                value={cakeMessage}
                maxLength={28}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="love you"
              />
              <span className="text-sm text-body">{cakeMessage.length}/28. Goes on top of the cake. Same words for every address.</span>
            </label>
            <label className="field">
              <span>Gift note (optional)</span>
              <textarea rows={3} maxLength={240} value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} placeholder="Happy birthday! Wish we could share a slice with you." />
              <span className="text-sm text-body">{giftMessage.length}/240. Travels with the box. Same words for every address.</span>
            </label>
          </section>

          {/* Sender */}
          <section aria-labelledby="sender-heading" className="grid gap-5">
            <h2 id="sender-heading" className="text-h3 lowercase">your info</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field">
                <span>Your name</span>
                <input
                  id="senderName"
                  name="sender-name"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    clearError('senderName');
                  }}
                  autoComplete="name"
                  {...invalidFieldProps(errors.senderName, 'senderName-error')}
                />
                {errors.senderName && <span id="senderName-error" className="field-error">{errors.senderName}</span>}
              </label>
              <label className="field">
                <span>Email for updates</span>
                <input
                  id="senderEmail"
                  name="sender-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => {
                    setSenderEmail(e.target.value);
                    clearError('senderEmail');
                  }}
                  autoComplete="email"
                  {...invalidFieldProps(errors.senderEmail, 'senderEmail-error')}
                />
                {errors.senderEmail && <span id="senderEmail-error" className="field-error">{errors.senderEmail}</span>}
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
                  id="cardNumber"
                  name="demo-card-number"
                  value={card.number}
                  inputMode="numeric"
                  autoComplete="off"
                  onChange={(e) => {
                    setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }));
                    clearError('cardNumber');
                  }}
                  {...invalidFieldProps(errors.cardNumber, 'cardNumber-error')}
                />
                {errors.cardNumber && <span id="cardNumber-error" className="field-error">{errors.cardNumber}</span>}
              </label>
              <div className="grid gap-5 sm:grid-cols-[0.6fr_0.5fr_1fr]">
                <label className="field">
                  <span>Expiry</span>
                  <input
                    id="cardExp"
                    name="demo-card-expiry"
                    value={card.exp}
                    placeholder="MM/YY"
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setCard((c) => ({ ...c, exp: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits }));
                      clearError('cardExp');
                    }}
                    autoComplete="off"
                    {...invalidFieldProps(errors.cardExp, 'cardExp-error')}
                  />
                  {errors.cardExp && <span id="cardExp-error" className="field-error">{errors.cardExp}</span>}
                </label>
                <label className="field">
                  <span>CVC</span>
                  <input
                    id="cardCvc"
                    name="demo-card-cvc"
                    value={card.cvc}
                    inputMode="numeric"
                    maxLength={4}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }));
                      clearError('cardCvc');
                    }}
                    autoComplete="off"
                    {...invalidFieldProps(errors.cardCvc, 'cardCvc-error')}
                  />
                  {errors.cardCvc && <span id="cardCvc-error" className="field-error">{errors.cardCvc}</span>}
                </label>
                <label className="field">
                  <span>Name on card</span>
                  <input
                    id="cardName"
                    name="demo-card-name"
                    value={card.name}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, name: e.target.value }));
                      clearError('cardName');
                    }}
                    autoComplete="off"
                    {...invalidFieldProps(errors.cardName, 'cardName-error')}
                  />
                  {errors.cardName && <span id="cardName-error" className="field-error">{errors.cardName}</span>}
                </label>
              </div>
              <p className="text-sm leading-6 text-body">Any numbers work here. No card is charged.</p>
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
                    <p className="text-sm leading-tight text-body">{item.formatLabel} · {item.occasion}</p>
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
                <dt className="text-body">Box subtotal</dt>
                <dd>{formatUsd(quote.boxSubtotal)}</dd>
              </div>
              {quote.addressCount > 1 && (
                <div className="flex justify-between">
                  <dt className="text-body">1 box per address ({quote.addressCount})</dt>
                  <dd>{formatUsd(quote.itemsSubtotal)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-body">
                  Shipping (demo rate
                  {quote.addressCount > 1 ? `, ${quote.addressCount} addresses` : ''})
                </dt>
                <dd>{formatUsd(quote.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t-4 border-brand-red pt-3 font-serif text-2xl">
                <dt>Total</dt>
                <dd>{formatUsd(total)}</dd>
              </div>
            </dl>
            <m.button type="submit" disabled={submitting} className="btn-primary mt-5 w-full" whileTap={{ scale: 0.98 }} transition={snap}>
              {submitting ? 'Placing demo order…' : `Place demo order · ${formatUsd(total)}`}
            </m.button>
            <Link href="/patticake#national-order" className="btn-link mt-3 block text-center">
              keep shopping
            </Link>
          </div>
        </aside>
      </form>
    </main>
  );
}
