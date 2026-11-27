import fs from 'fs/promises';
import { badRequest, notFound } from '../../lib/errors.js';
import { requireFields, toId } from '../../lib/validate.js';
import { withUserToken } from '../../moodle/tokens.js';
import { getTaskDetail, submitFile, submitText } from './tasks.service.js';

/** GET /api/tasks/:taskId?courseId=... */
export async function getTask(req, res) {
  if (!req.params.taskId || !req.query.courseId) throw badRequest('taskId y courseId son requeridos');
  const taskId = toId(req.params.taskId, 'taskId');
  const courseId = toId(req.query.courseId, 'courseId');

  const task = await withUserToken(req.user.id, token => getTaskDetail({ courseId, taskId, token }));
  if (!task) throw notFound('Tarea no encontrada');

  res.json({ ok: true, task });
}

/** POST /api/tasks/submit-text  { taskId, text } */
export async function postTaskText(req, res) {
  requireFields(req.body, ['taskId', 'text']);
  const taskId = toId(req.body.taskId, 'taskId');

  const submission = await withUserToken(req.user.id, token =>
    submitText({ taskId, text: String(req.body.text), token })
  );

  res.json({ ok: true, user: req.user, submission });
}

/** POST /api/tasks/submit-file  (multipart: taskId, file) */
export async function postTaskFile(req, res) {
  const file = req.file;
  try {
    if (!req.body.taskId || !file) throw badRequest('taskId y archivo son requeridos');
    const taskId = toId(req.body.taskId, 'taskId');

    await withUserToken(req.user.id, token =>
      submitFile({ taskId, filePath: file.path, fileName: file.originalname, token })
    );

    res.json({ ok: true, user: req.user, message: 'Archivo enviado correctamente para calificación' });
  } finally {
    // Borra el archivo temporal que dejó multer, haya salido bien o no.
    if (file?.path) await fs.unlink(file.path).catch(() => {});
  }
}
