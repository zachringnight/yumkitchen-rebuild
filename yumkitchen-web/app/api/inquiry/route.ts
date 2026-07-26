import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import {
  addCareersIssues,
  addMissingStringIssues,
  cakeDeliveryRequiredFields,
  inquiryFieldsSchema,
  inquiryKinds,
} from '@/lib/inquiryValidation';
import { formSubjects } from '@/lib/site';

const inquirySchema = inquiryFieldsSchema
  .extend({
    kind: z.enum(inquiryKinds),
    organization: z.string().optional(),
    eventTime: z.string().optional(),
    dietaryNeeds: z.string().optional(),
    sourcePath: z.string().max(200).optional(),
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    landing_page: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === 'catering') {
      const requiredCateringStrings: Array<[keyof typeof data, string]> = [
        ['location', 'Pickup restaurant is required.'],
        ['eventDate', 'Event date is required.'],
        ['eventTime', 'Event time is required.'],
        ['guests', 'Guest count is required.'],
      ];

      for (const [field, message] of requiredCateringStrings) {
        const value = data[field];
        if (typeof value !== 'string' || !value.trim()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
        }
      }
    }

    if (data.kind === 'cake') {
      const subject = data.subject.toLowerCase();
      const sourcePath = data.sourcePath?.toLowerCase() ?? '';
      const hasShippingSignal =
        sourcePath.startsWith('/patticake') ||
        subject.includes('ship') ||
        Boolean(data.recipientName?.trim() || data.streetAddress?.trim() || data.city?.trim() || data.state?.trim() || data.zip?.trim());

      if (hasShippingSignal) {
        addMissingStringIssues(data, ctx, cakeDeliveryRequiredFields);
      }
    }

    if (data.kind !== 'careers') return;

    addCareersIssues(data, ctx);
  });

const locationRecipientEnv: Record<string, string | undefined> = {
  'st-louis-park': process.env.YUM_FORMS_TO_ST_LOUIS_PARK,
  'shady-oak': process.env.YUM_FORMS_TO_SHADY_OAK,
  'saint-paul': process.env.YUM_FORMS_TO_SAINT_PAUL,
  woodbury: process.env.YUM_FORMS_TO_WOODBURY,
};

const locationRoutedKinds = new Set(['cake', 'catering']);

function resolveRecipient(kind: string, location: string | undefined, fallback: string) {
  if (!location || !locationRoutedKinds.has(kind)) return fallback;
  const routed = locationRecipientEnv[location]?.trim();
  return routed || fallback;
}

function yesNo(value?: boolean) {
  return value ? 'Yes' : 'No';
}

function line(label: string, value?: string | boolean) {
  if (typeof value === 'boolean') return `${label}: ${yesNo(value)}`;
  return `${label}: ${value ?? ''}`;
}

const maxResumeSize = 10 * 1024 * 1024;
const allowedResumeExtensions = /\.(pdf|doc|docx|rtf|txt)$/i;

function toBoolean(value: FormDataEntryValue | null) {
  return value === 'true' || value === 'on';
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value : undefined;
}

async function getPayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const resumeValue = formData.get('resume');
    const resumeFile = resumeValue instanceof File && resumeValue.size > 0 ? resumeValue : null;
    return {
      data: {
        kind: stringValue(formData.get('kind')),
        firstName: stringValue(formData.get('firstName')),
        lastName: stringValue(formData.get('lastName')),
        email: stringValue(formData.get('email')),
        phone: stringValue(formData.get('phone')),
        organization: stringValue(formData.get('organization')),
        location: stringValue(formData.get('location')),
        subject: stringValue(formData.get('subject')),
        eventDate: stringValue(formData.get('eventDate')),
        eventTime: stringValue(formData.get('eventTime')),
        guests: stringValue(formData.get('guests')),
        dietaryNeeds: stringValue(formData.get('dietaryNeeds')),
        recipientName: stringValue(formData.get('recipientName')),
        streetAddress: stringValue(formData.get('streetAddress')),
        addressLine2: stringValue(formData.get('addressLine2')),
        city: stringValue(formData.get('city')),
        state: stringValue(formData.get('state')),
        zip: stringValue(formData.get('zip')),
        occasion: stringValue(formData.get('occasion')),
        giftMessage: stringValue(formData.get('giftMessage')),
        availability: stringValue(formData.get('availability')),
        applyingFor: stringValue(formData.get('applyingFor')),
        commitments: stringValue(formData.get('commitments')),
        ageConfirm: toBoolean(formData.get('ageConfirm')),
        workAuthorized: toBoolean(formData.get('workAuthorized')),
        restaurantExperience: stringValue(formData.get('restaurantExperience')),
        restaurantRoles: stringValue(formData.get('restaurantRoles')),
        specialSkills: stringValue(formData.get('specialSkills')),
        heardAbout: stringValue(formData.get('heardAbout')),
        referral: stringValue(formData.get('referral')),
        promiseTrue: toBoolean(formData.get('promiseTrue')),
        message: stringValue(formData.get('message')),
        company: stringValue(formData.get('company')),
        sourcePath: stringValue(formData.get('sourcePath')),
        utm_source: stringValue(formData.get('utm_source')),
        utm_medium: stringValue(formData.get('utm_medium')),
        utm_campaign: stringValue(formData.get('utm_campaign')),
        utm_content: stringValue(formData.get('utm_content')),
        utm_term: stringValue(formData.get('utm_term')),
        landing_page: stringValue(formData.get('landing_page')),
        referrer: stringValue(formData.get('referrer')),
      },
      resumeFile,
    };
  }

  return {
    data: await request.json().catch(() => null),
    resumeFile: null,
  };
}

