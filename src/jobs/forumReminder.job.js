import { env } from '../config/env.js';
import prisma from '../lib/prisma.js';
import { ADMIN_TOKEN } from '../moodle/tokens.js';
import { getDiscussionPosts, getDiscussions, getForums } from '../modules/forum/forum.service.js';
import { getUserCourses } from '../modules/courses/courses.service.js';
import { getUserRoleInCourse } from '../modules/auth/auth.service.js';
import { sendPushToUser } from '../modules/notifications/notifications.service.js';

// El job corre sin un usuario conectado: usa el token admin para consultar Moodle.
const REMINDER_WINDOW_SECONDS = env.forumReminder.windowMinutes * 60;

let isRunning = false;

function getForumDeadline(forum) {
  return forum.duedate || forum.cutoffdate || 0;
}

function formatTimeLeft(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `${hours} h`;
}

async function userHasParticipated(userId, forumId) {
  const localReply = await prisma.forumReplyStatus.findFirst({
    where: { userId, forumId, replied: true },
  });
  if (localReply) return true;

  const { discussions = [] } = await getDiscussions(forumId, ADMIN_TOKEN);

  for (const discussion of discussions) {
    if (discussion.userid === userId) return true;

    // Hay que tener en cuenta en esta respuesta "id" es el primer post; el id de la discusión es "discussion".
    const { posts = [] } = await getDiscussionPosts(discussion.discussion, ADMIN_TOKEN);
    if (posts.some(post => post.author?.id === userId)) return true;
  }

  return false;
}

async function processUser(userId, now, forumsCache) {
  const courses = await getUserCourses(userId, ADMIN_TOKEN);

  for (const course of courses) {
    if (!forumsCache.has(course.id)) {
      forumsCache.set(course.id, await getForums([course.id], ADMIN_TOKEN));
    }

    const expiringForums = forumsCache.get(course.id).filter(forum => {
      const deadline = getForumDeadline(forum);
      return deadline > now && deadline - now <= REMINDER_WINDOW_SECONDS;
    });

    if (!expiringForums.length) continue;

    // Solo se recuerda a estudiantes, no a docentes.
    const role = await getUserRoleInCourse(userId, course.id);
    if (role !== 'estudiante') continue;

    for (const forum of expiringForums) {
      const alreadySent = await prisma.forumReminder.findUnique({
        where: { userId_forumId: { userId, forumId: forum.id } },
      });
      if (alreadySent) continue;

      if (await userHasParticipated(userId, forum.id)) continue;

      const timeLeft = formatTimeLeft(getForumDeadline(forum) - now);
      const delivered = await sendPushToUser(userId, {
        title: 'Foro por cerrar',
        body: `El foro "${forum.name}" (${course.fullname}) cierra en ${timeLeft} y aún no has participado.`,
        data: { type: 'forum-reminder', courseId: course.id, forumId: forum.id },
      });

      if (!delivered) continue;

      await prisma.forumReminder.create({
        data: { userId, courseId: course.id, forumId: forum.id },
      });
      console.log(`[recordatorios] Enviado a usuario ${userId}, foro ${forum.id}`);
    }
  }
}

export async function runForumReminderJob() {
  if (isRunning) return;
  isRunning = true;

  try {
    const now = Math.floor(Date.now() / 1000);
    const users = await prisma.userPushToken.findMany({ select: { userId: true } });
    const forumsCache = new Map();

    for (const { userId } of users) {
      try {
        await processUser(userId, now, forumsCache);
      } catch (error) {
        console.error(`[recordatorios] Error con usuario ${userId}:`, error.message);
      }
    }
  } catch (error) {
    console.error('[recordatorios] Error general:', error.message);
  } finally {
    isRunning = false;
  }
}
