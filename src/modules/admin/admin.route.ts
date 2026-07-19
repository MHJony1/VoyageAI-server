import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  idParamSchema,
  adminListDestinationsSchema,
  createDestinationSchema,
  updateDestinationSchema,
  adminListUsersSchema,
  changeRoleSchema,
  blockUserSchema,
  adminListTripsSchema,
  adminListReviewsSchema,
  adminListAIHistorySchema,
} from './admin.validation';

/**
 * Admin Routes
 * All routes require an authenticated admin user.
 */
const router = Router();

router.use(authenticate, authorize('admin'));

// Overview
router.get('/overview', adminController.getOverview);

// Destinations
router.get('/destinations', validate({ query: adminListDestinationsSchema }), adminController.listDestinations);
router.post('/destinations', validate({ body: createDestinationSchema }), adminController.createDestination);
router.patch(
  '/destinations/:id',
  validate({ params: idParamSchema, body: updateDestinationSchema }),
  adminController.updateDestination,
);
router.delete('/destinations/:id', validate({ params: idParamSchema }), adminController.deleteDestination);
router.patch('/destinations/:id/feature', validate({ params: idParamSchema }), adminController.toggleFeature);
router.patch('/destinations/:id/publish', validate({ params: idParamSchema }), adminController.togglePublish);

// Users
router.get('/users', validate({ query: adminListUsersSchema }), adminController.listUsers);
router.patch(
  '/users/:id/role',
  validate({ params: idParamSchema, body: changeRoleSchema }),
  adminController.changeRole,
);
router.patch(
  '/users/:id/block',
  validate({ params: idParamSchema, body: blockUserSchema }),
  adminController.setBlocked,
);
router.delete('/users/:id', validate({ params: idParamSchema }), adminController.deleteUser);

// Trips
router.get('/trips', validate({ query: adminListTripsSchema }), adminController.listTrips);
router.delete('/trips/:id', validate({ params: idParamSchema }), adminController.deleteTrip);

// Reviews
router.get('/reviews', validate({ query: adminListReviewsSchema }), adminController.listReviews);
router.delete('/reviews/:id', validate({ params: idParamSchema }), adminController.deleteReview);

// AI History (read-only)
router.get('/ai-history', validate({ query: adminListAIHistorySchema }), adminController.listAIHistory);

export default router;
