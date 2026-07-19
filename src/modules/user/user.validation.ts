import { z } from 'zod';

/**
 * User Module - Validation Schemas
 */

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').optional(),
  photo: z.string().url('Invalid photo URL').optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
});

export const updateSettingsSchema = z
  .object({
    emailNotifications: z.boolean().optional(),
    aiNotifications: z.boolean().optional(),
    tripReminder: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    profileVisibility: z.enum(['public', 'private']).optional(),
    activityVisibility: z.enum(['public', 'private']).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
  })
  .passthrough();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
