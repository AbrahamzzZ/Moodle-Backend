import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import {
  listActivities,
  listAssignments,
  listCourseActivities,
  listForums,
} from './activities.controller.js';

const router = Router();

router.get('/activities', requireAuth, listActivities);
router.get('/activities/course/:courseId', requireAuth, listCourseActivities);
router.get('/activities/assignments', requireAuth, listAssignments);
router.get('/activities/forums', requireAuth, listForums);

export default router;
