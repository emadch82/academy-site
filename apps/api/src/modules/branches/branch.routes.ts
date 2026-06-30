import { Router } from 'express';
import { authenticate, adminOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createBranchSchema, updateBranchSchema } from '@amozesh/shared';
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from './branch.controller.js';

const router = Router();

router.get('/', authenticate(), getBranches);
router.get('/:id', authenticate(), getBranchById);
router.post('/', authenticate(), adminOnly(), validate(createBranchSchema), createBranch);
router.put('/:id', authenticate(), adminOnly(), validate(updateBranchSchema), updateBranch);
router.delete('/:id', authenticate(), adminOnly(), deleteBranch);

export default router;
