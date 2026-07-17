import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { reviewService } from './review.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

const getQueryParam = (value: any): string | undefined => {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
};

/**
 * Review Controller
 * Handles review endpoint requests
 */

export const reviewController = {
  /**
   * Create review (protected)
   */
  create: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const review = await reviewService.create(userId, req.body);
    sendSuccess(res, 201, 'Review created successfully', review);
  }),

  /**
   * Get all reviews (public)
   */
  getAll: catchAsync(async (req: IAuthRequest, res: Response) => {
    const pageStr = getQueryParam(req.query.page);
    const limitStr = getQueryParam(req.query.limit);

    const result = await reviewService.getAll(
      pageStr ? parseInt(pageStr) : 1,
      limitStr ? parseInt(limitStr) : 12,
    );

    sendPaginated(
      res,
      200,
      'Reviews fetched successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  /**
   * Get reviews for destination (public)
   */
  getByDestination: catchAsync(async (req: IAuthRequest, res: Response) => {
    const pageStr = getQueryParam(req.query.page);
    const limitStr = getQueryParam(req.query.limit);
    const destinationId = Array.isArray(req.params.destinationId)
      ? req.params.destinationId[0]
      : req.params.destinationId;

    const result = await reviewService.getByDestination(
      destinationId,
      pageStr ? parseInt(pageStr) : 1,
      limitStr ? parseInt(limitStr) : 12,
    );

    sendPaginated(
      res,
      200,
      'Reviews fetched successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  /**
   * Get review by ID (protected)
   */
  getById: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const review = await reviewService.getById(id, userId);
    sendSuccess(res, 200, 'Review fetched successfully', review);
  }),

  /**
   * Update review (protected)
   */
  update: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const review = await reviewService.update(id, userId, req.body);
    sendSuccess(res, 200, 'Review updated successfully', review);
  }),

  /**
   * Delete review (protected)
   */
  delete: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await reviewService.delete(id, userId);
    sendSuccess(res, 200, 'Review deleted successfully');
  }),
};
