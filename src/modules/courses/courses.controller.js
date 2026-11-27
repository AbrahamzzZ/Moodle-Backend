import { toId } from '../../lib/validate.js';
import { withUserToken } from '../../moodle/tokens.js';
import { getCourseContent, getCourseTeacher, getUserCourses } from './courses.service.js';

/** GET /api/courses — cursos del usuario con su docente. */
export async function listCourses(req, res) {
  const courses = await withUserToken(req.user.id, token => getUserCourses(req.user.id, token));

  const result = await Promise.all(
    courses.map(async course => ({
      id: course.id,
      name: course.fullname,
      shortname: course.shortname,
      teacher: await getCourseTeacher(course.id),
    }))
  );

  res.json({ ok: true, courses: result });
}

/** GET /api/courses/:id — secciones y módulos del curso. */
export async function getCourseDetail(req, res) {
  const courseId = toId(req.params.id, 'id');
  const content = await withUserToken(req.user.id, token => getCourseContent(courseId, token));
  res.json({ ok: true, content });
}
