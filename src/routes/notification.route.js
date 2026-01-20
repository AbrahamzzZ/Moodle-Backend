import express from 'express';
import {
  registerToken,
  sendLogoutNotification,
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', authMiddleware, registerToken);
router.post('/logout-push', authMiddleware, sendLogoutNotification);

export default router;
