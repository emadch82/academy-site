import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createEnrollmentSchema } from '@amozesh/shared';
import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  cancelEnrollment,
} from './enrollment.controller.js';

const router = Router();

router.get('/', authenticate(), staffOnly(), getEnrollments);
router.get('/:id', authenticate(), getEnrollmentById);
router.post('/', authenticate(), staffOnly(), validate(createEnrollmentSchema), createEnrollment);
router.patch('/:id/cancel', authenticate(), staffOnly(), cancelEnrollment);

export default router;
