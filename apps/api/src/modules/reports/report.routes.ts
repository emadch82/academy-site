import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { getDashboardStats, getTeacherStats, getStudentStats } from './report.controller.js';

const router = Router();

router.get('/dashboard', authenticate(), staffOnly(), getDashboardStats);
router.get('/teacher/:id', authenticate(), getTeacherStats);
router.get('/student/:id', authenticate(), getStudentStats);

export default router;
