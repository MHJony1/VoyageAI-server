import { Router } from 'express';
import { destinationController } from './destination.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { createDestinationSchema, updateDestinationSchema, listDestinationsSchema, destinationIdSchema } from './destination.validation';

/**
 * Destination Routes
 */
const router = Router();

// Public routes
router.get('/', validate({ query: listDestinationsSchema }), destinationController.getAll);
router.get('/featured', destinationController.getFeatured);
router.get('/countries', destinationController.getCountries);
router.get('/:id', validate({ params: destinationIdSchema }), destinationController.getById);

// Protected routes
router.post('/', authenticate, validate({ body: createDestinationSchema }), destinationController.create);
router.patch(
  '/:id',
  authenticate,
  validate({ params: destinationIdSchema, body: updateDestinationSchema }),
  destinationController.update,
);
router.delete('/:id', authenticate, validate({ params: destinationIdSchema }), destinationController.delete);

export default router;
