import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { config } from '../../config/env.js';
import type { JwtAccessPayload, JwtRefreshPayload, UserRole } from '@amozesh/shared';

export interface AccessTokenResult {
  token: string;
  expiresIn: string;
}

export interface RefreshTokenResult extends AccessTokenResult {
  tokenId: string;
}

/** ساخت access token کوتاه‌عمر */
export function signAccessToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
  deviceId?: string;
}): AccessTokenResult {
  const jwtPayload: JwtAccessPayload = {
    sub: payload.userId,
    email: payload.email,
    role: payload.role,
    ...(payload.deviceId ? { deviceId: payload.deviceId } : {}),
  };
  const token = jwt.sign(jwtPayload, config.env.JWT_ACCESS_SECRET, {
    expiresIn: config.env.JWT_ACCESS_EXPIRES_IN as any,
  });
  return { token, expiresIn: config.env.JWT_ACCESS_EXPIRES_IN };
}

/** ساخت refresh token طولانی‌عمر + tokenId یکتا برای rotation */
export function signRefreshToken(payload: {
  userId: string;
  deviceId?: string;
}): RefreshTokenResult {
  const tokenId = randomUUID();
  const jwtPayload: JwtRefreshPayload = {
    sub: payload.userId,
    tokenId,
    ...(payload.deviceId ? { deviceId: payload.deviceId } : {}),
  };
  const token = jwt.sign(jwtPayload, config.env.JWT_REFRESH_SECRET, {
    expiresIn: config.env.JWT_REFRESH_EXPIRES_IN as any,
  });
  return { token, tokenId, expiresIn: config.env.JWT_REFRESH_EXPIRES_IN };
}

/** اعتبارسنجی access token */
export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, config.env.JWT_ACCESS_SECRET) as JwtAccessPayload;
}

/** اعتبارسنجی refresh token */
export function verifyRefreshToken(token: string): JwtRefreshPayload {
  return jwt.verify(token, config.env.JWT_REFRESH_SECRET) as JwtRefreshPayload;
}

/** تبدیل رشته‌ی مدت‌زمان (مانند "7d") به میلی‌ثانیه برای محاسبه‌ی انقضا */
export function parseExpiryToMs(expiresIn: string): number {
  const match = /^(\d+)([smhd])$/.exec(expiresIn.trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000; // پیش‌فرض ۷ روز
  const value = Number(match[1]);
  const unit = match[2];
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * units[unit];
}

export interface TokenPair {
  accessToken: string;
  accessExpiresIn: string;
  refreshToken: string;
  refreshTokenId: string;
  refreshExpiresIn: string;
  refreshExpiresAt: Date;
}

/** ساخت جفت توکن کامل (access + refresh) */
export function generateTokenPair(args: {
  userId: string;
  email: string;
  role: UserRole;
  deviceId?: string;
}): TokenPair {
  const access = signAccessToken(args);
  const refresh = signRefreshToken({ userId: args.userId, deviceId: args.deviceId });
  const refreshExpiresAt = new Date(Date.now() + parseExpiryToMs(refresh.expiresIn));
  return {
    accessToken: access.token,
    accessExpiresIn: access.expiresIn,
    refreshToken: refresh.token,
    refreshTokenId: refresh.tokenId,
    refreshExpiresIn: refresh.expiresIn,
    refreshExpiresAt,
  };
}
