import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest): NextResponse {
  const response = handleI18nRouting(request);

  const location = response.headers.get('location');
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (location && publicUrl) {
    const url = new URL(location);
    const fixed = `${publicUrl}${url.pathname}${url.search}`;
    response.headers.set('location', fixed);
  }

  return response;
}

export const config = {
  matcher: ['/', '/(ua|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
