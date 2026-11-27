import { callMoodle } from '../../moodle/client.js';
import { uploadDraftFile } from '../../moodle/files.js';

function getSubmissionStatus(taskId, token) {
  return callMoodle(token, 'mod_assign_get_submission_status', { assignid: taskId });
}

function isSubmissionPluginEnabled(configs = [], plugin) {
  return configs.some(
    c => c.subtype === 'assignsubmission' && c.plugin === plugin && c.name === 'enabled' && c.value === '1'
  );
}

/**
 * Detalle de una tarea para el estudiante: enunciado, fechas, tipos de entrega permitidos, su entrega actual y la calificación/retroalimentación si ya fue calificada.
 */
export async function getTaskDetail({ courseId, taskId, token }) {
  const [assignments, status] = await Promise.all([
    callMoodle(token, 'mod_assign_get_assignments', { courseids: [courseId] }),
    getSubmissionStatus(taskId, token),
  ]);

  const assignment = assignments.courses
    ?.flatMap(course => course.assignments ?? [])
    .find(a => a.id === taskId);
  if (!assignment) return null;

  const submission = status.lastattempt?.submission;
  const plugins = submission?.plugins ?? [];
  const onlineText = plugins.find(p => p.type === 'onlinetext')?.editorfields?.[0]?.text ?? '';
  const files = (plugins.find(p => p.type === 'file')?.fileareas?.[0]?.files ?? []).map(f => ({
    filename: f.filename,
    fileurl: f.fileurl,
    filesize: f.filesize,
    mimetype: f.mimetype,
  }));

  const feedback = status.feedback;
  const feedbackComments = feedback?.plugins?.find(p => p.type === 'comments')?.editorfields?.[0]?.text;

  return {
    id: assignment.id,
    cmid: assignment.cmid,
    courseId: assignment.course,
    name: assignment.name,
    intro: assignment.intro ?? '',
    duedate: assignment.duedate || null,
    cutoffdate: assignment.cutoffdate || null,
    allowSubmissionsFrom: assignment.allowsubmissionsfromdate || null,
    submissionTypes: {
      onlineText: isSubmissionPluginEnabled(assignment.configs, 'onlinetext'),
      file: isSubmissionPluginEnabled(assignment.configs, 'file'),
    },
    submission: {
      status: submission?.status ?? 'new', // new | draft | submitted
      gradingStatus: status.lastattempt?.gradingstatus ?? null, // graded | notgraded
      canEdit: status.lastattempt?.canedit ?? false,
      canSubmit: status.lastattempt?.cansubmit ?? false,
      lastModified: submission?.timemodified ?? null,
      onlineText,
      files,
    },
    feedback: feedback
      ? {
          grade: feedback.gradefordisplay?.replace(/&nbsp;/g, ' ') ?? null,
          gradedAt: feedback.gradeddate ?? null,
          comments: feedbackComments || null,
        }
      : null,
  };
}

export async function submitText({ taskId, text, token }) {
  return callMoodle(
    token,
    'mod_assign_save_submission',
    {
      assignmentid: taskId,
      plugindata: { onlinetext_editor: { text: `<p>${text}</p>`, format: 1, itemid: 0 } },
    },
    { method: 'POST' }
  );
}

/** Sube el archivo al borrador del estudiante, lo adjunta a la entrega y la envía a calificar. */
export async function submitFile({ taskId, filePath, fileName, token }) {
  const draftItemId = await uploadDraftFile({ filePath, fileName, token });
  const plugindata = { files_filemanager: draftItemId };
  const status = await getSubmissionStatus(taskId, token);
  const onlinetext = status.lastattempt?.submission?.plugins
    ?.find(p => p.type === 'onlinetext')
    ?.editorfields?.[0];
  if (onlinetext) {
    plugindata.onlinetext_editor = { text: onlinetext.text ?? '', format: onlinetext.format ?? 1, itemid: 0 };
  }

  await callMoodle(token, 'mod_assign_save_submission', { assignmentid: taskId, plugindata }, { method: 'POST' });
  await callMoodle(
    token,
    'mod_assign_submit_for_grading',
    { assignmentid: taskId, acceptsubmissionstatement: 1 },
    { method: 'POST' }
  );
}
