import { connectDB, disconnectDB } from '@amozesh/database';
import { config } from './env.js';
import { logger } from './logger.js';

let connecting: Promise<unknown> | null = null;

/** انتخاب URI بر اساس محیط (تست از DB جداگانه استفاده می‌کند) */
function getUri(): string {
  if (config.isTest && config.env.MONGODB_TEST_URI) return config.env.MONGODB_TEST_URI;
  return config.env.MONGODB_URI;
}

/** اتصال به MongoDB — فقط یک‌بار همزمان اجرا می‌شود */
export async function initDatabase(): Promise<void> {
  if (connecting) await connecting;
  connecting = connectDB(getUri(), {
    maxRetries: 5,
    retryDelayMs: 2000,
    logger: {
      info: (msg, meta) => logger.info(meta ?? {}, msg),
      error: (msg, meta) => logger.error(meta ?? {}, msg),
    },
  });
  await connecting;
  connecting = null;
}

/** قطع اتصال تمیز */
export async function closeDatabase(): Promise<void> {
  await disconnectDB();
}
