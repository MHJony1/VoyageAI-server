import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';

/**
 * User Controller
 * Handles user profile endpoints
 * To be implemented in Phase 3
 */

export const userController = {
  getProfile: catchAsync(async (_req: Request, _res: Response) => {
    // TODO: Implement get profile logic
  }),

  updateProfile: catchAsync(async (_req: Request, _res: Response) => {
    // TODO: Implement update profile logic
  }),
};
