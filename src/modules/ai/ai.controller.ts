import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import { aiService } from './ai.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

/**
 * AI Controller
 * Handles AI endpoint requests
 */

export const aiController = {
  /**
   * Trip Plan API (protected)
   */
  tripPlan: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await aiService.generateTripPlan(req.body);
    sendSuccess(res, 200, 'Trip plan generated successfully', result);
  }),

  /**
   * Recommendation API (protected)
   */
  recommend: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await aiService.generateRecommendation(req.body);
    sendSuccess(res, 200, 'Recommendations generated successfully', result);
  }),

  /**
   * Chat API (protected)
   */
  chat: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await aiService.chat(req.body);
    sendSuccess(res, 200, 'Chat response generated successfully', result);
  }),
};
