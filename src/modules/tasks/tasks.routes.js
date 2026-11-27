import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { singleFile, uploadDocument } from '../../middleware/upload.js';
import { getTask, postTaskFile, postTaskText } from './tasks.controller.js';

const router = Router();

router.get('/tasks/:taskId', requireAuth, getTask);
router.post('/tasks/submit-text', requireAuth, postTaskText);
router.post('/tasks/submit-file', requireAuth, singleFile(uploadDocument, 'file'), postTaskFile);

export default router;
