import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createSessionSchema, updateSessionSchema } from '@amozesh/shared';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} from './session.controller.js';

const router = Router();

router.get('/', authenticate(), getSessions);
router.get('/:id', authenticate(), getSessionById);
router.post('/', authenticate(), staffOnly(), validate(createSessionSchema), createSession);
router.put('/:id', authenticate(), staffOnly(), validate(updateSessionSchema), updateSession);
router.delete('/:id', authenticate(), staffOnly(), deleteSession);

export default router;
