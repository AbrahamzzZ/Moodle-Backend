import prisma from '../../prisma/client.js';
import { userHasReplied } from '../services/forum.service.js';
import { sendForumReminder } from '../services/notification.service.js';

export async function runForumReminderJob() {
  const reminders = await prisma.forumReminder.findMany({
    where: {
      replied: false,
      notified: false,
    },
  });

  for (const reminder of reminders) {
    const replied = await userHasReplied(
      reminder.discussionId,
      reminder.userId
    );

    if (replied) {
      await prisma.forumReminder.update({
        where: { id: reminder.id },
        data: { replied: true },
      });
      continue;
    }

    await sendForumReminder(
      reminder.userId,
      'Tienes una participación pendiente',
      'Aún no has respondido en el foro'
    );

    await prisma.forumReminder.update({
      where: { id: reminder.id },
      data: { notified: true },
    });
  }
}
