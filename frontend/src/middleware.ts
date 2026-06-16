import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest): NextResponse {
  const res = intlMiddleware(req);
  const location = res.headers.get('location');

  if (!location) {
    return res;
  }

  const url = new URL(location);
  const host =
    req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  if (!isLocal) {
    if (url.port && url.hostname !== 'localhost') {
      url.port = '';
    }
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/', '/(ua|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
