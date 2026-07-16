import { NextResponse, type NextRequest } from 'next/server';
import { getPreviewAccessToken } from '@/lib/previewAuth';

export async function proxy(request: NextRequest) {
  if (process.env.PREVIEW_PROTECTION_ENABLED === 'false') {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get('yum_preview_access')?.value;
  const expectedToken = await getPreviewAccessToken();

  if (accessCookie === expectedToken) {
    return NextResponse.next();
  }

  const previewUrl = request.nextUrl.clone();
  previewUrl.pathname = '/preview';
  previewUrl.search = '';
  previewUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(previewUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|preview|api/preview-access|review-assets|images|og|pdfs|logo.png|robots.txt).*)'],
};
