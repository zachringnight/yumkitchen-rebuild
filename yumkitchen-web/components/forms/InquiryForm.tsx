'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { cloneElement, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { attributionFieldNames, getAttributionContext } from '@/lib/attribution';
import { CAKE_MESSAGE_EVENT, type CakeMessageDetail } from '@/lib/cakeMessage';
import { CATERING_PLAN_EVENT, type CateringPlanDetail } from '@/lib/cateringPlan';
import {
  addCareersIssues,
  addMissingStringIssues,
  cakeDeliveryRequiredFields,
  cakePickupRequiredFields,
  inquiryFieldsSchema,
  type CakeMode,
  type InquiryKind,
} from '@/lib/inquiryValidation';
import { locations } from '@/lib/locations';

export type { InquiryKind };

const schema = inquiryFieldsSchema.extend({
  organization: z.string().optional(),
  eventTime: z.string().optional(),
  dietaryNeeds: z.string().optional(),
  resume: z.any().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  landing_page: z.string().optional(),
  referrer: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof schema>;

function formSchemaFor(kind: InquiryKind, cakeMode: CakeMode) {
  return schema.superRefine((values, ctx) => {
    if (kind === 'catering') {
      const requiredFields: Array<[keyof InquiryFormValues, string]> = [
        ['location', 'Pickup restaurant is required.'],
        ['eventDate', 'Event date is required.'],
        ['eventTime', 'Event time is required.'],
        ['guests', 'Guest count is required.'],
      ];

      for (const [field, message] of requiredFields) {
        const value = values[field];
        if (typeof value !== 'string' || !value.trim()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
        }
      }
    }

    if (kind === 'cake' && cakeMode === 'pickup') {
      addMissingStringIssues(values, ctx, cakePickupRequiredFields);
    }

    if (kind === 'cake' && cakeMode === 'delivery') {
      addMissingStringIssues(values, ctx, cakeDeliveryRequiredFields);
    }

    if (kind !== 'careers') return;

    addCareersIssues(values, ctx);

    const fileList = values.resume;
    const file = typeof FileList === 'undefined' || !(fileList instanceof FileList) ? null : fileList.item(0);
    if (file) {
      const allowedExtensions = /\.(pdf|doc|docx|rtf|txt)$/i;
      if (file.size > 10 * 1024 * 1024) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['resume'], message: 'Resume must be 10 MB or smaller.' });
      }
      if (!allowedExtensions.test(file.name)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['resume'], message: 'Upload a PDF, DOC, DOCX, RTF, or TXT resume.' });
      }
    }
  });
}

function revealAndFocusField(id: string) {
  // Bring the field to center so the visitor sees the words land. Lazy
  // images loading mid-scroll shift the layout under the animation, so
  // re-check after it settles and nudge if the field drifted (same retry
  // idea as HashAnchorScroll).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const field = document.getElementById(id);
      if (!field) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      field.focus({ preventScroll: true });
      field.classList.add('message-field-pulse');
      window.setTimeout(() => field.classList.remove('message-field-pulse'), 1400);
      field.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      for (const delay of [700, 1400]) {
        window.setTimeout(() => {
          const rect = field.getBoundingClientRect();
          const offCenter = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (offCenter > 48) field.scrollIntoView({ block: 'center', behavior: 'auto' });
        }, delay);
      }
    });
  });
}

