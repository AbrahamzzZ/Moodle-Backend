import {
  fetchForums,
  fetchForumDiscussions,
  fetchDiscussionPosts,
  replyToPost
} from '../services/forum.service.js';
import prisma from '../prisma/client.js';

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

    const posts = await fetchDiscussionPosts(Number(discussionId));

    res.json({
      ok: true,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function postReplyForum(req, res) {
  try {
    const { postId, message } = req.body;
    if (!postId || !message) {
      return res.status(400).json({
        ok: false,
        message: 'postId y message son requeridos',
      });
    }

    const token = req.user.moodleToken;

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario no tiene token de Moodle asignado',
      });
    }

    const reply = await replyToPost({ postId, message, token });

    res.json({ ok: true, reply });
  } catch (error) {
    console.error('Error postReplyForum:', error);
    res.status(400).json({ ok: false, message: error.message });
  }
}

export async function createForumReminder(req, res) {
  try {
    const userId = req.user.id;
    const { discussionId, forumId } = req.body;

    if (!discussionId || !forumId) {
      return res.status(400).json({
        ok: false,
        message: 'discussionId y forumId son requeridos',
      });
    }

    await prisma.forumReminder.upsert({
      where: {
        userId_discussionId: {
          userId,
          discussionId,
        },
      },
      update: {},
      create: {
        userId,
        discussionId,
        forumId,
      },
    });

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}
