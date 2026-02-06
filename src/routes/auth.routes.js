import { Router } from "express";
import authMiddleware from '../middleware/auth.middleware.js';
import {
  loginWithGoogle,
  getRoleByCourse,
} from '../controllers/auth.controller.js';


const router = Router();

router.post("/login/google", loginWithGoogle);
router.get('/role/:courseId', authMiddleware, getRoleByCourse);

export default router;
