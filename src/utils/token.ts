import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { UnauthorizedError } from '../errors/AppError';

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate JWT Token
 */
export const generateToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as any);
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string): ITokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as ITokenPayload;
    return decoded;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new UnauthorizedError('Authorization header missing');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid authorization header format');
  }

  return parts[1];
};
