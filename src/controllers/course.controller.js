import {
  getUserCourses,
  getCourseTeacher,
  getMappedCourseDetail,
} from '../services/course.service.js';

export async function listCourses(req, res) {
  try {
    const userId = Number(req.user.id); 
    const courses = await getUserCourses(userId);

    const formattedCourses = await Promise.all(
      courses.map(async course => {
        const teacher = await getCourseTeacher(course.id);
        const sections = await getMappedCourseDetail(course.id);

        return {
          id: course.id,
          name: course.fullname,
          shortname: course.shortname,
          teacher,
          sections,
        };
      })
    );

    res.json({
      ok: true,
      courses: formattedCourses,
    });
  } catch (error) {
    console.error('Error listCourses:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener cursos',
    });
  }
}

export async function getCourseDetailController(req, res) {
  try {
    const { id } = req.params;

    const content = await getMappedCourseDetail(Number(id));

    res.json({
      ok: true,
      content,
    });
  } catch (error) {
    console.error('Error getCourseDetailController:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener contenido del curso',
    });
  }
}
