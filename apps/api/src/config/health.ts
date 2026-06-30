import { Router } from 'express';
import mongoose from 'mongoose';
import { config } from '../config/env.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: بررسی وضعیت سلامت سرویس
 *     responses:
 *       200:
 *         description: سرویس سالم است
 */
router.get('/', (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbConnected = mongoState === 1;
  const status = dbConnected ? 'ok' : 'degraded';
  const httpStatus = dbConnected ? 200 : 503;

  res.status(httpStatus).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    environment: config.env.NODE_ENV,
    database: {
      connected: dbConnected,
      state: mongoState,
    },
  });
});

export const healthRoutes = router;
