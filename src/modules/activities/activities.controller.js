import { toId, toIdList } from '../../lib/validate.js';
import { withUserToken } from '../../moodle/tokens.js';
import {
  getActivitiesForCourses,
  getAssignments,
  getCourseActivities,
  getForums,
} from './activities.service.js';

/** GET /api/activities?courseIds=1&courseIds=2 */
export async function listActivities(req, res) {
  const courseIds = toIdList(req.query.courseIds, 'courseIds');
  const activities = await withUserToken(req.user.id, token => getActivitiesForCourses(courseIds, token));
  res.json({ ok: true, activities });
}

/** GET /api/activities/course/:courseId */
export async function listCourseActivities(req, res) {
  const courseId = toId(req.params.courseId, 'courseId');
  const activities = await withUserToken(req.user.id, token => getCourseActivities(courseId, token));
  res.json({ ok: true, activities });
}

/** GET /api/activities/assignments?courseIds=... */
export async function listAssignments(req, res) {
  const courseIds = toIdList(req.query.courseIds, 'courseIds');
  const assignments = await withUserToken(req.user.id, token => getAssignments(courseIds, token));
  res.json({ ok: true, assignments });
}

/** GET /api/activities/forums?courseIds=... */
export async function listForums(req, res) {
  const courseIds = toIdList(req.query.courseIds, 'courseIds');
  const forums = await withUserToken(req.user.id, token => getForums(courseIds, token));
  res.json({ ok: true, forums });
}
