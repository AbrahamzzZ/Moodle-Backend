import { notFound } from '../../lib/errors.js';
import { toId } from '../../lib/validate.js';
import { withUserToken } from '../../moodle/tokens.js';
import { getCourseGradeDetail, getCoursesGrades } from './grades.service.js';

/** GET /api/grades */
export async function listMyGrades(req, res) {
  const courses = await withUserToken(req.user.id, token => getCoursesGrades(req.user.id, token));
  res.json({ ok: true, courses });
}

/**
 * GET /api/grades/courses/:courseId
 * Curso inexistente → 404, no matriculado → 403 (los traduce MoodleError).
 */
export async function getMyCourseGrades(req, res) {
  const courseId = toId(req.params.courseId, 'courseId');
  const detail = await withUserToken(req.user.id, token => getCourseGradeDetail(req.user.id, courseId, token));
  if (!detail) throw notFound('No hay calificaciones para este curso');
  res.json({ ok: true, ...detail });
}
