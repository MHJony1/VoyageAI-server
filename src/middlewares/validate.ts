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
        const validated = options.query.parse(req.query);
        req.query = validated as any;
      }

      if (options.params) {
        const validated = options.params.parse(req.params);
        req.params = validated as any;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
