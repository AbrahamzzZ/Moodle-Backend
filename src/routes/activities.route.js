import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getActivitiesByAllCourses,
  getCourseActivities,
  getAssignmentsByCourses,
  getUserAssignmentsByCourses,
  getForumsByCourses
} from '../controllers/activities.controller.js';

const router = express.Router();

router.get('/activities', authMiddleware, getActivitiesByAllCourses);
router.get('/activities/course/:courseId', authMiddleware, getCourseActivities);
router.get('/activities/assignments', authMiddleware, getAssignmentsByCourses);
router.get('/activities/assignments/user/:userId', authMiddleware, getUserAssignmentsByCourses);
router.get('/activities/forums', authMiddleware, getForumsByCourses);

export default router;
