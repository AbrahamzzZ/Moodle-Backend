import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getForumsByCourses,
  createForumDiscussion,
  replyForumPost,
  getForumDiscussions
} from '../controllers/forum.controller.js';

const router = express.Router();

router.get('/forums', authMiddleware, getForumsByCourses);
router.get('/forums/:forumId/discussions',authMiddleware,getForumDiscussions);
router.post('/forums/discussion', authMiddleware, createForumDiscussion);
router.post('/forums/reply', authMiddleware, replyForumPost);

export default router;
