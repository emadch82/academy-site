import type { RequestHandler, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { config } from '../config/env.js';
import { logger } from '../config/logger.js';

/** هدرهای امنیتی */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}) as RequestHandler;

/** CORS */
export const corsMiddleware = cors({
  origin(origin, cb) {
    const allowed = config.env.CLIENT_URL.split(',').map((s) => s.trim());
    if (!origin || allowed.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`Origin ${origin} توسط CORS مجاز نیست`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id'],
  exposedHeaders: ['Set-Cookie'],
}) as RequestHandler;

/** فشرده‌سازی */
export const compressionMiddleware = compression() as RequestHandler;

/** پارس کوکی */
export const cookieMiddleware = cookieParser(config.env.COOKIE_SECRET) as RequestHandler;

/** NoSQL injection guard */
export const sanitizeMiddleware = mongoSanitize({ replaceWith: '_' }) as RequestHandler;

/** لاگ درخواست‌ها */
export const httpLogger = (pinoHttp as any)({
  logger,
  customLogLevel(_req: Request, res: Response, err: Error | null) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(req: Request, res: Response) {
    return `${req.method} ${req.url} → ${res.statusCode}`;
  },
  customErrorMessage(req: Request, _res: Response, err: Error) {
    return `${req.method} ${req.url} → ${err.message}`;
  },
  serializers: {
    req(req: Record<string, unknown>) {
      req.body = undefined;
      return req;
    },
  },
}) as RequestHandler;

/** محدودکننده‌ی کلی */
export const globalRateLimit = rateLimit({
  windowMs: config.env.RATE_LIMIT_WINDOW_MS,
  max: config.env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'تعداد درخواست‌ها بیش از حد مجاز است' },
});

/** محدودکننده‌ی احراز هویت */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'تعداد تلاش‌ها بیش از حد مجاز است' },
});
