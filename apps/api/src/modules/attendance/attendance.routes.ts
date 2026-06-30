import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { markAttendanceSchema } from '@amozesh/shared';
import {
  getAttendance,
  markAttendance,
  getAttendanceReport,
} from './attendance.controller.js';

const router = Router();

router.get('/', authenticate(), staffOnly(), getAttendance);
router.get('/report', authenticate(), staffOnly(), getAttendanceReport);
router.post('/', authenticate(), staffOnly(), validate(markAttendanceSchema), markAttendance);

export default router;
