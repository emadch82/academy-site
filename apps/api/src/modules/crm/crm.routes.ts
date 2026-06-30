import { Router } from 'express';
import { authenticate, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createLeadSchema, updateLeadSchema } from '@amozesh/shared';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  convertLead,
  getContacts,
  createContact,
  getFollowUps,
  createFollowUp,
  completeFollowUp,
} from './crm.controller.js';

const router = Router();

router.get('/leads', authenticate(), staffOnly(), getLeads);
router.get('/leads/:id', authenticate(), staffOnly(), getLeadById);
router.post('/leads', authenticate(), staffOnly(), validate(createLeadSchema), createLead);
router.put('/leads/:id', authenticate(), staffOnly(), validate(updateLeadSchema), updateLead);
router.patch('/leads/:id/convert', authenticate(), staffOnly(), convertLead);

router.get('/contacts', authenticate(), staffOnly(), getContacts);
router.post('/contacts', authenticate(), staffOnly(), createContact);

router.get('/follow-ups', authenticate(), staffOnly(), getFollowUps);
router.post('/follow-ups', authenticate(), staffOnly(), createFollowUp);
router.patch('/follow-ups/:id/complete', authenticate(), staffOnly(), completeFollowUp);

export default router;