const labels: Record<InquiryKind, { subject: string; message: string; submit: string }> = {
  contact: {
    subject: 'Subject',
    message: 'Message',
    submit: 'Send Message',
  },
  catering: {
    subject: 'Event Type',
    message: 'Tell us what you are planning',
    submit: 'Send Catering Note',
  },
  cake: {
    subject: 'Type of Event',
    message: 'Describe the cake you have in mind',
    submit: 'Send Cake Note',
  },
  careers: {
    subject: 'Role',
    message: 'Why do you want to work at yum! Kitchen and Bakery?',
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
  cakeMode?: CakeMode;
  showLocation?: boolean;
  hideSubject?: boolean;
  successMessage?: string;
};

const submitEvents: Record<InquiryKind, string> = {
  contact: 'submit_contact_form',
  catering: 'submit_catering_form',
  cake: 'submit_wedding_cake_form',
  careers: 'submit_careers_form',
  accessibility: 'submit_contact_form',
};

function canonicalSubmitEvent(kind: InquiryKind, cakeMode: CakeMode) {
  if (kind === 'catering') return 'catering_form_submit';
  if (kind === 'cake' && cakeMode === 'pickup') return 'cake_pickup_form_submit';
  if (kind === 'cake' && cakeMode === 'delivery') return 'patticake_shipping_request_submit';
  if (kind === 'cake') return 'wedding_inquiry_submit';
  if (kind === 'contact' || kind === 'accessibility') return 'contact_form_submit';
  return 'careers_form_submit';
}

export function InquiryForm({
  kind,
  defaultSubject,
  messageLabel,
  submitLabel,
  eventDateLabel,
  guestsLabel,
  locationLabel,
  cakeMode = 'general',
  showLocation = true,
  hideSubject = false,
  successMessage,
}: InquiryFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [giftMessageLength, setGiftMessageLength] = useState(0);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const copy = {
    ...labels[kind],
    ...(messageLabel ? { message: messageLabel } : {}),
    ...(submitLabel ? { submit: submitLabel } : {}),
  };
  const requiresEventDetails = kind === 'catering' || kind === 'cake';
  const isCareers = kind === 'careers';
  const isCatering = kind === 'catering';
  const isPickupCake = kind === 'cake' && cakeMode === 'pickup';
  const isDeliveryCake = kind === 'cake' && cakeMode === 'delivery';
  const requiresCakeLocation = isPickupCake;
  const requiresCakeDate = isPickupCake || isDeliveryCake;
  const validationSchema = useMemo(() => formSchemaFor(kind, cakeMode), [kind, cakeMode]);
  const defaults = useMemo<Partial<InquiryFormValues>>(
    () => ({
      subject: defaultSubject ?? (kind === 'cake' ? 'Patticake and cake note' : kind === 'catering' ? 'Catering note' : ''),
      location: '',
    }),
    [defaultSubject, kind],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaults,
  });
  const giftMessageRegistration = register('giftMessage');

  useEffect(() => {
    const attribution = getAttributionContext();
    for (const field of attributionFieldNames) {
      setValue(field, attribution[field]);
    }
  }, [setValue]);

  useEffect(() => {
    if (kind !== 'cake') return;

    function onCakeMessage(event: Event) {
      const message = (event as CustomEvent<CakeMessageDetail>).detail?.message?.trim();
      if (!message) return;

      if (isDeliveryCake) {
        const giftMessage = message.slice(0, 140);
        setValue('giftMessage', giftMessage, { shouldDirty: true });
        setGiftMessageLength(giftMessage.length);
        revealAndFocusField('cake-gift-message');
        return;
      }

      const cakeWords = `Words on the cake: "${message}"`;
      const current = (getValues('message') ?? '').trim();
      if (!current.includes(cakeWords)) {
        setValue('message', current ? `${current}\n${cakeWords}` : cakeWords, { shouldDirty: true });
      }
      revealAndFocusField('cake-message');
    }

    window.addEventListener(CAKE_MESSAGE_EVENT, onCakeMessage);
    return () => window.removeEventListener(CAKE_MESSAGE_EVENT, onCakeMessage);
  }, [kind, isDeliveryCake, setValue, getValues]);

  // Catering counterpart of the cake-message handoff: CateringPlanBuilder
  // composes a plan, this fills the matching fields and pulses the message so
  // the visitor sees where their words landed.
  useEffect(() => {
    if (kind !== 'catering') return;

    function onCateringPlan(event: Event) {
      const detail = (event as CustomEvent<CateringPlanDetail>).detail;
      if (!detail?.summary) return;

      const current = (getValues('message') ?? '').trim();
      // Append and dedupe, so re-sending after changing a choice does not stack
      // near-identical sentences on top of anything already typed.
      if (!current.includes(detail.summary)) {
        setValue('message', current ? `${current}\n${detail.summary}` : detail.summary, { shouldDirty: true });
      }
      if (detail.guests) setValue('guests', detail.guests, { shouldDirty: true });
      if (detail.locationSlug) setValue('location', detail.locationSlug, { shouldDirty: true });

      revealAndFocusField('catering-message');
    }

    window.addEventListener(CATERING_PLAN_EVENT, onCateringPlan);
    return () => window.removeEventListener(CATERING_PLAN_EVENT, onCateringPlan);
  }, [kind, setValue, getValues]);

  function getBody(values: InquiryFormValues) {
    const sourcePath = window.location.pathname;

    if (!isCareers) {
      return {
        body: JSON.stringify({ kind, sourcePath, ...values }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const body = new FormData();
    body.append('kind', kind);
    body.append('sourcePath', sourcePath);
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null || value === '') continue;
      if (key === 'resume') {
        const file = value instanceof FileList ? value.item(0) : null;
        if (file && file.size > 0) body.append('resume', file);
        continue;
      }
      if (typeof value === 'boolean') {
        body.append(key, value ? 'true' : 'false');
      } else {
        body.append(key, String(value));
      }
    }

    return { body };
  }

  async function onSubmit(values: InquiryFormValues) {
    setStatus('sending');
    setServerMessage('');
    try {
      const requestBody = getBody(values);
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        ...requestBody,
      });
      const payload = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus('error');
        setServerMessage(payload.message ?? 'The message could not be sent.');
        return;
      }
      pushAnalyticsEvent({
        event: submitEvents[kind],
        canonical_event: canonicalSubmitEvent(kind, cakeMode),
        form_kind: kind,
        lead_type: kind === 'cake' ? `cake_${cakeMode}` : kind,
        location: values.location ?? '',
        path: window.location.pathname,
        page_path: window.location.pathname,
        occasion: values.occasion ?? '',
        event_date: values.eventDate ?? '',
        guest_count: values.guests ?? '',
        event_time: values.eventTime ?? '',
      });
      setStatus('success');
      setServerMessage(successMessage ?? payload.message ?? 'Thanks. We received your note.');
      reset(defaults);
      setGiftMessageLength(0);
      // Hand off to the confirmation page, which carries the reply expectation
      // and a next step matching what was submitted. The inline success state is
      // still set first, so the confirmation is never blank if navigation is
      // slow. This is a soft client navigation, so the analytics event pushed
      // above stays on the dataLayer.
      router.push(`/thank-you?kind=${encodeURIComponent(kind)}`);
    } catch {
      setStatus('error');
      setServerMessage('The message could not be sent. Please call a yum! restaurant.');
    }
  }

  useEffect(() => {
    if ((status === 'success' || status === 'error') && serverMessage) {
      messageRef.current?.focus();
    }
  }, [status, serverMessage]);

  return (
    <form className="form-surface" method="post" encType={isCareers ? 'multipart/form-data' : undefined} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="hidden">
        <label htmlFor={`${kind}-company`}>Company</label>
        <input id={`${kind}-company`} tabIndex={-1} autoComplete="off" {...register('company')} />
        {hideSubject && <input type="hidden" {...register('subject')} />}
        {attributionFieldNames.map((field) => (
          <input key={field} type="hidden" {...register(field)} />
        ))}
      </div>
      <p className="form-required-note">
        Fields marked <span aria-hidden="true">*</span> help the bakery reply quickly.
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${kind}-first-name`} label="First name" error={errors.firstName?.message} required>
          <input id={`${kind}-first-name`} autoComplete="given-name" required {...register('firstName')} />
        </Field>
        <Field id={`${kind}-last-name`} label="Last name" error={errors.lastName?.message} required>
          <input id={`${kind}-last-name`} autoComplete="family-name" required {...register('lastName')} />
        </Field>
        <Field id={`${kind}-email`} label="Email" error={errors.email?.message} required>
          <input id={`${kind}-email`} type="email" autoComplete="email" required {...register('email')} />
        </Field>
        <Field id={`${kind}-phone`} label="Phone" error={errors.phone?.message}>
          <input id={`${kind}-phone`} type="tel" autoComplete="tel" {...register('phone')} />
        </Field>
        {isCatering && (
          <Field id={`${kind}-organization`} label="Company or organization" error={errors.organization?.message}>
            <input id={`${kind}-organization`} autoComplete="organization" {...register('organization')} />
          </Field>
        )}
        {showLocation && (
          <Field id={`${kind}-location`} label={locationLabel ?? 'Location'} error={errors.location?.message} required={requiresCakeLocation || isCatering}>
            <select id={`${kind}-location`} required={requiresCakeLocation || isCatering} {...register('location')}>
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
              {/* "N/A" only belongs on an optional location field. On the cake
                  pickup and catering forms the location is required and the
                  label names a restaurant, so N/A both reads as leftover test
                  data and slips past the required check as a real value. */}
              {!(requiresCakeLocation || isCatering) && <option value="na">N/A</option>}
            </select>
          </Field>
        )}
        {!hideSubject && (
          <Field id={`${kind}-subject`} label={copy.subject} error={errors.subject?.message} required>
            <input id={`${kind}-subject`} required {...register('subject')} />
          </Field>
        )}
        {requiresEventDetails && (
          <>
            <Field id={`${kind}-event-date`} label={eventDateLabel ?? (kind === 'cake' ? 'Date of Event' : 'Event Date')} error={errors.eventDate?.message} required={requiresCakeDate || isCatering}>
              <input id={`${kind}-event-date`} type="date" required={requiresCakeDate || isCatering} {...register('eventDate')} />
            </Field>
            {isCatering && (
              <Field id={`${kind}-event-time`} label="Event time" error={errors.eventTime?.message} required>
                <input id={`${kind}-event-time`} type="time" required {...register('eventTime')} />
              </Field>
            )}
            <Field id={`${kind}-guests`} label={guestsLabel ?? 'Guests'} error={errors.guests?.message} required={isCatering}>
              <input id={`${kind}-guests`} inputMode="numeric" required={isCatering} {...register('guests')} />
            </Field>
          </>
        )}
        {isDeliveryCake && (
          <>
            <Field id={`${kind}-recipient-name`} label="Recipient name" error={errors.recipientName?.message} required>
              <input id={`${kind}-recipient-name`} autoComplete="shipping name" required {...register('recipientName')} />
            </Field>
            <Field id={`${kind}-street-address`} label="Ship-to street address" error={errors.streetAddress?.message} required>
              <input id={`${kind}-street-address`} autoComplete="shipping address-line1" required {...register('streetAddress')} />
            </Field>
            <Field id={`${kind}-address-line-2`} label="Apartment, suite, or company" error={errors.addressLine2?.message}>
              <input id={`${kind}-address-line-2`} autoComplete="shipping address-line2" {...register('addressLine2')} />
            </Field>
            <Field id={`${kind}-city`} label="Ship-to city" error={errors.city?.message} required>
              <input id={`${kind}-city`} autoComplete="shipping address-level2" required {...register('city')} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${kind}-state`} label="State" error={errors.state?.message} required>
                <input id={`${kind}-state`} autoComplete="shipping address-level1" required {...register('state')} />
              </Field>
              <Field id={`${kind}-zip`} label="ZIP code" error={errors.zip?.message} required>
                <input id={`${kind}-zip`} autoComplete="shipping postal-code" inputMode="numeric" required {...register('zip')} />
              </Field>
            </div>
            <Field id={`${kind}-occasion`} label="Occasion" error={errors.occasion?.message} required>
              <select id={`${kind}-occasion`} required {...register('occasion')}>
                <option value="">Select one</option>
                <option value="birthday">Birthday</option>
                <option value="thank-you">Thank you</option>
                <option value="office">Office celebration</option>
                <option value="family">Family moment</option>
                <option value="wedding">Wedding or shower</option>
                <option value="just-because">Just because</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id={`${kind}-gift-message`} label="Gift message" error={errors.giftMessage?.message}>
                <textarea
                  id={`${kind}-gift-message`}
                  rows={3}
                  maxLength={140}
                  {...giftMessageRegistration}
                  onChange={(event) => {
                    giftMessageRegistration.onChange(event);
                    setGiftMessageLength(event.target.value.length);
                  }}
                />
              </Field>
              <p className="gift-message-count">{giftMessageLength}/140 characters</p>
            </div>
          </>
        )}
        {isCatering && (
          <div className="md:col-span-2">
            <Field id={`${kind}-dietary-needs`} label="Dietary or allergen notes" error={errors.dietaryNeeds?.message}>
              <textarea id={`${kind}-dietary-needs`} rows={3} {...register('dietaryNeeds')} />
            </Field>
          </div>
        )}
        {isCareers && (
          <>
            <Field id={`${kind}-street-address`} label="Street Address" error={errors.streetAddress?.message}>
              <input id={`${kind}-street-address`} autoComplete="address-line1" {...register('streetAddress')} />
            </Field>
            <Field id={`${kind}-address-line-2`} label="Address Line 2" error={errors.addressLine2?.message}>
              <input id={`${kind}-address-line-2`} autoComplete="address-line2" {...register('addressLine2')} />
            </Field>
            <Field id={`${kind}-city`} label="City" error={errors.city?.message}>
              <input id={`${kind}-city`} autoComplete="address-level2" {...register('city')} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${kind}-state`} label="State" error={errors.state?.message}>
                <input id={`${kind}-state`} autoComplete="address-level1" {...register('state')} />
              </Field>
              <Field id={`${kind}-zip`} label="ZIP Code" error={errors.zip?.message}>
                <input id={`${kind}-zip`} autoComplete="postal-code" inputMode="numeric" {...register('zip')} />
              </Field>
            </div>
            <Field id={`${kind}-availability`} label="Availability" error={errors.availability?.message} required>
              <select id={`${kind}-availability`} required {...register('availability')}>
                <option value="">Select availability</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </Field>
            <Field id={`${kind}-applying-for`} label="Applying for" error={errors.applyingFor?.message} required>
              <select id={`${kind}-applying-for`} required {...register('applyingFor')}>
                <option value="">Select one</option>
                <option value="immediate-opening">Immediate opening</option>
                <option value="future-opportunity">Future opportunity</option>
                <option value="seasonal">Seasonal</option>
                <option value="general-application">General application</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field
                id={`${kind}-commitments`}
                label="Do you have any commitments to another employer which might affect your work here?"
                error={errors.commitments?.message}
              >
                <textarea id={`${kind}-commitments`} rows={3} {...register('commitments')} />
              </Field>
            </div>
            <CheckboxField
              id={`${kind}-age-confirm`}
              label="Are you at least 18 years of age?"
              error={errors.ageConfirm?.message}
              inputProps={register('ageConfirm')}
              required
            />
            <CheckboxField
              id={`${kind}-work-authorized`}
              label="Are you authorized to work in the U.S. in the position for which you are applying?"
              error={errors.workAuthorized?.message}
              inputProps={register('workAuthorized')}
              required
            />
            <Field id={`${kind}-resume`} label="Resume / CV" error={errors.resume?.message as string | undefined}>
              <input id={`${kind}-resume`} type="file" accept=".pdf,.doc,.docx,.rtf,.txt" {...register('resume')} />
            </Field>
            <Field id={`${kind}-restaurant-experience`} label="Have you worked at a restaurant?" error={errors.restaurantExperience?.message}>
              <select id={`${kind}-restaurant-experience`} {...register('restaurantExperience')}>
                <option value="">Select one</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </Field>
            <Field id={`${kind}-heard-about`} label="How did you hear about this job?" error={errors.heardAbout?.message} required>
              <select id={`${kind}-heard-about`} required {...register('heardAbout')}>
                <option value="">Select one</option>
                <option value="yum-website">yum! website</option>
                <option value="current-employee">Current employee</option>
                <option value="social-media">Social media</option>
                <option value="walk-in">Walk-in</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field
                id={`${kind}-restaurant-roles`}
                label="If yes, what role(s)? Please list the employer(s), job title(s), and dates that you performed these jobs."
                error={errors.restaurantRoles?.message}
              >
                <textarea id={`${kind}-restaurant-roles`} rows={3} {...register('restaurantRoles')} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                id={`${kind}-special-skills`}
                label="Please tell us about your special skills or goals that best qualify you for this job."
                error={errors.specialSkills?.message}
              >
                <textarea id={`${kind}-special-skills`} rows={4} {...register('specialSkills')} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                id={`${kind}-referral`}
                label="If referred by a current yum! employee, please enter employee's first and last name below."
                error={errors.referral?.message}
              >
                <input id={`${kind}-referral`} {...register('referral')} />
              </Field>
            </div>
          </>
        )}
      </div>
      <Field id={`${kind}-message`} label={copy.message} error={errors.message?.message} required>
        <textarea id={`${kind}-message`} rows={6} required {...register('message')} />
      </Field>
      {isCareers && (
        <CheckboxField
          id={`${kind}-promise-true`}
          label="I promise the information provided above is true to the best of my knowledge."
          error={errors.promiseTrue?.message}
          inputProps={register('promiseTrue')}
          required
        />
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : copy.submit}
        </button>
        {serverMessage && (
          <p
            ref={messageRef}
            tabIndex={-1}
            role={status === 'error' ? 'alert' : 'status'}
            className={`font-medium outline-none ${status === 'error' ? 'text-brand-primary' : 'text-ink'}`}
          >
            <span className="font-bold">{status === 'error' ? 'Error: ' : 'Sent: '}</span>
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
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactElement<Record<string, unknown>>;
}) {
  const control = cloneElement(children, {
    'aria-describedby': error ? `${id}-error` : undefined,
    'aria-invalid': error ? 'true' : undefined,
  });

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </label>
      {control}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckboxField({
  id,
  label,
  error,
  inputProps,
  required,
}: {
  id: string;
  label: string;
  error?: string;
  inputProps: UseFormRegisterReturn;
  required?: boolean;
}) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="flex items-start gap-3 font-sans text-sm font-medium leading-snug text-ink">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-brand-primary"
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : undefined}
          {...inputProps}
        />
        <span>
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="field-error mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
