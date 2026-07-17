import { Router } from 'express';
import { tripController } from './trip.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { createTripSchema, updateTripSchema, tripIdSchema, myTripsSchema } from './trip.validation';

/**
 * Trip Routes
 */
const router = Router();

// All routes are protected
router.use(authenticate);

// Create trip
router.post('/', validate({ body: createTripSchema }), tripController.create);

// Get user's trips
router.get('/', validate({ query: myTripsSchema }), tripController.getMyTrips);

// Get trip by ID
router.get('/:id', validate({ params: tripIdSchema }), tripController.getById);

// Update trip
router.patch('/:id', validate({ params: tripIdSchema, body: updateTripSchema }), tripController.update);

// Delete trip
router.delete('/:id', validate({ params: tripIdSchema }), tripController.delete);

export default router;
