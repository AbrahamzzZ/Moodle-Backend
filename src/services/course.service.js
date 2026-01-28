import axios from "axios";

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

  return data.map(section => ({
    id: section.id,
    title: section.name,
    summary: section.summary,
    modules: section.modules.map(m => ({
      id: m.id,
      name: m.name,
      type: m.modname, 
      url: m.url,
      visible: m.visible
    }))
  }));
}
