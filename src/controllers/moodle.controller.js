import { getUserCourses } from "../services/moodle.service.js";

export async function listCourses(req, res) {
  try {
    console.log("📥 Request recibida");
    console.log("📍 Params:", req.params);

    const { userId } = req.params;
    const courses = await getUserCourses(Number.parseInt(userId));
    //const courses = await getUserCourses(userId);
http://localhost/moodle/server/moodle/user/view.php?id=3&course=2
    console.log("📚 Cursos obtenidos:", courses);

    res.json(courses);
  } catch (error) {
    console.error("❌ Error en listCourses");

    if (error.response) {
      console.error("🔴 Moodle status:", error.response.status);
      console.error("🔴 Moodle data:", error.response.data);
    } else {
      console.error("🔴 Error:", error.message);
    }

    res.status(500).json({ error: error.message });
  }
}
