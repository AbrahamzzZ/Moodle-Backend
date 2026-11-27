import prisma from '../../lib/prisma.js';
import { callMoodle } from '../../moodle/client.js';

export async function getForums(courseIds, token) {
  return callMoodle(token, 'mod_forum_get_forums_by_courses', { courseids: courseIds });
}

/** En cada discusión, `id` es el primer post y `discussion` es el id de la discusión. */
export async function getDiscussions(forumId, token) {
  return callMoodle(token, 'mod_forum_get_forum_discussions', { forumid: forumId });
}

/** Devuelve { posts, forumid, courseid, ... } */
export async function getDiscussionPosts(discussionId, token) {
  return callMoodle(token, 'mod_forum_get_discussion_posts', { discussionid: discussionId });
}

/**
 * Responde a un post con el token del usuario y lo registra localmente para que el job de recordatorios no le avise.
 */
export async function replyToPost({ userId, courseId, postId, message, token }) {
  const reply = await callMoodle(
    token,
    'mod_forum_add_discussion_post',
    {
      postid: postId,
      subject: 'Re: Respuesta',
      message: `<p>${message}</p>`,
      messageformat: 1,
    },
    { method: 'POST' }
  );

  try {
    await markReplied({ userId, courseId, discussionId: reply?.post?.discussionid, token });
  } catch (error) {
    console.error('No se pudo registrar la respuesta al foro:', error.message);
  }

  return reply;
}

async function markReplied({ userId, courseId, discussionId, token }) {
  if (!discussionId) return;

  const { forumid: forumId } = await getDiscussionPosts(discussionId, token);
  if (!forumId) return;

  await prisma.forumReplyStatus.upsert({
    where: { userId_discussionId: { userId, discussionId } },
    update: { replied: true, repliedAt: new Date() },
    create: { userId, courseId, forumId, discussionId, replied: true, repliedAt: new Date() },
  });
}
