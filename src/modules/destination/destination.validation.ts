import { z } from 'zod';

/**
 * Destination Module - Validation Schemas
 */

export const createDestinationSchema = z.object({
  title: z.string().min(2, 'Title required').max(100, 'Title too long'),
  country: z.string().min(2, 'Country required').max(100, 'Country too long'),
  category: z.string().min(2, 'Category required'),
  description: z.string().min(10, 'Description too short'),
  location: z.string().min(2, 'Location required'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  gallery: z.array(z.string().url()).optional(),
  rating: z.number().min(1).max(5),
  estimatedBudget: z.number().positive('Budget must be positive'),
  bestSeason: z.string().min(2, 'Season required'),
  featured: z.boolean().optional(),
});

export const listDestinationsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(12),
  search: z.string().optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['rating', 'budget']).optional(),
});

export const destinationIdSchema = z.object({
  id: z.string().min(24, 'Invalid destination ID'),
});

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type ListDestinationsInput = z.infer<typeof listDestinationsSchema>;
