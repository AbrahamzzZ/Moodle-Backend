import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { downloadFile, listCourseResources } from './resources.controller.js';

const router = Router();

router.get('/courses/:courseId/resources', requireAuth, listCourseResources);
router.get('/files/download', requireAuth, downloadFile);

export default router;
