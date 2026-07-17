import { AIHistory } from '../../models/aiHistory.model';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

/**
 * AI History Service
 * Handles AI interaction history management
 */

export const aiHistoryService = {
  /**
   * Get user's AI history with pagination
   */
  getUserHistory: async (userId: string, page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AIHistory.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AIHistory.countDocuments({ userId }),
    ]);

    return {
      data: data.map((doc: any) => ({
        _id: doc._id.toString(),
        userId: doc.userId.toString(),
        type: doc.type,
        prompt: doc.prompt,
        response: doc.response,
        createdAt: doc.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Delete a single history item
   */
  deleteHistoryItem: async (userId: string, historyId: string) => {
    const result = await AIHistory.deleteOne({
      _id: historyId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundError('History item not found');
    }
  },

  /**
   * Clear all history for user
   */
  clearUserHistory: async (userId: string) => {
    const result = await AIHistory.deleteMany({ userId });
    return result.deletedCount;
  },

  /**
   * Get history item by ID
   */
  getHistoryItem: async (userId: string, historyId: string) => {
    const item = await AIHistory.findById(historyId);

    if (!item) {
      throw new NotFoundError('History item not found');
    }

    if (item.userId.toString() !== userId) {
      throw new ForbiddenError('Cannot access this history item');
    }

    return {
      _id: item._id.toString(),
      userId: item.userId.toString(),
      type: item.type,
      prompt: item.prompt,
      response: item.response,
      createdAt: item.createdAt,
    };
  },
};
