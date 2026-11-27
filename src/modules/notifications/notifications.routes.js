import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { registerToken } from './notifications.controller.js';

const router = Router();

router.post('/register', requireAuth, registerToken);

export default router;
