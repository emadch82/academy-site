import type { CookieOptions, Response } from 'express';
import { config } from '../../config/env.js';
import { COOKIES } from '@amozesh/shared';
import type { TokenPair } from './token.service.js';

/** گزینه‌های کوکی — httpOnly + Secure + SameSite امن */
function baseCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'strict' : 'lax',
    domain: config.isProd ? config.env.COOKIE_DOMAIN : undefined,
    path: '/',
    maxAge: maxAgeMs,
  };
}

/** تنظیم access + refresh در کوکی httpOnly */
export function setAuthCookies(res: Response, pair: TokenPair): void {
  // access token: کوتاه‌مدت
  res.cookie(COOKIES.ACCESS_TOKEN, pair.accessToken, baseCookieOptions(15 * 60 * 1000));
  // refresh token: بلندمدت
  res.cookie(
    COOKIES.REFRESH_TOKEN,
    pair.refreshToken,
    baseCookieOptions(7 * 24 * 60 * 60 * 1000),
  );
}

/** پاک کردن کوکی‌های احراز هویت (logout) */
export function clearAuthCookies(res: Response): void {
  res.clearCookie(COOKIES.ACCESS_TOKEN, { path: '/' });
  res.clearCookie(COOKIES.REFRESH_TOKEN, { path: '/' });
}
