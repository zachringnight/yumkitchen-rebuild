import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { formSubjects } from '@/lib/site';

const inquirySchema = z.object({
  kind: z.enum(['contact', 'catering', 'cake', 'careers', 'accessibility']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  subject: z.string().min(1),
  eventDate: z.string().optional(),
  guests: z.string().optional(),
  message: z.string().min(10),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Please check the required fields and try again.' }, { status: 400 });
  }

  const data = parsed.data;
  if (data.company) {
    return NextResponse.json({ message: 'Thanks. We received your note.' });
  }

  const to = process.env.YUM_FORMS_TO ?? 'info@yumkitchen.com';
  const from = process.env.RESEND_FROM ?? 'yum! website <onboarding@resend.dev>';
  const subject = `${formSubjects[data.kind]}: ${data.subject}`;
  const text = [
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ?? ''}`,
    `Location: ${data.location ?? ''}`,
    `Event Date: ${data.eventDate ?? ''}`,
    `Guests: ${data.guests ?? ''}`,
    '',
    data.message,
  ].join('\n');

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({
      message: 'Thanks. We received your note. Email delivery is disabled until RESEND_API_KEY is configured.',
      preview: true,
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
    });
    return NextResponse.json({ message: 'Thanks. We received your note.' });
  } catch {
    return NextResponse.json({ message: 'The message could not be sent. Please call a yum! location.' }, { status: 502 });
  }
}
