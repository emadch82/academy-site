import type { NextFunction, Request, Response } from 'express';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  type UserDto,
} from '@amozesh/shared';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshTokenUser,
  COOKIES,
} from './auth.service.js';
import { setAuthCookies, clearAuthCookies } from './cookie.helper.js';
import { Errors } from '@amozesh/shared';

/** تبدیل UserDocument به UserDto (بدون داده‌ی حساس) */
function toUserDto(user: {
  _id: { toString(): string };
  email: string;
  mobile: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): UserDto {
  return {
    id: user._id.toString(),
    email: user.email,
    mobile: user.mobile,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl ?? undefined,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/** POST /auth/register */
export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const input = registerSchema.parse(req.body);
  const { user, tokens } = await registerUser(input);
  setAuthCookies(res, tokens);
  res.created(
    { user: toUserDto(user) },
    'ثبت‌نام با موفقیت انجام شد',
  );
});

/** POST /auth/login */
export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const input = loginSchema.parse(req.body);
  const { user, tokens } = await loginUser(input);
  setAuthCookies(res, tokens);
  res.ok({ user: toUserDto(user) }, 'ورود با موفقیت انجام شد');
});

/** POST /auth/refresh */
export const refresh = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  // اول از کوکی، سپس از body
  const tokenFromCookie = req.cookies?.[COOKIES.REFRESH_TOKEN] as string | undefined;
  const body = refreshTokenSchema.safeParse(req.body);
  const token = tokenFromCookie ?? body.success
    ? body.data?.refreshToken
    : undefined;
  if (!token) {
    throw Errors.badRequest('refresh token یافت نشد');
  }
  const { user, tokens } = await refreshTokenUser(token);
  setAuthCookies(res, tokens);
  res.ok({ user: toUserDto(user) }, 'توکن‌ها با موفقیت تمدید شدند');
});

/** POST /auth/logout */
export const logout = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const tokenFromCookie = req.cookies?.[COOKIES.REFRESH_TOKEN] as string | undefined;
  await logoutUser(tokenFromCookie);
  clearAuthCookies(res);
  res.ok({}, 'خروج با موفقیت انجام شد');
});

export const authValidators = { validate };
