import { Router } from 'express';
import { authenticate, staffOnly, adminOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createCourseSchema, updateCourseSchema } from '@amozesh/shared';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
} from './course.controller.js';

const router = Router();

router.get('/', authenticate({ optional: true }), getCourses);
router.get('/:id', authenticate({ optional: true }), getCourseById);
router.get('/:id/stats', authenticate(), staffOnly(), getCourseStats);
router.post('/', authenticate(), adminOnly(), validate(createCourseSchema), createCourse);
router.put('/:id', authenticate(), adminOnly(), validate(updateCourseSchema), updateCourse);
router.delete('/:id', authenticate(), adminOnly(), deleteCourse);

export default router;
