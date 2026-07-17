import { Router, Request, Response } from 'express';
import authRoutes from '../modules/auth/auth.route';
import destinationRoutes from '../modules/destination/destination.route';
import tripRoutes from '../modules/trip/trip.route';

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

  // Module routes
  router.use('/auth', authRoutes);
  router.use('/destinations', destinationRoutes);
  router.use('/trips', tripRoutes);
  // router.use('/users', userRoutes);
  // router.use('/reviews', reviewRoutes);
  // router.use('/ai', aiRoutes);
  // router.use('/dashboard', dashboardRoutes);

  return router;
};

export default createRouter();
