import prisma from '../../prisma/client.js';
<<<<<<< Updated upstream
import {
  fetchForums,
  fetchForumDiscussions,
} from '../../services/forum.service.js';
import { getUserCourses } from '../../services/course.service.js';
=======
import { userHasReplied } from '../../services/forum.service.js';
>>>>>>> Stashed changes
import { sendForumReminder } from '../../services/notification.service.js';

export async function runForumReminderJob() {
  console.log('Ejecutando job de recordatorios');

  const now = Math.floor(Date.now() / 1000);
  const REMINDER_WINDOW = 2 * 60;

  const usersWithToken = await prisma.userPushToken.findMany({
    select: { userId: true, pushToken: true },
  });
  console.log('TOKENS:', usersWithToken);

  for (const { userId, pushToken } of usersWithToken) {
    const courses = await getUserCourses(userId);
    for (const course of courses) {
      const forums = await fetchForums([course.id]);

      const expiringForums = forums.filter(
        f => f.duedate && f.duedate > now && f.duedate - now <= REMINDER_WINDOW
      );

      for (const forum of expiringForums) {
        const discussionsResponse = await fetchForumDiscussions(forum.id);
        const discussions = discussionsResponse.discussions || [];

        for (const discussion of discussions) {
          const status = await prisma.forumReplyStatus.findUnique({
            where: {
              userId_discussionId: {
                userId,
                discussionId: discussion.id,
              },
            },
          });

          if (status?.replied || status?.notified) {
            console.log('Skip - ya respondido o notificado');
            continue;
          }

          try {
            await sendForumReminder(
              userId,
              'Foro por caducar',
              `El foro "${forum.name}" está por cerrarse`
            );

            await prisma.forumReplyStatus.upsert({
              where: {
                userId_discussionId: {
                  userId,
                  discussionId: discussion.id,
                },
              },
              update: { notified: true },
              create: {
                userId,
                courseId: course.id,
                forumId: forum.id,
                discussionId: discussion.id,
                replied: false,
                notified: true,
              },
            });
          } catch (err) {
            console.error('Error enviando push o actualizando DB:', err);
          }
        }

        if (discussions.length === 0) {
          const status = await prisma.forumReplyStatus.findUnique({
            where: {
              userId_discussionId: {
                userId,
                discussionId: 0, 
              },
            },
          });

          if (!status?.notified) {
            try {
              await sendForumReminder(
                userId,
                'Foro por caducar',
                `El foro "${forum.name}" está por cerrarse`
              );

              await prisma.forumReplyStatus.upsert({
                where: {
                  userId_discussionId: {
                    userId,
                    discussionId: 0,
                  },
                },
                update: { notified: true },
                create: {
                  userId,
                  courseId: course.id,
                  forumId: forum.id,
                  discussionId: 0,
                  replied: false,
                  notified: true,
                },
              });
            } catch (err) {
              console.error('Error enviando push o actualizando DB (foro sin discusión):', err);
            }
          }
        }
      }
    }
  }
}