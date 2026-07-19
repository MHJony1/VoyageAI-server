import { z } from 'zod';

/**
 * Admin Module - Validation Schemas
 */

const objectId = z.string().min(24, 'Invalid ID').max(24, 'Invalid ID');

export const idParamSchema = z.object({
  id: objectId,
});

/* ----------------------------- Destinations ----------------------------- */

export const adminListDestinationsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  published: z.enum(['true', 'false']).optional(),
  sort: z.enum(['rating', 'budget', 'newest']).optional(),
});

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

/* -------------------------------- Users --------------------------------- */

export const adminListUsersSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  blocked: z.enum(['true', 'false']).optional(),
});

export const changeRoleSchema = z.object({
  role: z.enum(['admin', 'user', 'moderator']),
});

export const blockUserSchema = z.object({
  blocked: z.boolean(),
});

/* -------------------------------- Trips --------------------------------- */

export const adminListTripsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

/* ------------------------------- Reviews -------------------------------- */

export const adminListReviewsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

/* ------------------------------ AI History ------------------------------ */

export const adminListAIHistorySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
  type: z.enum(['planner', 'recommendation', 'chat']).optional(),
});

export type AdminListDestinationsInput = z.infer<typeof adminListDestinationsSchema>;
export type AdminCreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type AdminUpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type AdminListUsersInput = z.infer<typeof adminListUsersSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type BlockUserInput = z.infer<typeof blockUserSchema>;
export type AdminListTripsInput = z.infer<typeof adminListTripsSchema>;
export type AdminListReviewsInput = z.infer<typeof adminListReviewsSchema>;
export type AdminListAIHistoryInput = z.infer<typeof adminListAIHistorySchema>;