function validateResume(resumeFile: File | null) {
  if (!resumeFile) return null;
  if (resumeFile.size > maxResumeSize) {
    return 'Resume must be 10 MB or smaller.';
  }
  if (!allowedResumeExtensions.test(resumeFile.name)) {
    return 'Upload a PDF, DOC, DOCX, RTF, or TXT resume.';
  }
  return null;
}

export async function POST(request: Request) {
  const payload = await getPayload(request);
  const parsed = inquirySchema.safeParse(payload.data);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Please check the required fields and try again.' }, { status: 400 });
  }

  const data = parsed.data;
  const resumeError = validateResume(payload.resumeFile);
  if (resumeError) {
    return NextResponse.json({ message: resumeError }, { status: 400 });
  }

  if (data.company) {
    return NextResponse.json({ message: 'Thanks. We received your note.' });
  }

  const fallbackTo = process.env.YUM_FORMS_TO ?? 'info@yumkitchen.com';
  const to = resolveRecipient(data.kind, data.location, fallbackTo);
  const from = process.env.RESEND_FROM ?? 'yum! website <onboarding@resend.dev>';
  const subject = `${formSubjects[data.kind]}: ${data.subject}`;
  const careerLines =
    data.kind === 'careers'
      ? [
          '',
          'Application details',
          line('Street Address', data.streetAddress),
          line('Address Line 2', data.addressLine2),
          line('City', data.city),
          line('State', data.state),
          line('ZIP Code', data.zip),
          line('Availability', data.availability),
          line('Applying for', data.applyingFor),
          line('Commitments to another employer', data.commitments),
          line('At least 18 years of age', data.ageConfirm),
          line('Authorized to work in the U.S.', data.workAuthorized),
          line('Resume / CV file', payload.resumeFile?.name),
          line('Worked at a restaurant', data.restaurantExperience),
          line('Restaurant role history', data.restaurantRoles),
          line('Special skills or goals', data.specialSkills),
          line('How did you hear about this job', data.heardAbout),
          line('Employee referral', data.referral),
          line('Application promise', data.promiseTrue),
        ]
      : [];
  const cakeLines =
    data.kind === 'cake'
      ? [
          '',
          'Delivery details',
          line('Recipient name', data.recipientName),
          line('Street Address', data.streetAddress),
          line('Address Line 2', data.addressLine2),
          line('City', data.city),
          line('State', data.state),
          line('ZIP Code', data.zip),
          line('Occasion', data.occasion),
          line('Gift message', data.giftMessage),
        ]
      : [];
  const cateringLines =
    data.kind === 'catering'
      ? [
          '',
          'Catering details',
          line('Company or organization', data.organization),
          line('Event time', data.eventTime),
          line('Dietary or allergen notes', data.dietaryNeeds),
        ]
      : [];
  const attributionLines = [
    '',
    'Attribution',
    line('Landing page', data.landing_page),
    line('Referrer', data.referrer),
    line('UTM source', data.utm_source),
    line('UTM medium', data.utm_medium),
    line('UTM campaign', data.utm_campaign),
    line('UTM content', data.utm_content),
    line('UTM term', data.utm_term),
  ];
  const text = [
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ?? ''}`,
    `Location: ${data.location ?? ''}`,
    `Event Date: ${data.eventDate ?? ''}`,
    `Guests: ${data.guests ?? ''}`,
    `Source: ${data.sourcePath ?? ''}`,
    ...careerLines,
    ...cakeLines,
    ...cateringLines,
    ...attributionLines,
    '',
    data.message,
  ].join('\n');

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        message: 'Email delivery is disabled until RESEND_API_KEY is configured. Please call a yum! restaurant.',
      },
      { status: 503 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const attachments = payload.resumeFile
      ? [
          {
            filename: payload.resumeFile.name,
            content: Buffer.from(await payload.resumeFile.arrayBuffer()),
            contentType: payload.resumeFile.type || undefined,
          },
        ]
      : undefined;

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
      attachments,
    });
    return NextResponse.json({ message: 'Thanks. We received your note.' });
  } catch {
    return NextResponse.json({ message: 'The message could not be sent. Please call a yum! restaurant.' }, { status: 502 });
  }
}
