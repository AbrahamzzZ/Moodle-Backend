import express from 'express';
import {
  registerToken
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', authMiddleware, registerToken);

export default router;
