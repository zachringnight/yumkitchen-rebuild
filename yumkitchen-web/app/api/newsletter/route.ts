import { NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email(),
  company: z.string().optional(),
  sourcePath: z.string().max(200).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  landing_page: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
  }

  if (parsed.data.company) {
    return NextResponse.json({ message: 'Thanks. Your signup was received.' });
  }

  const webhookUrl = process.env.NEWSLETTER_SIGNUP_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json({ message: 'Signup is unavailable right now. Please try again later.' }, { status: 503 });
  }

  const authToken = process.env.NEWSLETTER_SIGNUP_AUTH_TOKEN?.trim();
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        ...parsed.data,
        submitted_at: new Date().toISOString(),
        source: 'yumkitchen.com',
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Signup is unavailable right now. Please try again later.' }, { status: 502 });
    }

    return NextResponse.json({ message: 'Thanks. Your signup was received.' });
  } catch {
    return NextResponse.json({ message: 'Signup is unavailable right now. Please try again later.' }, { status: 502 });
  }
}
