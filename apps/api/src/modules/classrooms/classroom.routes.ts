import { Router } from 'express';
import { authenticate, adminOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createClassroomSchema, updateClassroomSchema } from '@amozesh/shared';
import {
  getClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from './classroom.controller.js';

const router = Router();

router.get('/', authenticate(), getClassrooms);
router.get('/:id', authenticate(), getClassroomById);
router.post('/', authenticate(), adminOnly(), validate(createClassroomSchema), createClassroom);
router.put('/:id', authenticate(), adminOnly(), validate(updateClassroomSchema), updateClassroom);
router.delete('/:id', authenticate(), adminOnly(), deleteClassroom);

export default router;
