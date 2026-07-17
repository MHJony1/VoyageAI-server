import { Router } from 'express';
import { aiController } from './ai.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { tripPlanSchema, recommendationSchema, chatSchema } from './ai.validation';

/**
 * AI Routes
 */
const router = Router();

// All routes are protected
router.use(authenticate);

// Trip Planner
router.post('/trip-plan', validate({ body: tripPlanSchema }), aiController.tripPlan);

// Recommendation
router.post('/recommend', validate({ body: recommendationSchema }), aiController.recommend);

// Chat
router.post('/chat', validate({ body: chatSchema }), aiController.chat);

export default router;
