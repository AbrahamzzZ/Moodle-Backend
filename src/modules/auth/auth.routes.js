import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { getRoleByCourse, loginWithGoogle } from './auth.controller.js';

const router = Router();

router.post('/login/google', loginWithGoogle);
router.get('/role/:courseId', requireAuth, getRoleByCourse);

export default router;
