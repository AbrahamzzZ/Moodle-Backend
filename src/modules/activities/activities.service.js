import { callMoodle } from '../../moodle/client.js';

const ACTIVITY_TYPES = ['assign', 'forum'];

/** Tareas y foros visibles de un curso (desde su contenido). */
export async function getCourseActivities(courseId, token) {
  const sections = await callMoodle(token, 'core_course_get_contents', { courseid: courseId });

  return sections.flatMap(section =>
    section.modules
      .filter(m => m.visible !== 0 && ACTIVITY_TYPES.includes(m.modname))
      .map(m => ({
        id: m.id, 
        courseId,
        activityId: m.instance,
        name: m.name,
        type: m.modname,
        sectionId: section.id,
        sectionName: section.name,
        description: m.description || null,
        url: m.url || null,
        dates: m.dates || [],
        completiondata: m.completiondata || null,
      }))
  );
}

export async function getAssignments(courseIds, token) {
  const { courses = [] } = await callMoodle(token, 'mod_assign_get_assignments', { courseids: courseIds });

  return courses.flatMap(course =>
    (course.assignments ?? []).map(a => ({
      id: a.id,
      courseId: course.id,
      activityId: a.id,
      name: a.name,
      type: 'assign',
      intro: a.intro,
      duedate: a.duedate,
      cutoffdate: a.cutoffdate,
      allowsubmissionsfromdate: a.allowsubmissionsfromdate,
      timemodified: a.timemodified,
      grade: a.grade,
      submissiondrafts: a.submissiondrafts,
      requiresubmissionstatement: a.requiresubmissionstatement,
    }))
  );
}

export async function getForums(courseIds, token) {
  const forums = await callMoodle(token, 'mod_forum_get_forums_by_courses', { courseids: courseIds });

  return (forums ?? []).map(f => ({
    id: f.id,
    courseId: f.course,
    activityId: f.id,
    name: f.name,
    type: 'forum',
    intro: f.intro,
    timemodified: f.timemodified,
    duedate: f.duedate || null,
  }));
}

/** Actividades de varios cursos, completadas con fechas y descripción de cada tarea/foro. */
export async function getActivitiesForCourses(courseIds, token) {
  const [perCourse, assignments, forums] = await Promise.all([
    Promise.all(courseIds.map(id => getCourseActivities(id, token))),
    getAssignments(courseIds, token),
    getForums(courseIds, token),
  ]);

  const assignmentsById = new Map(assignments.map(a => [a.id, a]));
  const forumsById = new Map(forums.map(f => [f.id, f]));

  return perCourse.flat().map(activity => {
    if (activity.type === 'assign') {
      const detail = assignmentsById.get(activity.activityId);
      return detail
        ? {
            ...activity,
            duedate: detail.duedate,
            cutoffdate: detail.cutoffdate,
            allowsubmissionsfromdate: detail.allowsubmissionsfromdate,
            grade: detail.grade,
            intro: detail.intro,
          }
        : activity;
    }

    const detail = forumsById.get(activity.activityId);
    return detail
      ? { ...activity, intro: detail.intro, timemodified: detail.timemodified, duedate: detail.duedate }
      : activity;
  });
}
