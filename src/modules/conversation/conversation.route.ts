import { Router } from 'express';
import { conversationController } from './conversation.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { chatSchema } from './conversation.validation';

/**
 * Conversation Routes
 */
const router = Router();

// All routes are protected
router.use(authenticate);

// Chat
router.post('/chat', validate({ body: chatSchema }), conversationController.chat);

// AI History
router.get('/history', conversationController.getHistory);
router.delete('/history/:id', conversationController.deleteHistoryItem);
router.delete('/history', conversationController.clearAllHistory);

export default router;
