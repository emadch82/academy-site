import { Router } from 'express';
import { authenticate, adminOnly, staffOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createInvoiceSchema, initiatePaymentSchema } from '@amozesh/shared';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  initiatePayment,
  verifyPayment,
  getTransactions,
  getFinancialReport,
} from './payment.controller.js';

const router = Router();

router.get('/invoices', authenticate(), staffOnly(), getInvoices);
router.get('/invoices/:id', authenticate(), getInvoiceById);
router.post('/invoices', authenticate(), staffOnly(), validate(createInvoiceSchema), createInvoice);

router.post('/pay', authenticate(), validate(initiatePaymentSchema), initiatePayment);
router.get('/verify/:trackingCode', authenticate(), verifyPayment);

router.get('/transactions', authenticate(), staffOnly(), getTransactions);
router.get('/report', authenticate(), adminOnly(), getFinancialReport);

export default router;
