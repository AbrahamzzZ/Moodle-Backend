import cron from 'node-cron';
import { env } from '../config/env.js';
import { runForumReminderJob } from './forumReminder.job.js';

/** Programa las tareas en segundo plano. Se llama una vez al arrancar el servidor. */
export function startJobs() {
  // Recordatorio push de foros que están por cerrar y en los que el estudiante no participó.
  cron.schedule(env.forumReminder.cron, () => {
    runForumReminderJob();
  });
}
