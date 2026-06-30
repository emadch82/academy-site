import type { NextFunction, Request, Response } from 'express';
import {
  AppError,
  ERROR_CODES,
  Errors,
  type ApiResponse,
  type PaginatedResult,
} from '@amozesh/shared';
import { config } from '../config/env.js';

/** دسترسی آسان به res.ok / res.created */
export function attachResponseHelpers(_req: Request, res: Response, next: NextFunction): void {
  res.ok = function <T>(data: T, message = 'عملیات با موفقیت انجام شد'): Response {
    const body: ApiResponse<T> = { success: true, message, data };
    return this.status(200).json(body);
  };

  res.okPaginated = function <T>(
    result: PaginatedResult<T>,
    message = 'عملیات با موفقیت انجام شد',
  ): Response {
    const body: ApiResponse<T[]> = { success: true, message, data: result.items, meta: result.meta };
    return this.status(200).json(body);
  };

  res.created = function <T>(data: T, message = 'با موفقیت ایجاد شد'): Response {
    const body: ApiResponse<T> = { success: true, message, data };
    return this.status(201).json(body);
  };

  res.noContent = function (): Response {
    return this.status(204).send();
  };

  next();
}

/** خطای ۴۰۴ برای مسیرهای پیدا‌نشده */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(Errors.notFound(`مسیر پیدا نشد: ${req.method} ${req.originalUrl}`));
}

/**
 * Middleware خطای متمرکز — همه‌ی خطاها از اینجا عبور می‌کنند.
 * هر خطایی که AppError نباشد به‌عنوان خطای داخلی (۵۰۰) در نظر گرفته می‌شود.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const error = normalizeError(err);

  const logPayload = {
    statusCode: error.statusCode,
    code: error.code,
    path: req.originalUrl,
    method: req.method,
  };

  if (error.statusCode >= 500) {
    req.log?.error(logPayload, 'خطای داخلی سرور');
  } else if (error.statusCode >= 400) {
    req.log?.warn(logPayload, error.message);
  }

  const showDetails = config.isDev || error.isOperational;

  const body: ApiResponse = {
    success: false,
    message: showDetails ? error.message : 'خطای داخلی سرور',
    errorCode: error.code,
    ...(showDetails && error.details ? { data: error.details } : {}),
  };

  res.status(error.statusCode).json(body);
}

function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof Error && err.name === 'ZodError') {
    return new AppError('داده‌ی ورودی نامعتبر است', {
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: (err as any).errors,
      cause: err,
    });
  }

  if (isMongooseError(err)) {
    return mapMongooseError(err);
  }

  if (err instanceof Error) {
    return Errors.internal(err.message, err);
  }

  return Errors.internal('خطای ناشناخته رخ داد', String(err));
}

function isMongooseError(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.name === 'MongoServerError')
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMongooseError(err: any): AppError {
  if (err.name === 'ValidationError') {
    return new AppError('داده‌ی ورودی نامعتبر است', {
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      details: err.errors,
      cause: err,
    });
  }
  if (err.name === 'CastError') {
    return new AppError('شناسه یا مقدار نامعتبر است', {
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      cause: err,
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'فیلد';
    return new AppError(`مقدار برای «${field}» تکراری است`, {
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      details: err.keyValue,
      cause: err,
    });
  }
  return Errors.internal(err.message, err);
}
