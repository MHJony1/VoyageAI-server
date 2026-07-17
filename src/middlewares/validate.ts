import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Validation Middleware using Zod
 * Usage: validate({ body: userSchema })
 */
export const validate =
  (options: ValidateOptions) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (options.body) {
        const validated = options.body.parse(req.body);
        req.body = validated;
      }

      if (options.query) {
        options.query.parse(req.query);
        // Validation passed but don't modify read-only req.query
      }

      if (options.params) {
        options.params.parse(req.params);
        // Validation passed but don't modify read-only req.params
      }

      next();
    } catch (error) {
      next(error);
    }
  };
