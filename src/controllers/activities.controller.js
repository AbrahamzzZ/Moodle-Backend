import {
  getActivitiesByCourse,
  getAssignments,
  getUserAssignments,
  getForums,
  getAllActivitiesByCourses
} from '../services/activities.service.js';

export async function getActivitiesByAllCourses(req, res) {
  try {
    let { courseIds } = req.query;

    if (!courseIds) {
      throw new Error('courseIds es requerido');
    }

    if (!Array.isArray(courseIds)) {
      courseIds = [courseIds];
    }

    courseIds = courseIds.map(Number);

    const activities = await getAllActivitiesByCourses(courseIds);
    
    res.json({ ok: true, activities });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getCourseActivities(req, res) {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        ok: false,
        message: 'courseId es requerido',
      });
    }

    const activities = await getActivitiesByCourse(Number(courseId));

    res.json({
      ok: true,
      activities,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function getAssignmentsByCourses(req, res) {
  try {
    let { courseIds } = req.query;

    if (!courseIds) {
      throw new Error('courseIds es requerido');
    }

    if (!Array.isArray(courseIds)) {
      courseIds = [courseIds];
    }

    courseIds = courseIds.map(Number);

    const assignments = await getAssignments(courseIds);
    res.json({ ok: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getUserAssignmentsByCourses(req, res) {
  try {
    const { userId } = req.params;
    let { courseIds } = req.query;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: 'userId es requerido',
      });
    }

    if (!courseIds) {
      throw new Error('courseIds es requerido');
    }

    if (!Array.isArray(courseIds)) {
      courseIds = [courseIds];
    }

    courseIds = courseIds.map(Number);

    const assignments = await getUserAssignments(Number(userId), courseIds);

    res.json({
      ok: true,
      assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function getForumsByCourses(req, res) {
  try {
    let { courseIds } = req.query;

    if (!courseIds) {
      throw new Error('courseIds es requerido');
    }

    if (!Array.isArray(courseIds)) {
      courseIds = [courseIds];
    }

    courseIds = courseIds.map(Number);

    const forums = await getForums(courseIds);
    res.json({ ok: true, forums });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, message: error.message });
  }
}
