import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * wrapper برای async handler ها تا خطاها مستقیم به errorHandler برسند
 * و از try/catch تکراری جلوگیری شود.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
