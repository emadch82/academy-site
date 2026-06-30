import { Router } from 'express';
import { authenticate, adminOnly, staffOnly } from '../../middleware/auth.js';
import {
  getCertificates,
  getCertificateById,
  verifyCertificate,
  issueCertificate,
} from './certificate.controller.js';

const router = Router();

router.get('/', authenticate(), staffOnly(), getCertificates);
router.get('/verify/:serialNumber', verifyCertificate);
router.get('/:id', authenticate(), getCertificateById);
router.post('/issue', authenticate(), adminOnly(), issueCertificate);

export default router;
