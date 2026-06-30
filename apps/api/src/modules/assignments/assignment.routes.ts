import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createAssignmentSchema } from '@amozesh/shared';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
} from './assignment.controller.js';

const router = Router();

router.get('/', authenticate(), getAssignments);
router.get('/:id', authenticate(), getAssignmentById);
router.post('/', authenticate(), staffOnly(), validate(createAssignmentSchema), createAssignment);
router.put('/:id', authenticate(), staffOnly(), updateAssignment);
router.delete('/:id', authenticate(), staffOnly(), deleteAssignment);

router.post('/:id/submit', authenticate(), submitAssignment);
router.patch('/:submissionId/grade', authenticate(), staffOnly(), gradeSubmission);

export default router;
