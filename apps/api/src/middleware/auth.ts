import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Errors, BEARER_PREFIX, COOKIES, UserRole } from '@amozesh/shared';
import { UserModel } from '@amozesh/database';

/**
 * استخراج توکن از هدر Authorization یا کوکی.
 * اولویت: Bearer header، سپس access cookie.
 */
function extractToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header?.startsWith(BEARER_PREFIX)) {
    return header.slice(BEARER_PREFIX.length).trim();
  }
  return req.cookies?.[COOKIES.ACCESS_TOKEN] as string | undefined;
}

/**
 * Guard احراز هویت — توکن را بررسی و req.user را تنظیم می‌کند.
 * اگر optional=true باشد، در نبود توکن خطا نمی‌دهد.
 */
export function authenticate(options: { optional?: boolean } = {}) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractToken(req);
    if (!token) {
      if (options.optional) return next();
      return next(Errors.unauthorized('احراز هویت لازم است'));
    }

    let payload;
    try {
      payload = jwt.verify(token, config.env.JWT_ACCESS_SECRET) as {
        sub: string;
        email: string;
        role: UserRole;
        deviceId?: string;
      };
    } catch {
      if (options.optional) return next();
      return next(Errors.unauthorized('توکن نامعتبر یا منقضی است'));
    }

    // بارگذاری کاربر از دیتابیس (برای اطمینان از فعال بودن)
    const user = await UserModel.findById(payload.sub).lean();
    if (!user || !user.isActive || user.isDeleted) {
      if (options.optional) return next();
      return next(Errors.unauthorized('کاربر یافت نشد یا غیرفعال است'));
    }

    req.user = {
      id: String(user._id),
      email: user.email,
      mobile: user.mobile,
      role: user.role as UserRole,
      isActive: user.isActive,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl ?? undefined,
    };

    next();
  };
}

/**
 * Guard کنترل نقش (RBAC) — فقط نقش‌های مجاز اجازه‌ی عبور دارند.
 * @example router.get('/admin', authenticate(), authorize(UserRole.ADMIN), ...)
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(Errors.unauthorized('ابتدا احراز هویت کنید'));
    }
    if (allowedRoles.length === 0) return next();
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(Errors.forbidden('دسترسی به این بخش مجاز نیست'));
    }
    next();
  };
}

/** میانبر: فقط مدیر */
export const adminOnly = () => authorize(UserRole.ADMIN);
/** میانبر: کارمند و بالاتر */
export const staffOnly = () => authorize(UserRole.ADMIN, UserRole.STAFF);
/** میانبر: مدرس و بالاتر */
export const teacherOnly = () => authorize(UserRole.ADMIN, UserRole.TEACHER);
