import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { conversationService } from './conversation.service';
import { aiService } from '../ai/ai.service';
import { aiHistoryService } from '../ai/ai-history.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

/**
 * Conversation Controller
 * Handles conversation and chat endpoints
 */

export const conversationController = {
  /**
   * Chat with AI (protected)
   */
  chat: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { message, conversationId } = req.body;

    // Get or create conversation
    const conversation = await conversationService.getOrCreateConversation(userId, conversationId);

    // Save user message
    const updatedConversation = await conversationService.saveMessage(
      conversation._id.toString(),
      'user',
      message,
    );

    // Get conversation context
    const context = conversationService.getConversationContext(updatedConversation.messages);

    // Call AI with context
    const aiResponse = await aiService.chat({
      message,
      context,
      conversationId: conversation._id.toString(),
    });

    // Save AI response
    const finalConversation = await conversationService.saveMessage(
      conversation._id.toString(),
      'assistant',
      aiResponse.response,
    );

    // Save to history
    await conversationService.saveToHistory(userId, message, aiResponse.response);

    sendSuccess(res, 200, 'Chat response generated successfully', {
      conversationId: conversation._id.toString(),
      message: aiResponse.response,
      messages: finalConversation.messages,
    });
  }),

  /**
   * Get AI History (protected)
   */
  getHistory: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const page = parseInt(typeof pageParam === 'string' ? pageParam : '1') || 1;
    const limit = parseInt(typeof limitParam === 'string' ? limitParam : '20') || 20;

    const result = await aiHistoryService.getUserHistory(userId, page, limit);

    sendPaginated(
      res,
      200 as number,
      'AI history retrieved successfully' as string,
      result.data as any[],
      result.pagination.page as number,
      result.pagination.limit as number,
      result.pagination.total as number,
    );
  }),

  /**
   * Delete single history item (protected)
   */
  deleteHistoryItem: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const historyId = typeof id === 'string' ? id : id[0];
    await aiHistoryService.deleteHistoryItem(userId, historyId);

    sendSuccess(res, 200, 'History item deleted successfully');
  }),

  /**
   * Clear all history (protected)
   */
  clearAllHistory: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const deletedCount = await aiHistoryService.clearUserHistory(userId);

    sendSuccess(res, 200, `Deleted ${deletedCount} history items`);
  }),
};
