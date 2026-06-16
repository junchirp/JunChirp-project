import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');

  if (host && !host.includes('localhost')) {
    url.host = host;
    url.port = '';
  }

  const patchedReq = new NextRequest(url, req);
  return intlMiddleware(patchedReq);
}

export const config = {
  matcher: ['/', '/(ua|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
