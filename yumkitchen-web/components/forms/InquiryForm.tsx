'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cloneElement, useMemo, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { locations } from '@/lib/locations';

export type InquiryKind = 'contact' | 'catering' | 'cake' | 'careers' | 'accessibility';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Enter a valid email.'),
  phone: z.string().optional(),
  location: z.string().optional(),
  subject: z.string().min(1, 'Subject is required.'),
  eventDate: z.string().optional(),
  guests: z.string().optional(),
  message: z.string().min(10, 'Please share a little more detail.'),
  company: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof schema>;

const labels: Record<InquiryKind, { subject: string; message: string; submit: string }> = {
  contact: {
    subject: 'Subject',
    message: 'Message',
    submit: 'Send Message',
  },
  catering: {
    subject: 'Event Type',
    message: 'Tell us what you are planning',
    submit: 'Send Catering Inquiry',
  },
  cake: {
    subject: 'Type of Event',
    message: 'Describe the cake you have in mind',
    submit: 'Send Cake Inquiry',
  },
  careers: {
    subject: 'Role or area of interest',
    message: 'Tell us about your hospitality experience',
    submit: 'Send Application',
  },
  accessibility: {
    subject: 'Accessibility topic',
    message: 'Please share feedback here',
    submit: 'Send Feedback',
  },
};

type InquiryFormProps = {
  kind: InquiryKind;
  defaultSubject?: string;
  messageLabel?: string;
  submitLabel?: string;
  eventDateLabel?: string;
  guestsLabel?: string;
  locationLabel?: string;
};

export function InquiryForm({
  kind,
  defaultSubject,
  messageLabel,
  submitLabel,
  eventDateLabel,
  guestsLabel,
  locationLabel,
}: InquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const copy = {
    ...labels[kind],
    ...(messageLabel ? { message: messageLabel } : {}),
    ...(submitLabel ? { submit: submitLabel } : {}),
  };
  const requiresEventDetails = kind === 'catering' || kind === 'cake';
  const defaults = useMemo<Partial<InquiryFormValues>>(
    () => ({
      subject: defaultSubject ?? (kind === 'cake' ? 'Wedding cake' : kind === 'catering' ? 'Catering inquiry' : ''),
      location: '',
    }),
    [defaultSubject, kind],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  async function onSubmit(values: InquiryFormValues) {
    setStatus('sending');
    setServerMessage('');
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, ...values }),
    });
    const payload = (await res.json()) as { message?: string };
    if (!res.ok) {
      setStatus('error');
      setServerMessage(payload.message ?? 'The message could not be sent.');
      return;
    }
    setStatus('success');
    setServerMessage(payload.message ?? 'Thanks. We received your note.');
    reset(defaults);
  }

  return (
    <form className="form-surface" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="hidden">
        <label htmlFor={`${kind}-company`}>Company</label>
        <input id={`${kind}-company`} tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${kind}-first-name`} label="First name" error={errors.firstName?.message}>
          <input id={`${kind}-first-name`} autoComplete="given-name" required {...register('firstName')} />
        </Field>
        <Field id={`${kind}-last-name`} label="Last name" error={errors.lastName?.message}>
          <input id={`${kind}-last-name`} autoComplete="family-name" required {...register('lastName')} />
        </Field>
        <Field id={`${kind}-email`} label="Email" error={errors.email?.message}>
          <input id={`${kind}-email`} type="email" autoComplete="email" required {...register('email')} />
        </Field>
        <Field id={`${kind}-phone`} label="Phone" error={errors.phone?.message}>
          <input id={`${kind}-phone`} type="tel" autoComplete="tel" {...register('phone')} />
        </Field>
        <Field id={`${kind}-location`} label={locationLabel ?? 'Location'} error={errors.location?.message}>
          <select id={`${kind}-location`} {...register('location')}>
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.name}
              </option>
            ))}
            <option value="na">N/A</option>
          </select>
        </Field>
        <Field id={`${kind}-subject`} label={copy.subject} error={errors.subject?.message}>
          <input id={`${kind}-subject`} required {...register('subject')} />
        </Field>
        {requiresEventDetails && (
          <>
            <Field id={`${kind}-event-date`} label={eventDateLabel ?? (kind === 'cake' ? 'Date of Event' : 'Event Date')} error={errors.eventDate?.message}>
              <input id={`${kind}-event-date`} type="date" {...register('eventDate')} />
            </Field>
            <Field id={`${kind}-guests`} label={guestsLabel ?? 'Guests'} error={errors.guests?.message}>
              <input id={`${kind}-guests`} inputMode="numeric" {...register('guests')} />
            </Field>
          </>
        )}
      </div>
      <Field id={`${kind}-message`} label={copy.message} error={errors.message?.message}>
        <textarea id={`${kind}-message`} rows={6} required {...register('message')} />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : copy.submit}
        </button>
        {serverMessage && (
          <p className={status === 'error' ? 'text-brand-primary' : 'text-ink'} role="status">
            {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactElement<Record<string, unknown>>;
}) {
  const control = cloneElement(children, {
    'aria-describedby': error ? `${id}-error` : undefined,
    'aria-invalid': error ? 'true' : undefined,
  });

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {control}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
