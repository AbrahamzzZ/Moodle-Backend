import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { getCourseDetail, listCourses } from './courses.controller.js';

const router = Router();

router.get('/courses', requireAuth, listCourses);
router.get('/courses/:id', requireAuth, getCourseDetail);

export default router;
