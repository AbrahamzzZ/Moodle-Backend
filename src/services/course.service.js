import { callMoodleApi } from '../utils/moodleClient.js';

export async function getUserCourses({ userId }) {
  return callMoodleApi({
    wsfunction: 'core_enrol_get_users_courses',
    params: {
      userid: userId,
    },
  });
}