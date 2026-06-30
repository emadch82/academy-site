import http from 'node:http';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { initDatabase, closeDatabase } from './config/database.js';

async function bootstrap(): Promise<void> {
  try {
    logger.info('🚀 راه‌اندازی سرور...');

    // ۱) اتصال به دیتابیس (اختیاری — سرور بدون دیتابیس هم بالا می‌آید)
    try {
      await initDatabase();
    } catch {
      logger.warn('⚠️ اتصال به دیتابیس ناموفق بود — سرور بدون دیتابیس ادامه می‌دهد');
    }

    // ۲) ساخت اپلیکیشن
    const app = createApp();
    const server = http.createServer(app);

    // ۳) شروع سرور
    server.listen(config.env.PORT, () => {
      logger.info(`✅ سرور روی پورت ${config.env.PORT} در حال اجراست`);
      logger.info(`📚 مستندات: http://localhost:${config.env.PORT}/api-docs`);
      logger.info(`❤️  سلامت: http://localhost:${config.env.PORT}/health`);
    });

    // ۴) مدیریت خاموشی تمیز
    const shutdown = async (signal: string) => {
      logger.info(`📶 سیگنال ${signal} دریافت شد — در حال خاموشی...`);
      server.close(async () => {
        await closeDatabase();
        logger.info('✅ خاموشی کامل انجام شد');
        process.exit(0);
      });
      // اگر بعد از ۱۰ ثانیه بسته نشد، اجباراً خارج شو
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));

    // ۵) مدیریت خطاهای کشنده
    process.on('unhandledRejection', (reason) => {
      logger.error({ reason }, 'unhandledRejection');
    });
    process.on('uncaughtException', (err) => {
      logger.error({ err }, 'uncaughtException');
      process.exit(1);
    });
  } catch (err) {
    logger.error({ err }, '❌ راه‌اندازی سرور ناموفق بود');
    process.exit(1);
  }
}

void bootstrap();
