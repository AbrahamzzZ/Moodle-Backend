import { getUserCourses } from "../services/moodle.service.js";

export async function listCourses(req, res) {
  try {
    const { userId } = req.params;
    const courses = await getUserCourses(Number.parseInt(userId));
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
