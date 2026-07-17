import { z } from 'zod';

/**
 * Review Module - Validation Schemas
 */

export const createReviewSchema = z.object({
  destinationId: z.string().min(24, 'Invalid destination ID'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(5).max(500).optional(),
});

export const reviewIdSchema = z.object({
  id: z.string().min(24, 'Invalid review ID'),
});

export const destinationIdSchema = z.object({
  destinationId: z.string().min(24, 'Invalid destination ID'),
});

export const reviewsListSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(12),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
