import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
} from './user.validation';

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

// Change password
router.post(
  '/change-password',
  validate({ body: changePasswordSchema }),
  userController.changePassword,
);

// Settings
router.get('/settings', userController.getSettings);
router.patch('/settings', validate({ body: updateSettingsSchema }), userController.updateSettings);

// Logout all devices
router.post('/logout-all-devices', userController.logoutAllDevices);

export default router;
