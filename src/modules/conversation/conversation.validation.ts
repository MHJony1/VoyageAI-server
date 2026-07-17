import { z } from 'zod';

/**
 * Conversation Module - Validation Schemas
 */

export const chatSchema = z.object({
  message: z.string().min(1, 'Message required').max(2000, 'Message too long'),
  conversationId: z.string().optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;
