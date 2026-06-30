/**
 * خطای استاندارد برنامه که در کل monorepo استفاده می‌شود.
 * هم برای قابل فهم بودن کد، هم برای تولید پاسخ‌های API یکپارچه.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    options: {
      statusCode?: number;
      code?: string;
      isOperational?: boolean;
      details?: unknown;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? 'INTERNAL_ERROR';
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** کدهای خطای استاندارد */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

/** فکتوری‌های پرکاربرد خطا */
export const Errors = {
  badRequest: (message = 'درخواست نامعتبر است', details?: unknown) =>
    new AppError(message, { statusCode: 400, code: ERROR_CODES.BAD_REQUEST, details }),

  unauthorized: (message = 'احراز هویت لازم است') =>
    new AppError(message, { statusCode: 401, code: ERROR_CODES.UNAUTHORIZED }),

  forbidden: (message = 'دسترسی مجاز نیست') =>
    new AppError(message, { statusCode: 403, code: ERROR_CODES.FORBIDDEN }),

  notFound: (message = 'موردی یافت نشد') =>
    new AppError(message, { statusCode: 404, code: ERROR_CODES.NOT_FOUND }),

  conflict: (message = 'تضاد داده‌ای رخ داد') =>
    new AppError(message, { statusCode: 409, code: ERROR_CODES.CONFLICT }),

  rateLimited: (message = 'تعداد درخواست‌ها بیش از حد مجاز است') =>
    new AppError(message, { statusCode: 429, code: ERROR_CODES.RATE_LIMITED }),

  internal: (message = 'خطای داخلی سرور', cause?: unknown) =>
    new AppError(message, {
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_ERROR,
      isOperational: false,
      cause,
    }),
};
