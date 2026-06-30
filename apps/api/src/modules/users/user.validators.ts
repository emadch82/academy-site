import { z } from 'zod';
import { paginationQuerySchema, fullNameSchema } from '@amozesh/shared';

/** لیست کاربران */
export const listUsersQuerySchema = paginationQuerySchema.extend({
  role: z.enum(['admin', 'staff', 'teacher', 'student']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

/** به‌روزرسانی کاربر */
export const updateUserSchema = z.object({
  fullName: fullNameSchema.optional(),
  avatarUrl: z.string().url().optional(),
});

/** تغییر نقش */
export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'staff', 'teacher', 'student']),
});

/** تغییر وضعیت فعال */
export const setUserActiveSchema = z.object({
  isActive: z.boolean(),
});

export type ListUsersQueryInput = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserInputBody = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SetUserActiveInput = z.infer<typeof setUserActiveSchema>;
