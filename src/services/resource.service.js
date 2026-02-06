import { callMoodleApi } from '../utils/moodleClient.js';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function fetchCourseContents(courseId) {
  return callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'core_course_get_contents',
    params: {
      courseid: courseId,
    },
  });
}
