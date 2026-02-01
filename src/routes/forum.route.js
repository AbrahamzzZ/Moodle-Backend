import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getForumsByCourses,
  getForumDiscussions,
  getDiscussionPosts,
  postReplyForum
} from '../controllers/forum.controller.js';

const router = express.Router();

router.get('/forums', authMiddleware, getForumsByCourses);
router.get('/forums/:forumId/discussions', authMiddleware, getForumDiscussions);
router.get('/discussions/:discussionId/posts', authMiddleware, getDiscussionPosts);
router.post('/forums/reply', authMiddleware, postReplyForum);

export default router;
