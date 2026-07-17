import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

/**
 * Global Error Handler Middleware
 * Must be registered last in the middleware stack
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error('Error caught by global handler:', err);

  // AppError - Known application error
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    const issues = (err as any).issues || (err as any).errors || [];
    issues.forEach((error: any) => {
      const path = error.path ? error.path.join('.') : 'unknown';
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(error.message);
    });
    return sendError(res, 400, 'Validation Error', errors);
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, 409, `${field} already exists`);
  }

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const errors: Record<string, string[]> = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = [err.errors[key].message];
    });
    return sendError(res, 400, 'Validation Error', errors);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Default Server Error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error';

  sendError(res, statusCode, message);
};
