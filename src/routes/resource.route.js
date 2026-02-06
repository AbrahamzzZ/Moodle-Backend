import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getCourseResources} from '../controllers/resource.controller.js';
import { downloadFile } from '../controllers/file.controller.js';

const router = express.Router();


router.get('/courses/:courseId/resources', authMiddleware, getCourseResources);
router.get('/files/download', authMiddleware, downloadFile);

export default router;
