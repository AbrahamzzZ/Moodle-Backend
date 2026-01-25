import { callMoodleApi } from '../utils/moodleClient.js';

export async function getUserCourses(userId) {
  return callMoodleApi('core_enrol_get_users_courses', {
    userid: userId,
  });
}