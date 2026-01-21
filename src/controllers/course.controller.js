import { getUserCourses } from "../services/course.service.js";

export async function listCourses(req, res) {
  try {
    const userId = req.user.id;

    const courses = await getUserCourses(Number(userId));

    const formattedCourses = courses.map(course => ({
      id: course.id,
      name: course.fullname,
      shortname: course.shortname,
      teacher: "No disponible", 
    }));

    res.json(formattedCourses);
  } catch (err) {
    console.error("Error en listCourses:", err);
    res.status(500).json({
      ok: false,
      message: "Error al obtener cursos",
    });
  }
}