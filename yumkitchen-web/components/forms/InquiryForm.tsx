'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cloneElement, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { locations } from '@/lib/locations';

export type InquiryKind = 'contact' | 'catering' | 'cake' | 'careers' | 'accessibility';
type CakeMode = 'general' | 'pickup' | 'delivery';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Enter a valid email.'),
  phone: z.string().optional(),
  recipientName: z.string().optional(),
  location: z.string().optional(),
  subject: z.string().min(1, 'Subject is required.'),
  eventDate: z.string().optional(),
  guests: z.string().optional(),
  streetAddress: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  occasion: z.string().optional(),
  giftMessage: z.string().max(140, 'Gift message must be 140 characters or fewer.').optional(),
  availability: z.string().optional(),
  applyingFor: z.string().optional(),
  commitments: z.string().optional(),
  ageConfirm: z.boolean().optional(),
  workAuthorized: z.boolean().optional(),
  highestDegree: z.string().optional(),
  resume: z.any().optional(),
  restaurantExperience: z.string().optional(),
  restaurantRoles: z.string().optional(),
  specialSkills: z.string().optional(),
  heardAbout: z.string().optional(),
  referral: z.string().optional(),
  promiseTrue: z.boolean().optional(),
  message: z.string().min(10, 'Please share a little more detail.'),
  company: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof schema>;

function formSchemaFor(kind: InquiryKind, cakeMode: CakeMode) {
  return schema.superRefine((values, ctx) => {
    if (kind === 'cake' && cakeMode === 'pickup') {
      const requiredFields: Array<[keyof InquiryFormValues, string]> = [
        ['location', 'Pickup restaurant is required.'],
        ['eventDate', 'Pickup date is required.'],
      ];

      for (const [field, message] of requiredFields) {
        const value = values[field];
        if (typeof value !== 'string' || !value.trim()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
        }
      }
    }

    if (kind === 'cake' && cakeMode === 'delivery') {
      const requiredFields: Array<[keyof InquiryFormValues, string]> = [
        ['recipientName', 'Recipient name is required.'],
        ['eventDate', 'Requested delivery date is required.'],
        ['streetAddress', 'Street address is required.'],
        ['city', 'City is required.'],
        ['state', 'State is required.'],
        ['zip', 'ZIP code is required.'],
        ['occasion', 'Occasion is required.'],
      ];

      for (const [field, message] of requiredFields) {
        const value = values[field];
        if (typeof value !== 'string' || !value.trim()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
        }
      }
    }

    if (kind !== 'careers') return;

    const requiredFields: Array<[keyof InquiryFormValues, string]> = [
      ['phone', 'Phone is required.'],
      ['location', 'Location is required.'],
      ['availability', 'Availability is required.'],
      ['applyingFor', 'Applying for is required.'],
      ['highestDegree', 'Highest degree is required.'],
      ['heardAbout', 'Please tell us how you heard about this job.'],
    ];

    for (const [field, message] of requiredFields) {
      const value = values[field];
      if (typeof value !== 'string' || !value.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }

    const requiredChecks: Array<[keyof InquiryFormValues, string]> = [
      ['ageConfirm', 'Please confirm your age.'],
      ['workAuthorized', 'Please confirm work authorization.'],
      ['promiseTrue', 'Please confirm the application is accurate.'],
    ];

    for (const [field, message] of requiredChecks) {
      if (values[field] !== true) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }

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
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaults,
  });
  const giftMessageRegistration = register('giftMessage');

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
        form_kind: kind,
        location: values.location ?? '',
        path: window.location.pathname,
      });
      setStatus('success');
      setServerMessage(successMessage ?? payload.message ?? 'Thanks. We received your note.');
      reset(defaults);
      setGiftMessageLength(0);
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
        {showLocation && (
          <Field id={`${kind}-location`} label={locationLabel ?? 'Location'} error={errors.location?.message} required={requiresCakeLocation}>
            <select id={`${kind}-location`} required={requiresCakeLocation} {...register('location')}>
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
              <option value="na">N/A</option>
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
            <Field id={`${kind}-event-date`} label={eventDateLabel ?? (kind === 'cake' ? 'Date of Event' : 'Event Date')} error={errors.eventDate?.message} required={requiresCakeDate}>
              <input id={`${kind}-event-date`} type="date" required={requiresCakeDate} {...register('eventDate')} />
            </Field>
            <Field id={`${kind}-guests`} label={guestsLabel ?? 'Guests'} error={errors.guests?.message}>
              <input id={`${kind}-guests`} inputMode="numeric" {...register('guests')} />
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
            <Field id={`${kind}-highest-degree`} label="Highest Degree Achieved?" error={errors.highestDegree?.message} required>
              <select id={`${kind}-highest-degree`} required {...register('highestDegree')}>
                <option value="">Select one</option>
                <option value="high-school">High school</option>
                <option value="some-college">Some college</option>
                <option value="college-degree">College degree</option>
                <option value="other">Other</option>
              </select>
            </Field>
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
