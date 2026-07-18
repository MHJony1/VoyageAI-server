import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { updateProfileSchema } from './user.validation';

/**
 * User Routes
 */
const router = Router();

// All routes protected
router.use(authenticate);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.patch('/profile', validate({ body: updateProfileSchema }), userController.updateProfile);

export default router;
