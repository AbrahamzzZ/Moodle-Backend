import axios from "axios";

const MOODLE_URL = "http://localhost/moodle/server/moodle/webservice/rest/server.php";
const TOKEN = process.env.MOODLE_TOKEN;

export async function getUserCourses(userId) {
  console.log("➡️ Llamando a Moodle REST");
  console.log("🔑 Token:", TOKEN);
  console.log("👤 UserID:", userId);
  console.log("🌐 URL:", MOODLE_URL);

  const params = {
    wstoken: TOKEN,
    wsfunction: "core_enrol_get_users_courses",
    moodlewsrestformat: "json",
    userid: userId,
  };

  console.log("📦 Params enviados:", params);

  //const response = await axios.post(MOODLE_URL, null, { params });
  const response = await axios.get(MOODLE_URL, { params });

  console.log("✅ Respuesta Moodle:", response.data);

  return response.data;
}
