import mongoose from 'mongoose';

export type { IBaseDocument, BaseDocument } from './plugins/base.schema.js';
export { baseSchemaFields, baseSchemaOptions, applySoftDelete } from './plugins/base.schema.js';
export * from './models/index.js';

export { mongoose };

export interface ConnectOptions {
  /** هنگام قطع، چند بار تلاش مجدد انجام شود */
  maxRetries?: number;
  /** فاصله‌ی بین تلاش‌ها (ms) */
  retryDelayMs?: number;
  /** لاگر اختیاری */
  logger?: { info: (msg: string, meta?: unknown) => void; error: (msg: string, meta?: unknown) => void };
}

/**
 * اتصال به MongoDB با retry.
 * به‌صورت safe-by-default: حداکثر تلاش و فاصله‌ی پیش‌فرض معقول.
 */
export async function connectDB(
  uri: string,
  opts: ConnectOptions = {},
): Promise<typeof mongoose> {
  const { maxRetries = 5, retryDelayMs = 2000, logger = console } = opts;
  let attempt = 0;

  // یک‌بار، در شروع: لاگ‌های اتصال
  mongoose.connection.on('connected', () => {
    logger.info('✅ اتصال به MongoDB برقرار شد');
  });
  mongoose.connection.on('disconnected', () => {
    logger.error('⚠️ اتصال به MongoDB قطع شد');
  });

  while (attempt < maxRetries) {
    attempt += 1;
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 50,
        minPoolSize: 5,
      });
      return conn;
    } catch (err) {
      logger.error(
        `❌ تلاش ${attempt}/${maxRetries} برای اتصال به MongoDB ناموفق بود`,
        err instanceof Error ? err.message : err,
      );
      if (attempt >= maxRetries) {
        throw new Error(
          `اتصال به MongoDB پس از ${maxRetries} تلاش ناموفق بود: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }
  // غیرقابل رسیدن از نظر type ها
  throw new Error('اتصال به MongoDB ناموفق بود');
}

/** قطع اتصال تمیز (برای تست‌ها و shutdown) */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
