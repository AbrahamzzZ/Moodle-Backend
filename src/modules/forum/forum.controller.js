import { requireFields, toId, toIdList } from '../../lib/validate.js';
import { withUserToken } from '../../moodle/tokens.js';
import { getDiscussionPosts, getDiscussions, getForums, replyToPost } from './forum.service.js';

/** GET /api/forum/forums?courseIds=... */
export async function listForums(req, res) {
  const courseIds = toIdList(req.query.courseIds, 'courseIds');
  const forums = await withUserToken(req.user.id, token => getForums(courseIds, token));
  res.json({ ok: true, forums });
}

/** GET /api/forum/forums/:forumId/discussions */
export async function listDiscussions(req, res) {
  const forumId = toId(req.params.forumId, 'forumId');
  const discussions = await withUserToken(req.user.id, token => getDiscussions(forumId, token));
  res.json({ ok: true, discussions });
}

/** GET /api/forum/discussions/:discussionId/posts */
export async function listPosts(req, res) {
  const discussionId = toId(req.params.discussionId, 'discussionId');
  const response = await withUserToken(req.user.id, token => getDiscussionPosts(discussionId, token));
  res.json({ ok: true, posts: response?.posts ?? [] });
}

/** POST /api/forum/forums/reply  { postId, message, courseId } */
export async function reply(req, res) {
  requireFields(req.body, ['postId', 'message', 'courseId']);
  const postId = toId(req.body.postId, 'postId');
  const courseId = toId(req.body.courseId, 'courseId');
  const userId = req.user.id;

  const result = await withUserToken(userId, token =>
    replyToPost({ userId, courseId, postId, message: String(req.body.message), token })
  );

  res.json({ ok: true, reply: result });
}
