import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest): NextResponse {
  const res = intlMiddleware(req);
  const location = res.headers.get('location');

  if (location) {
    const url = new URL(location);
    url.port = '';
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ['/', '/(ua|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
