'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cloneElement, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';
import { pushAnalyticsEvent } from '@/lib/analytics';
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
  streetAddress: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
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

function formSchemaFor(kind: InquiryKind) {
  return schema.superRefine((values, ctx) => {
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
}: InquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const messageRef = useRef<HTMLParagraphElement>(null);
  const copy = {
    ...labels[kind],
    ...(messageLabel ? { message: messageLabel } : {}),
    ...(submitLabel ? { submit: submitLabel } : {}),
  };
  const requiresEventDetails = kind === 'catering' || kind === 'cake';
  const isCareers = kind === 'careers';
  const validationSchema = useMemo(() => formSchemaFor(kind), [kind]);
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

  function getBody(values: InquiryFormValues) {
    if (!isCareers) {
      return {
        body: JSON.stringify({ kind, ...values }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const body = new FormData();
    body.append('kind', kind);
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
      setServerMessage(payload.message ?? 'Thanks. We received your note.');
      reset(defaults);
    } catch {
      setStatus('error');
      setServerMessage('The message could not be sent. Please call a yum! location.');
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
            <Field id={`${kind}-availability`} label="Availability" error={errors.availability?.message}>
              <select id={`${kind}-availability`} required {...register('availability')}>
                <option value="">Select availability</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </Field>
            <Field id={`${kind}-applying-for`} label="Applying for" error={errors.applyingFor?.message}>
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
            />
            <CheckboxField
              id={`${kind}-work-authorized`}
              label="Are you authorized to work in the U.S. in the position for which you are applying?"
              error={errors.workAuthorized?.message}
              inputProps={register('workAuthorized')}
            />
            <Field id={`${kind}-highest-degree`} label="Highest Degree Achieved?" error={errors.highestDegree?.message}>
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
            <Field id={`${kind}-heard-about`} label="How did you hear about this job?" error={errors.heardAbout?.message}>
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
      <Field id={`${kind}-message`} label={copy.message} error={errors.message?.message}>
        <textarea id={`${kind}-message`} rows={6} required {...register('message')} />
      </Field>
      {isCareers && (
        <CheckboxField
          id={`${kind}-promise-true`}
          label="I promise the information provided above is true to the best of my knowledge."
          error={errors.promiseTrue?.message}
          inputProps={register('promiseTrue')}
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

function CheckboxField({
  id,
  label,
  error,
  inputProps,
}: {
  id: string;
  label: string;
  error?: string;
  inputProps: UseFormRegisterReturn;
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
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="field-error mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
