import { callMoodleApi } from '../utils/moodleClient.js';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function getUserCourses(userId) {
  return callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'core_enrol_get_users_courses',
    params: {
      userid: userId,
    },
  });
}

export async function getCourseTeacher(courseId) {
  try {
    const users = await callMoodleApi({
      token: MOODLE_TOKENS.admin,
      wsfunction: 'core_enrol_get_enrolled_users',
      params: {
        courseid: courseId,
      },
    });

    const teacher = users.find(user =>
      user.roles?.some(
        role =>
          role.shortname === 'editingteacher' ||
          role.shortname === 'teacher'
      )
    );

    return teacher ? teacher.fullname : 'No disponible';
  } catch (error) {
    console.error(`Error obteniendo profesor del curso ${courseId}:`, error.message);
    return 'No disponible';
  }
}

export async function getMappedCourseDetail(courseId) {
  const sections = await callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'core_course_get_contents',
    params: {
      courseid: courseId,
    },
  });

  return sections
    .filter(section => section.visible !== 0)
    .map(section => ({
      id: section.id,
      title: section.name,
      summary: section.summary,
      modules: section.modules
        .filter(module => module.visible !== 0)
        .map(module => {
          const base = {
            id: module.id,
            instance: module.instance,
            name: module.name,
            type: module.modname,
            url: module.url || null,
          };

          if (module.modname === 'resource' && module.contents?.length) {
            return {
              ...base,
              hasFiles: true,
              fileCount: module.contents.length,
            };
          }

          if (module.modname === 'url') {
            return {
              ...base,
              externalUrl:
                module.contents?.[0]?.fileurl || module.url,
            };
          }

          if (module.modname === 'forum') {
            return {
              ...base,
              activityType: 'forum',
            };
          }

          if (module.modname === 'assign') {
            return {
              ...base,
              activityType: 'assignment',
            };
          }

          if (module.modname === 'label') {
            return {
              ...base,
              description: module.description,
            };
          }

          return base;
        }),
    }));
}

