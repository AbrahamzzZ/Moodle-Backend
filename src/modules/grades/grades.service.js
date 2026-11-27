import { callMoodle } from '../../moodle/client.js';

/** Moodle devuelve "-" cuando no hay nota. */
const cleanFormatted = value => (value && value !== '-' ? value : null);

/** Nota final de cada curso en el que está matriculado. */
export async function getCoursesGrades(userId, token) {
  const [overview, courses] = await Promise.all([
    callMoodle(token, 'gradereport_overview_get_course_grades'),
    callMoodle(token, 'core_enrol_get_users_courses', { userid: userId }),
  ]);

  const gradesByCourse = new Map(overview.grades.map(g => [g.courseid, g]));

  return courses.map(course => {
    const grade = gradesByCourse.get(course.id);
    return {
      courseId: course.id,
      courseName: course.fullname,
      shortname: course.shortname,
      grade: cleanFormatted(grade?.grade),
      rawGrade: grade?.rawgrade != null ? Number(grade.rawgrade) : null,
    };
  });
}

function toGradeItem(item) {
  return {
    id: item.id,
    name: item.itemname,
    type: item.itemtype,
    module: item.itemmodule,
    cmid: item.cmid ?? null,
    grade: cleanFormatted(item.gradeformatted),
    rawGrade: item.graderaw ?? null,
    gradeMin: item.grademin ?? null,
    gradeMax: item.grademax ?? null,
    percentage: cleanFormatted(item.percentageformatted),
    weight: cleanFormatted(item.weightformatted),
    feedback: item.feedback || null,
    gradedAt: item.gradedategraded ?? null,
    submittedAt: item.gradedatesubmitted ?? null,
  };
}

/** Notas de un curso: cada actividad calificable y el total. */
export async function getCourseGradeDetail(userId, courseId, token) {
  const { usergrades = [] } = await callMoodle(token, 'gradereport_user_get_grade_items', {
    courseid: courseId,
    userid: userId,
  });

  const userGrades = usergrades[0];
  if (!userGrades) return null;

  const items = userGrades.gradeitems.filter(item => !item.gradeishidden).map(toGradeItem);

  return {
    courseId: userGrades.courseid,
    items: items.filter(item => item.type !== 'course'),
    total: items.find(item => item.type === 'course') ?? null,
  };
}
