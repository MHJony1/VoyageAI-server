import { z } from 'zod';

/**
 * AI Module - Validation Schemas
 */

export const tripPlanSchema = z.object({
  destination: z.string().min(2, 'Destination required'),
  budget: z.number().positive('Budget must be positive'),
  days: z.number().min(1).max(30),
  travelStyle: z.string().min(2, 'Travel style required'),
  interests: z.array(z.string()).min(1, 'At least one interest required'),
});

export const recommendationSchema = z.object({
  budget: z.number().positive('Budget must be positive'),
  season: z.string().min(2, 'Season required'),
  groupType: z.string().min(2, 'Group type required'),
  interests: z.array(z.string()).min(1, 'At least one interest required'),
});

export const chatSchema = z.object({
  message: z.string().min(1, 'Message required').max(1000),
  conversationId: z.string().optional(),
});

export type TripPlanInput = z.infer<typeof tripPlanSchema>;
export type RecommendationInput = z.infer<typeof recommendationSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
