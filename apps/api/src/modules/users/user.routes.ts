import { Router } from 'express';
import { changePasswordSchema } from '@amozesh/shared';
import { authenticate, adminOnly } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import {
  setUserActiveSchema,
  updateUserRoleSchema,
  updateUserSchema,
  listUsersQuerySchema,
} from './user.validators.js';
import {
  adminDelete,
  adminUpdate,
  adminUpdateRole,
  adminUpdateStatus,
  changeMyPassword,
  getById,
  list,
  me,
  updateMe,
} from './user.controller.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: مدیریت کاربران
 */

// ── مسیرهای کاربر احراز هویت‌شده ───────────────────────────────────────────
router.get('/me', authenticate(), me);
router.patch('/me', authenticate(), validate(updateUserSchema), updateMe);
router.patch(
  '/me/password',
  authenticate(),
  validate(changePasswordSchema),
  changeMyPassword,
);

// ── مسیرهای ادمین ──────────────────────────────────────────────────────────
router.get('/', authenticate(), adminOnly(), validateQuery(listUsersQuerySchema), list);
router.get('/:id', authenticate(), adminOnly(), getById);
router.patch('/:id', authenticate(), adminOnly(), validate(updateUserSchema), adminUpdate);
router.patch(
  '/:id/role',
  authenticate(),
  adminOnly(),
  validate(updateUserRoleSchema),
  adminUpdateRole,
);
router.patch(
  '/:id/status',
  authenticate(),
  adminOnly(),
  validate(setUserActiveSchema),
  adminUpdateStatus,
);
router.delete('/:id', authenticate(), adminOnly(), adminDelete);

export default router;
