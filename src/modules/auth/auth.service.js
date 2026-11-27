import axios from 'axios';
import { callMoodle } from '../../moodle/client.js';
import { ADMIN_TOKEN } from '../../moodle/tokens.js';
import { unauthorized } from '../../lib/errors.js';

/** Valida el idToken con Google y devuelve sus datos personales. */
export async function validateGoogleToken(idToken) {
  try {
    const { data } = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
      params: { id_token: idToken },
    });
    return data;
  } catch {
    throw unauthorized('Token de Google inválido o expirado');
  }
}

/** El usuario de Moodle se identifica por el email de su cuenta de Google. */
export async function findMoodleUserByEmail(email) {
  const users = await callMoodle(ADMIN_TOKEN, 'core_user_get_users_by_field', {
    field: 'email',
    'values[0]': email,
  });
  return users?.[0] ?? null;
}

/** Rol del usuario en un curso: 'estudiante', 'docente', 'otro' o null si no está matriculado. */
export async function getUserRoleInCourse(userId, courseId) {
  const enrolled = await callMoodle(ADMIN_TOKEN, 'core_enrol_get_enrolled_users', {
    courseid: courseId,
  });

  const roles = enrolled.find(u => u.id === userId)?.roles ?? [];
  if (!roles.length) return null;

  const shortname = roles[0].shortname;
  if (shortname === 'student') return 'estudiante';
  if (shortname === 'teacher' || shortname === 'editingteacher') return 'docente';
  return 'otro';
}
