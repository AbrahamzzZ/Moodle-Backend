import cron from 'node-cron';
import { runForumReminderJob } from './jobs/forumReminder.job.js';

cron.schedule('0 */30 * * *', () => {
  console.log('Revisando foros pendientes...');
  runForumReminderJob();
});