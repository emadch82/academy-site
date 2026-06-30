import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createExamSchema, createQuestionSchema } from '@amozesh/shared';
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getQuestions,
  createQuestion,
  submitExam,
  getExamResults,
} from './exam.controller.js';

const router = Router();

router.get('/', authenticate(), getExams);
router.get('/:id', authenticate(), getExamById);
router.post('/', authenticate(), staffOnly(), validate(createExamSchema), createExam);
router.put('/:id', authenticate(), staffOnly(), updateExam);
router.delete('/:id', authenticate(), staffOnly(), deleteExam);

router.get('/:id/questions', authenticate(), getQuestions);
router.post('/:id/questions', authenticate(), staffOnly(), validate(createQuestionSchema), createQuestion);

router.post('/:id/submit', authenticate(), submitExam);
router.get('/:id/results', authenticate(), staffOnly(), getExamResults);

export default router;
