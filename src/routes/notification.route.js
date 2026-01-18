import express from 'express';
import {
  registerToken,
  sendToUser,
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', authMiddleware, registerToken);
router.post('/send-to-user', sendToUser);

export default router;
