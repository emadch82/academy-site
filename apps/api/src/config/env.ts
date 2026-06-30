import dotenv from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

/**
 * اسکیمای متغیرهای محیطی بک‌اند.
 * هر متغیر مورد نیاز در اینجا تعریف و اعتبارسنجی می‌شود تا در زمان بوت
 * خطای نامشخص به‌جای رفتار نادرست در runtime رخ دهد (fail fast).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8000),
  APP_NAME: z.string().default('amozesh'),
  APP_URL: z.string().url().default('http://localhost:8080'),
  CLIENT_URL: z.string().url().default('http://localhost:8080'),

  // دیتابیس
  MONGODB_URI: z.string().min(1, 'MONGODB_URI الزامی است'),
  MONGODB_TEST_URI: z.string().optional(),

  // JWT / امنیت
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET باید حداقل ۳۲ کاراکتر باشد'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET باید حداقل ۳۲ کاراکتر باشد'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET باید حداقل ۳۲ کاراکتر باشد'),
  COOKIE_DOMAIN: z.string().default('localhost'),

  // Rate limit
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),

  // Socket.IO
  SOCKET_IO_CORS_ORIGIN: z.string().default('http://localhost:8080'),

  // لاگ
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('debug'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ متغیرهای محیطی نامعتبر هستند:\n', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export type Env = typeof env;

export const config = {
  env,
  isDev: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  isProd: env.NODE_ENV === 'production',
} as const;

export default config;
