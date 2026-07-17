import { Router } from 'express';
import { reviewController } from './review.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  destinationIdSchema,
  reviewsListSchema,
} from './review.validation';

/**
 * Review Routes
 */
const router = Router();

// Public routes
router.get('/', validate({ query: reviewsListSchema }), reviewController.getAll);
router.get(
  '/destination/:destinationId',
  validate({ params: destinationIdSchema, query: reviewsListSchema }),
  reviewController.getByDestination,
);

// Protected routes
router.post('/', authenticate, validate({ body: createReviewSchema }), reviewController.create);
router.get('/:id', authenticate, validate({ params: reviewIdSchema }), reviewController.getById);
router.patch(
  '/:id',
  authenticate,
  validate({ params: reviewIdSchema, body: updateReviewSchema }),
  reviewController.update,
);
router.delete(
  '/:id',
  authenticate,
  validate({ params: reviewIdSchema }),
  reviewController.delete,
);

export default router;
