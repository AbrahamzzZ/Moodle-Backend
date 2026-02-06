import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { downloadFile } from '../controllers/file.controller.js';
const router = express.Router();

router.get('/files/download', authMiddleware, downloadFile);

export default router;
