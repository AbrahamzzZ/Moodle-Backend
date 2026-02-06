import { callMoodleApi } from '../utils/moodleClient.js';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function getActivitiesByCourse(courseId) {
  const sections = await callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'core_course_get_contents',
    params: {
      courseid: courseId,
    },
  });

  const activities = [];

  sections.forEach(section => {
    section.modules
      .filter(module => module.visible !== 0)
      .forEach(module => {

        const activityTypes = ['assign', 'forum'];
        
        if (activityTypes.includes(module.modname)) {
          activities.push({
            id: module.id,
            courseId: courseId,
            activityId: module.instance,
            name: module.name,
            type: module.modname,
            sectionId: section.id,
            sectionName: section.name,
            description: module.description || null,
            url: module.url || null,
            dates: module.dates || [],
            completiondata: module.completiondata || null,
          });
        }
      });
  });

  return activities;
}

export async function getAssignments(courseIds = []) {
  const assignments = await callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'mod_assign_get_assignments',
    params: { courseids: courseIds },
  });

  return assignments.courses?.flatMap(course =>
    course.assignments?.map(assignment => ({
      id: assignment.id,
      courseId: course.id,
      activityId: assignment.id,
      name: assignment.name,
      type: 'assign',
      intro: assignment.intro,
      duedate: assignment.duedate,
      cutoffdate: assignment.cutoffdate,
      allowsubmissionsfromdate: assignment.allowsubmissionsfromdate,
      timemodified: assignment.timemodified,
      grade: assignment.grade,
      submissiondrafts: assignment.submissiondrafts,
      requiresubmissionstatement: assignment.requiresubmissionstatement,
    })) || []
  ) || [];
}

export async function getUserAssignments(userId, courseIds = []) {
  try {
    const submissions = await callMoodleApi({
      token: MOODLE_TOKENS.admin,
      wsfunction: 'mod_assign_get_user_assignments',
      params: { 
        userid: userId,
        courseids: courseIds 
      },
    });

    return submissions.courses?.flatMap(course =>
      course.assignments?.map(assignment => ({
        id: assignment.id,
        courseId: course.id,
        activityId: assignment.id,
        name: assignment.name,
        type: 'assign',
        duedate: assignment.duedate,
        cutoffdate: assignment.cutoffdate,
        allowsubmissionsfromdate: assignment.allowsubmissionsfromdate,
        submission: assignment.submission || null,
        grade: assignment.grade || null,
      })) || []
    ) || [];
  } catch (error) {
    console.error('Error fetching user assignments:', error.message);
    return [];
  }
}

export async function getForums(courseIds = []) {
  const forums = await callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'mod_forum_get_forums_by_courses',
    params: { courseids: courseIds },
  });

  return forums?.map(forum => ({
    id: forum.id,
    courseId: forum.course,
    activityId: forum.id,
    name: forum.name,
    type: 'forum',
    intro: forum.intro,
    timemodified: forum.timemodified,
    duedate: forum.duedate || null,
  })) || [];
}

export async function getAllActivitiesByCourses(courseIds = []) {
  const allActivities = [];

  for (const courseId of courseIds) {
    const activities = await getActivitiesByCourse(courseId);
    allActivities.push(...activities);
  }

  const assignments = await getAssignments(courseIds);
  
  const forums = await getForums(courseIds);
  
  allActivities.forEach(activity => {
    if (activity.type === 'assign') {
      const assignmentDetail = assignments.find(a => a.id === activity.activityId);
      if (assignmentDetail) {
        activity.duedate = assignmentDetail.duedate;
        activity.cutoffdate = assignmentDetail.cutoffdate;
        activity.allowsubmissionsfromdate = assignmentDetail.allowsubmissionsfromdate;
        activity.grade = assignmentDetail.grade;
        activity.intro = assignmentDetail.intro;
      }
    } else if (activity.type === 'forum') {
      const forumDetail = forums.find(f => f.id === activity.activityId);
      if (forumDetail) {
        activity.intro = forumDetail.intro;
        activity.timemodified = forumDetail.timemodified;
      }
    }
  });


  return allActivities;
}
