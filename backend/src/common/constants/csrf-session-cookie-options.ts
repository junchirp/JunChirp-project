import { CookieOptions } from 'express';

export const CSRF_SESSION_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
};
