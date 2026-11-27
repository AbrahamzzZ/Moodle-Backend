import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { getMyCourseGrades, listMyGrades } from './grades.controller.js';

const router = Router();

router.get('/grades', requireAuth, listMyGrades);
router.get('/grades/courses/:courseId', requireAuth, getMyCourseGrades);

export default router;
