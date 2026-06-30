import type { NextFunction, Request, Response } from 'express';
import { changePasswordSchema, UserRole } from '@amozesh/shared';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
  changePassword,
  deleteUser,
  getMe,
  getUserById,
  listUsers,
  setUserActive,
  updateUser,
  updateUserRole,
} from './user.service.js';

/** GET /users — لیست کاربران (ادمین/کارمند) */
export const list = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await listUsers(
    {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string | undefined,
      sort: req.query.sort as string | undefined,
      order: req.query.order as 'asc' | 'desc' | undefined,
    },
    {
      role: req.query.role as string | undefined,
      isActive:
        req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    },
  );
  res.okPaginated(result, 'لیست کاربران');
});

/** GET /users/:id */
export const getById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const user = await getUserById(req.params.id);
  res.ok(user, 'اطلاعات کاربر');
});

/** GET /users/me */
export const me = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  if (!req.user) throw new Error('req.user مقداردهی نشده است');
  const user = await getMe(req.user.id);
  res.ok(user, 'پروفایل شما');
});

/** PATCH /users/me */
export const updateMe = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  if (!req.user) throw new Error('req.user مقداردهی نشده است');
  const user = await updateUser(req.user.id, req.body);
  res.ok(user, 'پروفایل به‌روزرسانی شد');
});

/** PATCH /users/me/password */
export const changeMyPassword = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) throw new Error('req.user مقداردهی نشده است');
    const input = changePasswordSchema.parse(req.body);
    await changePassword(req.user.id, input.currentPassword, input.newPassword);
    res.ok({}, 'رمز عبور تغییر کرد');
  },
);

/** PATCH /users/:id (ادمین) */
export const adminUpdate = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const user = await updateUser(req.params.id, req.body);
  res.ok(user, 'کاربر به‌روزرسانی شد');
});

/** PATCH /users/:id/role (ادمین) */
export const adminUpdateRole = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await updateUserRole(req.params.id, req.body.role as UserRole);
    res.ok(user, 'نقش کاربر به‌روزرسانی شد');
  },
);

/** PATCH /users/:id/status (ادمین) */
export const adminUpdateStatus = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await setUserActive(req.params.id, req.body.isActive);
    res.ok(user, 'وضعیت کاربر تغییر کرد');
  },
);

/** DELETE /users/:id (ادمین) — حذف نرم */
export const adminDelete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  await deleteUser(req.params.id);
  res.noContent();
});
