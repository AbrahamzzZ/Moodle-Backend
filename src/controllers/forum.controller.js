import {
  fetchForums,
  fetchForumDiscussions,
  fetchDiscussionPosts,
  replyToPost
} from '../services/forum.service.js';
import { getUserRoleByCourse } from '../services/auth.service.js';

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

export async function getDiscussionPosts(req, res) {
  try {
    const { discussionId } = req.params;

    if (!discussionId) {
      return res.status(400).json({
        ok: false,
        message: 'discussionId es requerido',
      });
    }

    const response = await fetchDiscussionPosts(Number(discussionId));
    if (!response || !response.posts || response.posts.length === 0) {
      return res.json({
        ok: true,
        posts: [],
      });
    }

    return res.json({
      ok: true,
      posts: response.posts,
    });

  } catch (error) {
    console.error('getDiscussionPosts warning:', error.message);

    return res.json({
      ok: true,
      posts: [],
      warning: 'Discusión sin respuestas',
    });
  }
}

export async function postReplyForum(req, res) {
  try {
    const { postId, message, courseId } = req.body;
    const { id: userId, moodleToken } = req.user;

    if (!postId || !message || !courseId) {
      return res.status(400).json({
        ok: false,
        message: 'postId, message y courseId son requeridos',
      });
    }

    const role = await getUserRoleByCourse({ userId, courseId });

    if (!role) {
      return res.status(403).json({
        ok: false,
        message: 'Usuario no matriculado en el curso',
      });
    }

    const reply = await replyToPost({
      postId,
      message,
      userToken: moodleToken, 
    });

    res.json({ ok: true, reply });
  } catch (error) {
    console.error('Error postReplyForum:', error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}