import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from '@amozesh/shared';
import { authRateLimit } from '../../middleware/security.js';
import { login, logout, refresh, register } from './auth.controller.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: احراز هویت کاربران
 */
router.post('/register', authRateLimit, validate(registerSchema), register);
router.post('/login', authRateLimit, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', logout);

export default router;
