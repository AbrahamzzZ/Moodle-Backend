import cron from 'node-cron';
import { runForumReminderJob } from './forumReminder.job.js';

cron.schedule('*/2 * * * *', () => {
  console.log('Revisando foros pendientes...');
  runForumReminderJob();
});