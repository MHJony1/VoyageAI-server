import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { UnauthorizedError } from '../../errors/AppError';
import { adminService } from './admin.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

const getParam = (value: any): string | undefined => {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
};

const getId = (value: any): string => (Array.isArray(value) ? value[0] : value);

const num = (value: any, fallback: number): number => {
  const raw = getParam(value);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const boolStr = (value: any): 'true' | 'false' | undefined => {
  const raw = getParam(value);
  return raw === 'true' || raw === 'false' ? raw : undefined;
};

export const adminController = {
  /* ------------------------------ Overview ------------------------------ */
  getOverview: catchAsync(async (_req: IAuthRequest, res: Response) => {
    const overview = await adminService.getOverview();
    sendSuccess(res, 200, 'Admin overview retrieved successfully', overview);
  }),

  /* ---------------------------- Destinations ---------------------------- */
  listDestinations: catchAsync(async (req: IAuthRequest, res: Response) => {
    const result = await adminService.listDestinations({
      page: num(req.query.page, 1),
      limit: num(req.query.limit, 10),
      search: getParam(req.query.search),
      country: getParam(req.query.country),
      category: getParam(req.query.category),
      featured: boolStr(req.query.featured),
      published: boolStr(req.query.published),
      sort: getParam(req.query.sort) as any,
    });
    sendPaginated(
      res,
      200,
      'Destinations retrieved successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  createDestination: catchAsync(async (req: IAuthRequest, res: Response) => {
    const destination = await adminService.createDestination(req.body);
    sendSuccess(res, 201, 'Destination created successfully', destination);
  }),

  updateDestination: catchAsync(async (req: IAuthRequest, res: Response) => {
    const destination = await adminService.updateDestination(getId(req.params.id), req.body);
    sendSuccess(res, 200, 'Destination updated successfully', destination);
  }),

  deleteDestination: catchAsync(async (req: IAuthRequest, res: Response) => {
    await adminService.deleteDestination(getId(req.params.id));
    sendSuccess(res, 200, 'Destination deleted successfully');
  }),

  toggleFeature: catchAsync(async (req: IAuthRequest, res: Response) => {
    const destination = await adminService.toggleFeature(getId(req.params.id));
    sendSuccess(res, 200, 'Destination feature status updated', destination);
  }),

  togglePublish: catchAsync(async (req: IAuthRequest, res: Response) => {
    const destination = await adminService.togglePublish(getId(req.params.id));
    sendSuccess(res, 200, 'Destination publish status updated', destination);
  }),

  /* -------------------------------- Users ------------------------------- */
  listUsers: catchAsync(async (req: IAuthRequest, res: Response) => {
    const result = await adminService.listUsers({
      page: num(req.query.page, 1),
      limit: num(req.query.limit, 10),
      search: getParam(req.query.search),
      role: getParam(req.query.role) as any,
      blocked: boolStr(req.query.blocked),
    });
    sendPaginated(
      res,
      200,
      'Users retrieved successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  changeRole: catchAsync(async (req: IAuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new UnauthorizedError('User not authenticated');
    const user = await adminService.changeRole(adminId, getId(req.params.id), req.body.role);
    sendSuccess(res, 200, 'User role updated successfully', user);
  }),

  setBlocked: catchAsync(async (req: IAuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new UnauthorizedError('User not authenticated');
    const user = await adminService.setBlocked(adminId, getId(req.params.id), req.body.blocked);
    sendSuccess(res, 200, 'User block status updated successfully', user);
  }),

  deleteUser: catchAsync(async (req: IAuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new UnauthorizedError('User not authenticated');
    await adminService.deleteUser(adminId, getId(req.params.id));
    sendSuccess(res, 200, 'User deleted successfully');
  }),

  /* -------------------------------- Trips ------------------------------- */
  listTrips: catchAsync(async (req: IAuthRequest, res: Response) => {
    const result = await adminService.listTrips({
      page: num(req.query.page, 1),
      limit: num(req.query.limit, 10),
      search: getParam(req.query.search),
      status: getParam(req.query.status),
    });
    sendPaginated(
      res,
      200,
      'Trips retrieved successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  deleteTrip: catchAsync(async (req: IAuthRequest, res: Response) => {
    await adminService.deleteTrip(getId(req.params.id));
    sendSuccess(res, 200, 'Trip deleted successfully');
  }),

  /* ------------------------------- Reviews ------------------------------ */
  listReviews: catchAsync(async (req: IAuthRequest, res: Response) => {
    const result = await adminService.listReviews({
      page: num(req.query.page, 1),
      limit: num(req.query.limit, 10),
      search: getParam(req.query.search),
    });
    sendPaginated(
      res,
      200,
      'Reviews retrieved successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),

  deleteReview: catchAsync(async (req: IAuthRequest, res: Response) => {
    await adminService.deleteReview(getId(req.params.id));
    sendSuccess(res, 200, 'Review deleted successfully');
  }),

  /* ------------------------------ AI History ---------------------------- */
  listAIHistory: catchAsync(async (req: IAuthRequest, res: Response) => {
    const result = await adminService.listAIHistory({
      page: num(req.query.page, 1),
      limit: num(req.query.limit, 10),
      search: getParam(req.query.search),
      type: getParam(req.query.type) as any,
    });
    sendPaginated(
      res,
      200,
      'AI history retrieved successfully',
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }),
};
