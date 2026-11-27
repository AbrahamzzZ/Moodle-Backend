import { callMoodle } from '../../moodle/client.js';

/**
 * Recursos de un curso, agrupados por módulo con sus archivos.
 */
export async function getCourseResources(courseId, token, { sectionId, mimetype } = {}) {
  const sections = await callMoodle(token, 'core_course_get_contents', { courseid: courseId });
  const resources = [];

  for (const section of sections) {
    if (sectionId && section.id !== sectionId) continue;

    for (const module of section.modules) {
      if (module.modname !== 'resource' || !module.contents?.length) continue;

      const files = module.contents
        .filter(file => !mimetype || file.mimetype?.includes(mimetype))
        .map(file => ({
          filename: file.filename,
          fileurl: file.fileurl,
          mimetype: file.mimetype,
          filesize: file.filesize,
          timemodified: file.timemodified,
        }));

      if (!files.length) continue;

      resources.push({
        id: module.id,
        instanceId: module.instance,
        name: module.name,
        description: module.description || '',
        section: { id: section.id, name: section.name },
        files,
      });
    }
  }

  return resources;
}
