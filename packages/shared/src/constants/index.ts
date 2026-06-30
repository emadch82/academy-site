/** نام پکیج برای استفاده در لاگ‌ها */
export const APP_NAME = 'amozesh';

/** پیشوند توکن Bearer */
export const BEARER_PREFIX = 'Bearer ';

/** نام کوکی‌ها */
export const COOKIES = {
  ACCESS_TOKEN: 'amz_access',
  REFRESH_TOKEN: 'amz_refresh',
  DEVICE_ID: 'amz_device',
} as const;

/** هدر سفارشی برای شناسه‌ی دستگاه */
export const HEADER_DEVICE_ID = 'x-device-id';

/** مسیرهای API */
export const API_PREFIX = '/api/v1';

/** الگوی ایمیل معتبر */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** الگوی موبایل ایرانی (با یا بدون ۹۸+) */
export const IRAN_MOBILE_REGEX = /^(\+98|0)?9\d{9}$/;

/** حداقل و حداکثر رمز عبور */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** واحدهای پولی */
export const CURRENCY_IRR = 'IRR';

/** حد مجاز صفحه‌بندی */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
