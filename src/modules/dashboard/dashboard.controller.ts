import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import { dashboardService } from './dashboard.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

/**
 * Dashboard Controller
 * Handles dashboard endpoints
 */

export const dashboardController = {
  /**
   * Get dashboard overview (protected)
   */
  getOverview: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const overview = await dashboardService.getOverview(userId);
    sendSuccess(res, 200, 'Dashboard overview retrieved successfully', overview);
  }),

  /**
   * Get dashboard statistics (protected)
   */
  getStatistics: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const statistics = await dashboardService.getStatistics(userId);
    sendSuccess(res, 200, 'Dashboard statistics retrieved successfully', statistics);
  }),
};
