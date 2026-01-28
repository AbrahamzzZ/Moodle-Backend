import { getUserCourses, getCourseTeacher, getMappedCourseDetail } from "../services/course.service.js";

export async function listCourses(req, res) {
  try {
    const userId = req.user.id;
    const courses = await getUserCourses(Number(userId));

    const formattedCourses = await Promise.all(
      courses.map(async (course) => {
        const teacher = await getCourseTeacher(course.id);

        return {
          id: course.id,
          name: course.fullname,
          shortname: course.shortname,
          teacher,
        };
      })
    );

    res.json(formattedCourses);
  } catch (err) {
    console.error("Error en listCourses:", err);
    res.status(500).json({
      ok: false,
      message: "Error al obtener cursos",
    });
  }
}

export async function getCourseDetailController(req, res) {
  try {
    const { id } = req.params;
    const content = await getMappedCourseDetail(Number(id));
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener contenido del curso",
    });
  }
}
