import {
  fetchForums,
  addDiscussion,
  replyToPost,
  fetchForumDiscussions
} from '../services/forum.service.js';

export async function getForumsByCourses(req, res) {
  try {
    let { courseIds } = req.query;

    if (!courseIds) {
      throw new Error('courseIds es requerido');
    }

    if (!Array.isArray(courseIds)) {
      courseIds = [courseIds];
    }

    courseIds = courseIds.map(Number);

    const forums = await fetchForums(courseIds);
    res.json({ ok: true, forums });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getForumDiscussions(req, res) {
  try {
    const { forumId } = req.params;

    if (!forumId) {
      return res.status(400).json({
        ok: false,
        message: 'forumId es requerido',
      });
    }

    const discussions = await fetchForumDiscussions(Number(forumId));

    res.json({
      ok: true,
      discussions,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function createForumDiscussion(req, res) {
  try {
    const { forumId, subject, message } = req.body;

    const discussion = await addDiscussion(
      req.user,
      forumId,
      subject,
      message
    );

    res.json({ ok: true, discussion });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}

export async function replyForumPost(req, res) {
  try {
    const { postId, message } = req.body;

    const reply = await replyToPost(req.user, postId, message);

    res.json({ ok: true, reply });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}
