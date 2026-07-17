import { Conversation } from '../../models/conversation.model';
import { AIHistory } from '../../models/aiHistory.model';
import { NotFoundError } from '../../errors/AppError';
import type { IMessage } from './conversation.interface';

/**
 * Conversation Service
 * Handles chat and conversation management
 */

const MAX_CONTEXT_MESSAGES = 10;

export const conversationService = {
  /**
   * Get or create conversation
   */
  getOrCreateConversation: async (userId: string, conversationId?: string) => {
    if (conversationId) {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        throw new NotFoundError('Conversation not found');
      }

      return conversation;
    }

    // Create new conversation
    const conversation = await Conversation.create({
      userId,
      messages: [],
    });

    return conversation;
  },

  /**
   * Save message to conversation
   */
  saveMessage: async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: { role, content },
        },
      },
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    return conversation;
  },

  /**
   * Get conversation context (last N messages)
   */
  getConversationContext: (messages: IMessage[]): string => {
    const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

    return contextMessages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  },

  /**
   * Save to AI History
   */
  saveToHistory: async (
    userId: string,
    userMessage: string,
    aiResponse: string,
  ) => {
    await AIHistory.create({
      userId,
      type: 'chat',
      prompt: userMessage.substring(0, 500),
      response: aiResponse.substring(0, 1000),
    });
  },

  /**
   * Get all conversations for user
   */
  getUserConversations: async (userId: string) => {
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    return conversations;
  },

  /**
   * Delete conversation
   */
  deleteConversation: async (userId: string, conversationId: string) => {
    const result = await Conversation.deleteOne({
      _id: conversationId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundError('Conversation not found');
    }
  },

  /**
   * Clear all conversations for user
   */
  clearAllConversations: async (userId: string) => {
    await Conversation.deleteMany({ userId });
  },
};
