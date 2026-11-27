import { toAppUser, signAppToken } from '../../lib/jwt.js';
import { forbidden, unauthorized } from '../../lib/errors.js';
import { toId } from '../../lib/validate.js';
import { findMoodleUserByEmail, getUserRoleInCourse, validateGoogleToken } from './auth.service.js';

/** POST /api/auth/login/google  (Authorization: Bearer <idToken de Google>) */
export async function loginWithGoogle(req, res) {
  const idToken = req.headers.authorization?.replace('Bearer ', '');
  if (!idToken) throw unauthorized('Token requerido');

  const googleUser = await validateGoogleToken(idToken);
  const moodleUser = await findMoodleUserByEmail(googleUser.email);
  if (!moodleUser) throw unauthorized('Usuario no existe en Moodle');

  const user = toAppUser(moodleUser);
  res.json({ ok: true, token: signAppToken(user), user });
}

/** GET /api/auth/role/:courseId */
export async function getRoleByCourse(req, res) {
  const courseId = toId(req.params.courseId, 'courseId');
  const role = await getUserRoleInCourse(req.user.id, courseId);
  if (!role) throw forbidden('Usuario no matriculado en el curso');
  res.json({ ok: true, role });
}
