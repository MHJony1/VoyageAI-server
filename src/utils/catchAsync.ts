import { Request, Response, NextFunction } from 'express';

/**
 * Async handler wrapper - Catches async errors and passes to global error handler
 * Usage: catchAsync(async (req, res, next) => { ... })
 */
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
