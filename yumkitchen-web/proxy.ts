import { NextResponse, type NextRequest } from 'next/server';
import { isYumKitchenHost, yumHostRoutingEnabled } from '@/lib/hostRouting';

export function proxy(request: NextRequest) {
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
  matcher: ['/', '/yum-kitchen'],
};
