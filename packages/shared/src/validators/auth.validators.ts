import { z } from 'zod';
import {
  EMAIL_REGEX,
  IRAN_MOBILE_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '../constants/index.js';

/**
 * اعتبارسنجی‌های مشترک با Zod — هم در frontend و هم backend استفاده می‌شوند
 * (single source of truth برای شکل داده‌ها)
 */

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(EMAIL_REGEX, 'فرمت ایمیل معتبر نیست')
  .max(254, 'ایمیل بیش از حد طولانی است');

export const mobileSchema = z
  .string()
  .trim()
  .regex(IRAN_MOBILE_REGEX, 'شماره موبایل ایرانی معتبر نیست (مثال: 09123456789)');

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `رمز عبور باید حداقل ${PASSWORD_MIN_LENGTH} کاراکتر باشد`)
  .max(PASSWORD_MAX_LENGTH, `رمز عبور نمی‌تواند بیش از ${PASSWORD_MAX_LENGTH} کاراکتر باشد`)
  .regex(/[a-zA-Z]/, 'رمز باید شامل حرف باشد')
  .regex(/[0-9]/, 'رمز باید شامل عدد باشد');

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, 'نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد')
  .max(100, 'نام بیش از حد طولانی است');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().trim().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().trim().optional(),
});

/** DTO: ثبت‌نام کاربر تازه */
export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    mobile: mobileSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'تکرار رمز عبور مطابقت ندارد',
    path: ['confirmPassword'],
  });

/** DTO: ورود */
export const loginSchema = z.object({
  /** می‌تواند ایمیل یا موبایل باشد */
  identifier: z.string().trim().min(1, 'شناسه را وارد کنید'),
  password: z.string().min(1, 'رمز عبور را وارد کنید'),
});

/** DTO: refresh توکن */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'refresh token الزامی است'),
});

/** DTO: تغییر رمز */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'تکرار رمز جدید مطابقت ندارد',
    path: ['confirmNewPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;
