import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { connectDB, disconnectDB, UserModel } from '@amozesh/database';

beforeAll(async () => {
  // اتصال به دیتابیس تست
  await connectDB(process.env.MONGODB_TEST_URI!, { maxRetries: 3, retryDelayMs: 2000 });
  // پاک‌سازی مجموعه‌ها قبل از تست
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await disconnectDB();
});

function getServer() {
  return createApp();
}

describe('Health Check', () => {
  it('باید /health وضعیت ok برگرداند', async () => {
    const res = await request(getServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database.connected).toBe(true);
  });

  it('باید / پاسخ خوش‌آمدگویی بدهد', async () => {
    const res = await request(getServer()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Auth — ثبت‌نام و ورود', () => {
  const testUser = {
    fullName: 'کاربر تست',
    email: `test-${Date.now()}@example.com`,
    mobile: '09123456789',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
  };

  it('باید ثبت‌نام موفق باشد', async () => {
    const res = await request(getServer())
      .post('/api/v1/auth/register')
      .send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.role).toBe('student');
    // کوکی access token باید تنظیم شده باشد
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('باید ورود موفق باشد', async () => {
    const res = await request(getServer())
      .post('/api/v1/auth/login')
      .send({ identifier: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('باید با رمز اشتباه خطای 401 بدهد', async () => {
    const res = await request(getServer())
      .post('/api/v1/auth/login')
      .send({ identifier: testUser.email, password: 'WrongPass999' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('باید ثبت‌نام تکراری خطای 409 بدهد', async () => {
    const res = await request(getServer())
      .post('/api/v1/auth/register')
      .send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
