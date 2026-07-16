import { NextResponse, type NextRequest } from 'next/server';
import { isYumKitchenHost, yumHostRoutingEnabled } from '@/lib/hostRouting';
import { getPreviewAccessToken } from '@/lib/previewAuth';

export async function proxy(request: NextRequest) {
  if (process.env.PREVIEW_PROTECTION_ENABLED !== 'false') {
    const accessCookie = request.cookies.get('yum_preview_access')?.value;
    const expectedToken = await getPreviewAccessToken();

    if (accessCookie !== expectedToken) {
      const previewUrl = request.nextUrl.clone();
      previewUrl.pathname = '/preview';
      previewUrl.search = '';
      previewUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(previewUrl);
    }
  }

  if (!yumHostRoutingEnabled || !isYumKitchenHost(request.headers.get('host'))) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // yumkitchen.com serves the restaurant home at the bare domain.
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/yum-kitchen';
    return NextResponse.rewrite(url);
  }

  // Consolidate the duplicate: /yum-kitchen on the yum host lives at /.
  if (pathname === '/yum-kitchen') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|preview|api/preview-access|review-assets|images|og|pdfs|logo.png|robots.txt).*)'],
};
