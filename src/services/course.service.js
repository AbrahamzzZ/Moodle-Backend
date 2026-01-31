import { callMoodleApi } from '../utils/moodleClient.js';

const MOODLE = process.env.MOODLE_URL;
const TOKEN = process.env.MOODLE_TOKEN;

export async function getUserCourses(userId) {
  const params = {
    wstoken: TOKEN,
    wsfunction: "core_enrol_get_users_courses",
    moodlewsrestformat: "json",
    userid: userId,
  };

  const response = await axios.get(MOODLE, { params });
  return response.data;
}


export async function getCourseTeacher(courseId) {
  try {
    const params = {
      wstoken: TOKEN,
      wsfunction: "core_enrol_get_enrolled_users",
      moodlewsrestformat: "json",
      courseid: courseId,
    };

    const response = await axios.get(MOODLE, { params });
    
    const teacher = response.data.find(user => {
      if (user.roles && user.roles.length > 0) {
        return user.roles.some(role => 
          role.shortname === "editingteacher" || 
          role.shortname === "teacher"
        );
      }
      return false;
    });

    return teacher ? teacher.fullname : "No disponible";
  } catch (error) {
    console.error(`Error obteniendo profesor del curso ${courseId}:`, error.message);
    return "No disponible";
  }
}  


export async function getCourseDetail(courseId) {
  const params = {
    wstoken: TOKEN,
    wsfunction: "core_course_get_contents",
    moodlewsrestformat: "json",
    courseid: courseId,
  };

  const response = await axios.get(MOODLE, { params });
  return response.data;
}


export async function getMappedCourseDetail(courseId) {
  const params = {
    wstoken: TOKEN,
    wsfunction: "core_course_get_contents",
    moodlewsrestformat: "json",
    courseid: courseId,
  };

  const { data } = await axios.get(MOODLE, { params });

  return data
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
            name: module.name,
            type: module.modname, 
            url: module.url || null
          };

          if (module.modname === "resource" && module.contents?.length) {
            return {
              ...base,
              files: module.contents.map(file => ({
                filename: file.filename,
                mimetype: file.mimetype,
                filesize: file.filesize,
                downloadUrl: `${file.fileurl}?token=${TOKEN}`
              }))
            };
          }

          if (module.modname === "url") {
            return {
              ...base,
              externalUrl: module.contents?.[0]?.fileurl || module.url
            };
          }

          if (module.modname === "forum") {
            return {
              ...base,
              activityType: "forum"
            };
          }

          if (module.modname === "assign") {
            return {
              ...base,
              activityType: "assignment"
            };
          }

          if (module.modname === "label") {
            return {
              ...base,
              description: module.description
            };
          }

          return base;
        })
    }));
}

