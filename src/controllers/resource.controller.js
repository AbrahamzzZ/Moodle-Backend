import { fetchCourseContents } from "../services/resource.service.js";
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function getCourseResources(req, res) {
  try {
    const { courseId } = req.params;
    const { sectionId, mimetype } = req.query; 

    if (!courseId) {
      return res.status(400).json({
        ok: false,
        message: 'courseId es requerido',
      });
    }

    const contents = await fetchCourseContents(Number(courseId));

    const resources = [];

    contents.forEach(section => {
      if (sectionId && section.id !== Number(sectionId)) {
        return;
      }

      section.modules.forEach(module => {
        if (module.modname === 'resource' && module.contents) {
          module.contents.forEach(file => {
            if (mimetype && !file.mimetype.includes(mimetype)) {
              return;
            }

            resources.push({
              id: module.id,
              moduleId: module.id,
              instanceId: module.instance,
              name: file.filename,
              description: module.description || '',
              url: `${file.fileurl}?token=${MOODLE_TOKENS.admin}`,
              mimetype: file.mimetype,
              size: file.filesize,
              timemodified: file.timemodified,
              section: {
                id: section.id,
                name: section.name,
              },
            });
          });
        }
      });
    });

    res.json({ 
      ok: true, 
      courseId: Number(courseId),
      total: resources.length,
      resources 
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}
