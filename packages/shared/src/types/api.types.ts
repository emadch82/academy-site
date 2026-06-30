import type { UserRole } from '../enums/index.js';

/** کاربر احراز هویت‌شده‌ی درخواست */
export interface AuthUser {
  id: string;
  email: string;
  mobile: string;
  role: UserRole;
  isActive: boolean;
  /** نمایش در UI بدون وابستگی به کلاس Model */
  fullName: string;
  avatarUrl?: string;
}

/** Payload داخل JWT Access Token */
export interface JwtAccessPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
  /** امضای دستگاه برای device management */
  deviceId?: string;
  /** نشانه‌ی زمان صدور (iat/exp توسط jsonwebtoken اضافه می‌شود) */
}

/** Payload داخل JWT Refresh Token */
export interface JwtRefreshPayload {
  sub: string;
  /** شناسه‌ی یکتا برای rotation و revoke */
  tokenId: string;
  deviceId?: string;
}

/** خروجی استاندارد API — همیشه این شکل */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  /** کد خطای داخلی (در صورت عدم موفقیت) */
  errorCode?: string;
  /** متادیتای صفحه‌بندی (در صورت لیست) */
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/** پارامتر query استاندارد برای لیست‌ها */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
