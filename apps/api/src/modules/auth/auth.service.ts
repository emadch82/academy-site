import { UserModel, type UserDocument } from '@amozesh/database';
import { Errors, UserRole, COOKIES, type RegisterInput, type LoginInput } from '@amozesh/shared';
import { generateTokenPair, type TokenPair } from './token.service.js';

/** خروجی احراز هویت: کاربر + جفت توکن */
export interface AuthResult {
  user: UserDocument;
  tokens: TokenPair;
}

/** ثبت‌نام کاربر تازه (نقش پیش‌فرض: دانشجو) */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  // بررسی تکرار نبودن email/mobile
  const exists = await UserModel.findOne({
    $or: [{ email: input.email }, { mobile: input.mobile }],
  }).lean();
  if (exists) {
    throw Errors.conflict('کاربری با این ایمیل یا موبایل قبلاً ثبت شده است');
  }

  const user = new UserModel({
    fullName: input.fullName,
    email: input.email,
    mobile: input.mobile,
    password: input.password,
    role: UserRole.STUDENT,
  });
  await user.save();

  const tokens = generateTokenPair({
    userId: String(user._id),
    email: user.email,
    role: user.role as UserRole,
  });

  // ذخیره‌ی refresh token در دیتابیس (برای rotation + revoke)
  user.refreshTokens = [
    {
      tokenId: tokens.refreshTokenId,
      deviceId: null,
      expiresAt: tokens.refreshExpiresAt,
      createdAt: new Date(),
      revokedAt: null,
    },
  ];
  user.lastLoginAt = new Date();
  await user.save();

  return { user, tokens };
}

/** ورود با ایمیل/موبایل + رمز عبور */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const identifier = input.identifier.trim().toLowerCase();

  // پیدا کردن کاربر (با انتخاب رمز)
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { mobile: identifier }],
  }).select('+password +refreshTokens');

  if (!user) {
    throw Errors.unauthorized('شناسه یا رمز عبور نادرست است');
  }

  if (!user.isActive) {
    throw Errors.forbidden('حساب کاربری شما غیرفعال است');
  }

  if (user.isLocked) {
    throw Errors.forbidden('حساب کاربری به‌طور موقت قفل شده است، بعداً تلاش کنید');
  }

  // مقایسه‌ی رمز
  const ok = await user.comparePassword(input.password);
  if (!ok) {
    await handleFailedLogin(user);
    throw Errors.unauthorized('شناسه یا رمز عبور نادرست است');
  }

  // ریست قفل و شمارش
  user.loginAttempts = 0;
  user.lockUntil = null;

  const tokens = generateTokenPair({
    userId: String(user._id),
    email: user.email,
    role: user.role as UserRole,
  });

  // افزودن refresh token جدید (rotation)
  user.refreshTokens.push({
    tokenId: tokens.refreshTokenId,
    deviceId: null,
    expiresAt: tokens.refreshExpiresAt,
    createdAt: new Date(),
    revokedAt: null,
  });
  user.cleanupRefreshTokens();
  user.lastLoginAt = new Date();
  await user.save();

  return { user, tokens };
}

/** refresh: صدور جفت توکن جدید با باطل‌کردن توکن قبلی (rotation) */
export async function refreshTokenUser(refreshToken: string): Promise<AuthResult> {
  // اعتبارسنجی امضا
  let payload;
  try {
    payload = jwtVerify(refreshToken);
  } catch {
    throw Errors.unauthorized('refresh token نامعتبر است');
  }

  const user = await UserModel.findById(payload.sub).select('+refreshTokens');
  if (!user || !user.isActive) {
    throw Errors.unauthorized('کاربر یافت نشد یا غیرفعال است');
  }

  // پیدا کردن رکورد توکن
  const stored = user.refreshTokens.find((t) => t.tokenId === payload.tokenId);
  if (!stored || stored.revokedAt) {
    // تلاش برای استفاده‌ی مجدد از توکن باطل‌شده → احتمال سرقت؛ همه‌ی توکن‌ها را باطل کن
    user.refreshTokens.forEach((t) => {
      if (!t.revokedAt) t.revokedAt = new Date();
    });
    await user.save();
    throw Errors.unauthorized('refresh token نامعتبر یا باطل شده است');
  }

  // باطل کردن توکن فعلی (rotation)
  stored.revokedAt = new Date();

  const newTokens = generateTokenPair({
    userId: String(user._id),
    email: user.email,
    role: user.role as UserRole,
  });

  user.refreshTokens.push({
    tokenId: newTokens.refreshTokenId,
    deviceId: stored.deviceId,
    expiresAt: newTokens.refreshExpiresAt,
    createdAt: new Date(),
    revokedAt: null,
  });
  user.cleanupRefreshTokens();
  await user.save();

  return { user, tokens: newTokens };
}

/** خروج: باطل کردن refresh token جاری */
export async function logoutUser(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  let payload;
  try {
    payload = jwtVerify(refreshToken);
  } catch {
    return; // توکن نامعتبر است؛ در logout نادیده بگیر
  }
  const user = await UserModel.findById(payload.sub).select('+refreshTokens');
  if (!user) return;
  const stored = user.refreshTokens.find((t) => t.tokenId === payload.tokenId);
  if (stored && !stored.revokedAt) {
    stored.revokedAt = new Date();
    await user.save();
  }
}

// ── internal helpers ───────────────────────────────────────────────────────
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // ۱۵ دقیقه

async function handleFailedLogin(user: UserDocument): Promise<void> {
  user.loginAttempts = (user.loginAttempts ?? 0) + 1;
  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
  }
  await user.save();
}

// برای جلوگیری از import دایر، تابع جدا
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
function jwtVerify(token: string): { sub: string; tokenId: string } {
  return jwt.verify(token, config.env.JWT_REFRESH_SECRET) as { sub: string; tokenId: string };
}

/** نام کوکی (برای استخراج در controller) */
export { COOKIES };
