import { Router, Request, Response } from 'express';

/**
 * Main Router
 * Central point for registering all route modules
 */
export const createRouter = (): Router => {
  const router = Router();

  // Health Check
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Module routes will be registered here
  // Example:
  // router.use('/auth', require('../modules/auth/auth.route').default);
  // router.use('/users', require('../modules/user/user.route').default);
  // router.use('/destinations', require('../modules/destination/destination.route').default);

  return router;
};

export default createRouter();
