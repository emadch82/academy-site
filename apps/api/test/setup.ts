/**
 * Setup اولیه تست‌ها — بارگذاری env.dev قبل از اجرای تست
 */
import dotenv from 'dotenv';
import { resolve } from 'node:path';
dotenv.config({ path: resolve(__dirname, '../.env') });
