'use client';

import { useState } from 'react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { getAttributionContext } from '@/lib/attribution';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'done'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const isEnabled = process.env.NEXT_PUBLIC_NEWSLETTER_SIGNUP_ENABLED === 'true';

  if (!isEnabled) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
      setStatus('error');
      setServerMessage('Enter a valid email address.');
      return;
    }

    setStatus('sending');
    setServerMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          company: new FormData(form).get('company'),
          sourcePath: window.location.pathname,
          ...getAttributionContext(),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setStatus('error');
        setServerMessage(payload.message ?? 'Signup is unavailable right now. Please try again later.');
        return;
      }

      pushAnalyticsEvent({
        event: 'submit_email_signup',
        canonical_event: 'email_signup_submit',
        page_path: window.location.pathname,
      });
      setStatus('done');
    } catch {
      setStatus('error');
      setServerMessage('Signup is unavailable right now. Please try again later.');
    }
  }

  return (
    <section className="border-b border-blue-soft bg-blue-tint px-6 py-10">
      <div className="mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="section-label text-ink">join the yum! list</p>
          <h2 className="font-serif text-[2.4rem] font-normal leading-tight lowercase text-ink">get the sweet stuff first</h2>
          <p className="mt-2 max-w-md text-lg leading-8 text-ink">
            Seasonal drops, new cakes, and Twin Cities happenings. No spam, just the good stuff.
          </p>
        </div>
        {status === 'done' ? (
          <div className="border border-brand-primary/30 bg-white p-6" role="status">
            <p className="font-serif text-2xl lowercase text-ink">you&apos;re on the list</p>
            <p className="mt-2 text-base leading-7 text-body">Keep an eye on your inbox for something sweet.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="newsletter-company">Company</label>
              <input id="newsletter-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setServerMessage('');
                  }
                }}
                placeholder="you@email.com"
                aria-invalid={status === 'error'}
                className="w-full border border-body bg-white px-4 py-3 font-sans text-lg text-ink outline-hidden transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30"
              />
              {status === 'error' && <span className="field-error">{serverMessage}</span>}
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn-primary px-6 py-3 disabled:cursor-wait disabled:opacity-70">
              {status === 'sending' ? 'Joining...' : 'Join'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
