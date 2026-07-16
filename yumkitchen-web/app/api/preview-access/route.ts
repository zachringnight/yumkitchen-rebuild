import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPreviewAccessToken, getPreviewPassword, previewAccessCookie } from '@/lib/previewAuth';

const accessSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = accessSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.password !== getPreviewPassword()) {
    return NextResponse.json({ message: 'That password does not match. Try again.' }, { status: 401 });
  }

  const response = NextResponse.json({ message: 'Preview unlocked.' });
  response.cookies.set(previewAccessCookie, await getPreviewAccessToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
