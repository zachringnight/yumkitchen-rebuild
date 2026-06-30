import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { formSubjects } from '@/lib/site';

const inquirySchema = z
  .object({
    kind: z.enum(['contact', 'catering', 'cake', 'careers', 'accessibility']),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    subject: z.string().min(1),
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
    restaurantExperience: z.string().optional(),
    restaurantRoles: z.string().optional(),
    specialSkills: z.string().optional(),
    heardAbout: z.string().optional(),
    referral: z.string().optional(),
    promiseTrue: z.boolean().optional(),
    message: z.string().min(10),
    company: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind !== 'careers') return;

    const requiredStrings: Array<[keyof typeof data, string]> = [
      ['phone', 'Phone is required.'],
      ['location', 'Location is required.'],
      ['availability', 'Availability is required.'],
      ['applyingFor', 'Applying for is required.'],
      ['highestDegree', 'Highest degree is required.'],
      ['heardAbout', 'How you heard about this job is required.'],
    ];

    for (const [field, message] of requiredStrings) {
      const value = data[field];
      if (typeof value !== 'string' || !value.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }

    const requiredChecks: Array<[keyof typeof data, string]> = [
      ['ageConfirm', 'Age confirmation is required.'],
      ['workAuthorized', 'Work authorization confirmation is required.'],
      ['promiseTrue', 'Application accuracy confirmation is required.'],
    ];

    for (const [field, message] of requiredChecks) {
      if (data[field] !== true) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }
  });

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
        location: stringValue(formData.get('location')),
        subject: stringValue(formData.get('subject')),
        eventDate: stringValue(formData.get('eventDate')),
        guests: stringValue(formData.get('guests')),
        streetAddress: stringValue(formData.get('streetAddress')),
        addressLine2: stringValue(formData.get('addressLine2')),
        city: stringValue(formData.get('city')),
        state: stringValue(formData.get('state')),
        zip: stringValue(formData.get('zip')),
        availability: stringValue(formData.get('availability')),
        applyingFor: stringValue(formData.get('applyingFor')),
        commitments: stringValue(formData.get('commitments')),
        ageConfirm: toBoolean(formData.get('ageConfirm')),
        workAuthorized: toBoolean(formData.get('workAuthorized')),
        highestDegree: stringValue(formData.get('highestDegree')),
        restaurantExperience: stringValue(formData.get('restaurantExperience')),
        restaurantRoles: stringValue(formData.get('restaurantRoles')),
        specialSkills: stringValue(formData.get('specialSkills')),
        heardAbout: stringValue(formData.get('heardAbout')),
        referral: stringValue(formData.get('referral')),
        promiseTrue: toBoolean(formData.get('promiseTrue')),
        message: stringValue(formData.get('message')),
        company: stringValue(formData.get('company')),
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

  const to = process.env.YUM_FORMS_TO ?? 'info@yumkitchen.com';
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
          line('Highest Degree Achieved', data.highestDegree),
          line('Resume / CV file', payload.resumeFile?.name),
          line('Worked at a restaurant', data.restaurantExperience),
          line('Restaurant role history', data.restaurantRoles),
          line('Special skills or goals', data.specialSkills),
          line('How did you hear about this job', data.heardAbout),
          line('Employee referral', data.referral),
          line('Application promise', data.promiseTrue),
        ]
      : [];
  const text = [
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ?? ''}`,
    `Location: ${data.location ?? ''}`,
    `Event Date: ${data.eventDate ?? ''}`,
    `Guests: ${data.guests ?? ''}`,
    ...careerLines,
    '',
    data.message,
  ].join('\n');

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        message: 'Email delivery is disabled until RESEND_API_KEY is configured. Please call a yum! location.',
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
    return NextResponse.json({ message: 'The message could not be sent. Please call a yum! location.' }, { status: 502 });
  }
}
