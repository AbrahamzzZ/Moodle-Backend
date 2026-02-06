import axios from 'axios';
import { callMoodleApi } from '../utils/moodleClient.js';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

const MOODLE_URL = process.env.MOODLE_URL;

export async function validateGoogleToken(idToken) {
  const { data } = await axios.get(
    'https://oauth2.googleapis.com/tokeninfo',
    { params: { id_token: idToken } }
  );

  return data;
}

export async function getMoodleUserByEmail(email) {
  const users = await callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'core_user_get_users_by_field',
    params: {
      field: 'email',
      'values[0]': email,
    },
  });

  return users?.[0] ?? null;
}

export async function getUserRoleByCourse({ userId, courseId }) {
  const enrolledUsers = await callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'core_enrol_get_enrolled_users',
    params: {
      courseid: Number(courseId),
    },
  });

  const user = enrolledUsers.find(u => u.id === userId);

  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  const roleShortName = user.roles[0].shortname;

  if (roleShortName === 'student') return 'estudiante';
  if (roleShortName === 'teacher' || roleShortName === 'editingteacher') {
    return 'docente';
  }

  return 'otro';
}