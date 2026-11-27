import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { listDiscussions, listForums, listPosts, reply } from './forum.controller.js';

const router = Router();

router.get('/forums', requireAuth, listForums);
router.get('/forums/:forumId/discussions', requireAuth, listDiscussions);
router.get('/discussions/:discussionId/posts', requireAuth, listPosts);
router.post('/forums/reply', requireAuth, reply);

export default router;
