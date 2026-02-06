import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { postTaskText, postTaskFile } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/tasks/submit-text', authMiddleware, postTaskText);
router.post('/tasks/submit-file', authMiddleware, upload.single('file'), postTaskFile);

export default router;