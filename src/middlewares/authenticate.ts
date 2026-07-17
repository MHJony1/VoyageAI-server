import { Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/token';
import { ForbiddenError } from '../errors/AppError';
import type { IAuthRequest } from '../interfaces/IRequest';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: IAuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      name: '', // Name not in token
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization Middleware
 * Checks if user has required role
 */
export const authorize =
  (...allowedRoles: string[]) =>
  (req: IAuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
