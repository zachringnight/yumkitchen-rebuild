import { NextResponse, type NextRequest } from 'next/server';

const patticakeHosts = new Set(['patticake.com', 'www.patticake.com']);

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();

  if (host && patticakeHosts.has(host) && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/patticake';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
