import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/AppError';

/**
 * Not Found Middleware - Must be registered before error handler
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'));
};
