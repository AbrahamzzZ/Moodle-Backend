import fs from 'fs/promises';
import { badRequest } from '../../lib/errors.js';
import { signAppToken, toAppUser } from '../../lib/jwt.js';
import { deleteProfilePicture, getProfile, updateProfile, updateProfilePicture } from './profile.service.js';

/**
 * Todas las respuestas incluyen un JWT nuevo, porque el JWT lleva nombre, teléfono, etc.
 * La app debe reemplazar el token guardado por este.
 */
function sendProfile(res, { profile, moodleUser }) {
  res.json({ ok: true, profile, token: signAppToken(toAppUser(moodleUser)) });
}

/** GET /api/profile */
export async function getMyProfile(req, res) {
  sendProfile(res, await getProfile(req.user.id));
}

/** PUT /api/profile */
export async function updateMyProfile(req, res) {
  sendProfile(res, await updateProfile(req.user.id, req.body));
}

/** PUT /api/profile/picture  (multipart, campo "picture") */
export async function updateMyPicture(req, res) {
  const file = req.file;
  try {
    if (!file) throw badRequest('Debe enviar una imagen en el campo "picture"');
    sendProfile(res, await updateProfilePicture(req.user.id, { filePath: file.path, fileName: file.originalname }));
  } finally {
    if (file?.path) await fs.unlink(file.path).catch(() => {});
  }
}

/** DELETE /api/profile/picture */
export async function deleteMyPicture(req, res) {
  sendProfile(res, await deleteProfilePicture(req.user.id));
}
