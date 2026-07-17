import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import { authService } from './auth.service';
import type { IAuthRequest } from '../../interfaces/IRequest';

/**
 * Auth Controller
 * Handles authentication endpoint requests
 */

export const authController = {
  register: catchAsync(async (req: IAuthRequest, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, 201, 'Registered successfully', result);
  }),

  login: catchAsync(async (req: IAuthRequest, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, 200, 'Logged in successfully', result);
  }),

  googleLogin: catchAsync(async (req: IAuthRequest, res: Response) => {
    const { token } = req.body;
    const result = await authService.googleLogin(token);
    sendSuccess(res, 200, 'Google login successful', result);
  }),

  getCurrentUser: catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const user = await authService.getCurrentUser(userId);
    sendSuccess(res, 200, 'User fetched successfully', user);
  }),

  logout: catchAsync(async (_req: IAuthRequest, res: Response) => {
    sendSuccess(res, 200, 'Logged out successfully');
  }),
};
