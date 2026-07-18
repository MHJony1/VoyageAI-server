import { z } from 'zod';

/**
 * User Module - Validation Schemas
 */

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').optional(),
  photo: z.string().url('Invalid photo URL').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
