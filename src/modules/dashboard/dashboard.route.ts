import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares/authenticate';

/**
 * Dashboard Routes
 */
const router = Router();

// All routes are protected
router.use(authenticate);

// Dashboard overview
router.get('/overview', dashboardController.getOverview);

// Dashboard statistics
router.get('/statistics', dashboardController.getStatistics);

export default router;
