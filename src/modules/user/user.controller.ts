import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { userService } from './user.service';
import { sendSuccess } from '../../utils/response';
import { UnauthorizedError } from '../../errors/AppError';
import type { IAuthRequest } from '../../interfaces/IRequest';

/**
 * User Controller
 * Handles user profile endpoints
 */

export const userController = {
  getProfile: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }
    const user = await userService.getProfile(userId);
    sendSuccess(res, 200, 'Profile retrieved successfully', user);
  }),

  updateProfile: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }
    const updatedUser = await userService.updateProfile(userId, req.body);
    sendSuccess(res, 200, 'Profile updated successfully', updatedUser);
  }),
};
