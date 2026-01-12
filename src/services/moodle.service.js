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
