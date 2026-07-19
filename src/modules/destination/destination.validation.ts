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
  gallery: z.array(z.string().url('Invalid gallery image URL')).optional(),
  rating: z.number().min(1).max(5),
  estimatedBudget: z.number().positive('Budget must be positive'),
  bestSeason: z.string().min(2, 'Season required'),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  duration: z.string().optional(),
  bestTimeDescription: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  travelTips: z.array(z.string()).optional(),
  weather: z.string().optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  mapUrl: z.string().url('Invalid map URL').optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

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
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type ListDestinationsInput = z.infer<typeof listDestinationsSchema>;
