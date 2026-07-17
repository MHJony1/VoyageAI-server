import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { tripService } from './trip.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

const getQueryParam = (value: any): string | undefined => {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
};

/**
 * Trip Controller
 * Handles trip endpoint requests
 */

export const tripController = {
  /**
   * Create trip (protected)
   */
  create: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const trip = await tripService.create(userId, req.body);
    sendSuccess(res, 201, 'Trip created successfully', trip);
  }),

  /**
   * Get user's trips with pagination (protected)
   */
  getMyTrips: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const pageStr = getQueryParam(req.query.page);
    const limitStr = getQueryParam(req.query.limit);

    const result = await tripService.getMyTrips(
      userId,
      pageStr ? parseInt(pageStr) : 1,
      limitStr ? parseInt(limitStr) : 12,
    );

    sendPaginated(
      res,
      200,
      'Trips fetched successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  /**
   * Get trip by ID (protected)
   */
  getById: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const trip = await tripService.getById(id, userId);
    sendSuccess(res, 200, 'Trip fetched successfully', trip);
  }),

  /**
   * Update trip (protected)
   */
  update: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const trip = await tripService.update(id, userId, req.body);
    sendSuccess(res, 200, 'Trip updated successfully', trip);
  }),

  /**
   * Delete trip (protected)
   */
  delete: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await tripService.delete(id, userId);
    sendSuccess(res, 200, 'Trip deleted successfully');
  }),
};
