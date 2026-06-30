import express, { type Application } from 'express';
import { API_PREFIX } from '@amozesh/shared';
import {
  attachResponseHelpers,
  errorHandler,
  notFoundHandler,
} from './middleware/error.js';
import {
  compressionMiddleware,
  cookieMiddleware,
  corsMiddleware,
  globalRateLimit,
  helmetMiddleware,
  httpLogger,
  sanitizeMiddleware,
} from './middleware/security.js';
import { logger } from './config/logger.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import branchRoutes from './modules/branches/branch.routes.js';
import classroomRoutes from './modules/classrooms/classroom.routes.js';
import courseRoutes from './modules/courses/course.routes.js';
import enrollmentRoutes from './modules/enrollments/enrollment.routes.js';
import sessionRoutes from './modules/sessions/session.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import examRoutes from './modules/exams/exam.routes.js';
import assignmentRoutes from './modules/assignments/assignment.routes.js';
import certificateRoutes from './modules/certificates/certificate.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import crmRoutes from './modules/crm/crm.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import cmsRoutes from './modules/cms/cms.routes.js';
import reportRoutes from './modules/reports/report.routes.js';
import { healthRoutes } from './config/health.js';
import { swaggerDocs } from './config/swagger.js';

/** ساخت و پیکربندی اپلیکیشن Express */
export function createApp(): Application {
  const app = express();

  // ── proxy trust (پشت Nginx در prod) ────────────────────────────────────
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // ── middleware پایه ─────────────────────────────────────────────────────
  app.use(httpLogger);
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieMiddleware);
  app.use(sanitizeMiddleware);
  app.use(globalRateLimit);

  // متدهای کمکی res.ok / res.created
  app.use(attachResponseHelpers);

  // ── مسیرهای عمومی ───────────────────────────────────────────────────────
  app.use('/health', healthRoutes);
  app.use('/api-docs', swaggerDocs);
  app.get('/', (_req, res) => {
    res.ok({ name: 'amozesh API', version: '0.1.0' }, 'به API آموزشگاه خوش آمدید');
  });

  // ── مسیرهای نسخه‌ی ۱ ────────────────────────────────────────────────────
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/branches`, branchRoutes);
  app.use(`${API_PREFIX}/classrooms`, classroomRoutes);
  app.use(`${API_PREFIX}/courses`, courseRoutes);
  app.use(`${API_PREFIX}/enrollments`, enrollmentRoutes);
  app.use(`${API_PREFIX}/sessions`, sessionRoutes);
  app.use(`${API_PREFIX}/attendance`, attendanceRoutes);
  app.use(`${API_PREFIX}/exams`, examRoutes);
  app.use(`${API_PREFIX}/assignments`, assignmentRoutes);
  app.use(`${API_PREFIX}/certificates`, certificateRoutes);
  app.use(`${API_PREFIX}/payments`, paymentRoutes);
  app.use(`${API_PREFIX}/crm`, crmRoutes);
  app.use(`${API_PREFIX}/notifications`, notificationRoutes);
  app.use(`${API_PREFIX}/cms`, cmsRoutes);
  app.use(`${API_PREFIX}/reports`, reportRoutes);

  // ── مدیریت خطا ──────────────────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  logger.info('✅ اپلیکیشن Express پیکربندی شد');
  return app;
}
