import { z } from 'zod';

/**
 * Trip Module - Validation Schemas
 */

export const createTripSchema = z.object({
  destinationId: z.string().min(24, 'Invalid destination ID'),
  destination: z.string().min(2),
  days: z.number().min(1).max(30),
  budget: z.number().positive(),
  travelStyle: z.string().min(2),
  interests: z.array(z.string()).optional(),
  itinerary: z.string().min(10),
  estimatedCost: z.number().positive(),
  status: z.string().default('saved'),
});

export const updateTripSchema = z.object({
  days: z.number().min(1).max(30).optional(),
  budget: z.number().positive().optional(),
  travelStyle: z.string().min(2).optional(),
  interests: z.array(z.string()).optional(),
  itinerary: z.string().min(10).optional(),
  estimatedCost: z.number().positive().optional(),
  status: z.string().optional(),
});

export const tripIdSchema = z.object({
  id: z.string().min(24, 'Invalid trip ID'),
});

export const myTripsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(12),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
