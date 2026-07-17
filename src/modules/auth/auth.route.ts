import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { registerSchema, loginSchema } from './auth.validation';

/**
 * Auth Routes
 */
const router = Router();

// Public routes
router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/google', authController.googleLogin);

// Protected routes (to be updated in Phase 3)
// router.get('/me', authenticate, authController.getCurrentUser);
// router.post('/logout', authenticate, authController.logout);

export default router;
