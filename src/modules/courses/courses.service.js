import { callMoodle } from '../../moodle/client.js';
import { ADMIN_TOKEN } from '../../moodle/tokens.js';

/** Cursos en los que está matriculado el usuario. */
export async function getUserCourses(userId, token) {
  return callMoodle(token, 'core_enrol_get_users_courses', { userid: userId });
}

/** Nombre del primer docente del curso. */
export async function getCourseTeacher(courseId) {
  try {
    const users = await callMoodle(ADMIN_TOKEN, 'core_enrol_get_enrolled_users', { courseid: courseId });
    const teacher = users.find(u =>
      u.roles?.some(r => r.shortname === 'editingteacher' || r.shortname === 'teacher')
    );
    return teacher?.fullname ?? 'No disponible';
  } catch (error) {
    console.error(`Error obteniendo docente del curso ${courseId}:`, error.message);
    return 'No disponible';
  }
}

/** Secciones visibles del curso, cada una con sus módulos simplificados. */
export async function getCourseContent(courseId, token) {
  const sections = await callMoodle(token, 'core_course_get_contents', { courseid: courseId });

  return sections
    .filter(section => section.visible !== 0)
    .map(section => ({
      id: section.id,
      title: section.name,
      summary: section.summary,
      modules: section.modules.filter(m => m.visible !== 0).map(toModule),
    }));
}

function toModule(module) {
  const base = {
    id: module.id,
    instance: module.instance,
    name: module.name,
    type: module.modname,
    url: module.url || null,
  };

  switch (module.modname) {
    case 'resource':
      return module.contents?.length ? { ...base, hasFiles: true, fileCount: module.contents.length } : base;
    case 'url':
      return { ...base, externalUrl: module.contents?.[0]?.fileurl || module.url };
    case 'forum':
      return { ...base, activityType: 'forum' };
    case 'assign':
      return { ...base, activityType: 'assignment' };
    case 'label':
      return { ...base, description: module.description };
    default:
      return base;
  }
}
