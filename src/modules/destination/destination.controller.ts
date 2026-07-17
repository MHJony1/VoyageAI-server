import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { destinationService } from './destination.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

const getQueryParam = (value: any): string | undefined => {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
};

/**
 * Destination Controller
 * Handles destination endpoint requests
 */

export const destinationController = {
  /**
   * Create destination (protected)
   */
  create: catchAsync(async (req: IAuthRequest, res: Response) => {
    const destination = await destinationService.create(req.body);
    sendSuccess(res, 201, 'Destination created successfully', destination);
  }),

  /**
   * Get all destinations with filtering, sorting, pagination (public)
   */
  getAll: catchAsync(async (req: IAuthRequest, res: Response) => {
    const pageStr = getQueryParam(req.query.page);
    const limitStr = getQueryParam(req.query.limit);
    const search = getQueryParam(req.query.search);
    const country = getQueryParam(req.query.country);
    const category = getQueryParam(req.query.category);
    const sortParam = getQueryParam(req.query.sort);

    const result = await destinationService.getAll({
      page: pageStr ? parseInt(pageStr) : 1,
      limit: limitStr ? parseInt(limitStr) : 12,
      search,
      country,
      category,
      sort: sortParam === 'rating' || sortParam === 'budget' ? sortParam : undefined,
    });

    sendPaginated(
      res,
      200,
      'Destinations fetched successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  /**
   * Get featured destinations (public)
   */
  getFeatured: catchAsync(async (_req: IAuthRequest, res: Response) => {
    const destinations = await destinationService.getFeatured();
    sendSuccess(res, 200, 'Featured destinations fetched successfully', destinations);
  }),

  /**
   * Get destination by ID (public)
   */
  getById: catchAsync(async (req: IAuthRequest, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const destination = await destinationService.getById(id);
    sendSuccess(res, 200, 'Destination fetched successfully', destination);
  }),

  /**
   * Delete destination (protected)
   */
  delete: catchAsync(async (req: IAuthRequest, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await destinationService.delete(id);
    sendSuccess(res, 200, 'Destination deleted successfully');
  }),
};
