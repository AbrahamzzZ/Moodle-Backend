import { badRequest, notFound } from '../../lib/errors.js';
import { callMoodle } from '../../moodle/client.js';
import { uploadDraftFile } from '../../moodle/files.js';
import { ADMIN_TOKEN, withUserToken } from '../../moodle/tokens.js';

/**
 * Campos que el usuario puede editar de su propio perfil, con su longitud máxima en Moodle.
 */
const EDITABLE_FIELDS = {
  firstname: { max: 100, required: true },
  lastname: { max: 100, required: true },
  phone1: { max: 20 },
  phone2: { max: 20 },
  address: { max: 255 },
  city: { max: 120 },
  country: { max: 2 },
  description: { max: 5000 },
};

async function getMoodleUser(userId) {
  const users = await callMoodle(ADMIN_TOKEN, 'core_user_get_users_by_field', {
    field: 'id',
    'values[0]': userId,
  });
  if (!users?.[0]) throw notFound('Usuario no encontrado en Moodle');
  return users[0];
}

/** Perfil tal como lo consume la app. */
function toProfile(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    fullname: user.fullname ?? `${user.firstname} ${user.lastname}`,
    email: user.email,
    phone1: user.phone1 ?? '',
    phone2: user.phone2 ?? '',
    address: user.address ?? '',
    city: user.city ?? '',
    country: user.country ?? '',
    description: user.description ?? '',
    profileImageUrl: user.profileimageurl ?? null,
    profileImageUrlSmall: user.profileimageurlsmall ?? null,
  };
}

/** Devuelve el perfil y el usuario de Moodle (este último para firmar un JWT nuevo). */
export async function getProfile(userId) {
  const user = await getMoodleUser(userId);
  return { profile: toProfile(user), moodleUser: user };
}

/** Valida y limpia los datos recibidos. Ignora cualquier campo fuera de la lista. */
function sanitizeChanges(body = {}) {
  const changes = {};

  for (const [field, rules] of Object.entries(EDITABLE_FIELDS)) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'string') throw badRequest(`El campo ${field} debe ser texto`);

    const value = body[field].trim();
    if (rules.required && !value) throw badRequest(`El campo ${field} no puede estar vacío`);
    if (value.length > rules.max) throw badRequest(`El campo ${field} admite máximo ${rules.max} caracteres`);

    changes[field] = value;
  }

  if (changes.country !== undefined) {
    changes.country = changes.country.toUpperCase();
    if (changes.country && !/^[A-Z]{2}$/.test(changes.country)) {
      throw badRequest('El país debe ser un código de 2 letras (ej. EC)');
    }
  }

  if (!Object.keys(changes).length) throw badRequest('No se envió ningún campo para actualizar');
  return changes;
}

/**
 * Actualiza el perfil del propio usuario.
 */
export async function updateProfile(userId, body) {
  const changes = sanitizeChanges(body);

  const user = { id: userId, ...changes };
  if (changes.description !== undefined) user.descriptionformat = 2;

  const result = await callMoodle(ADMIN_TOKEN, 'core_user_update_users', { users: [user] }, { method: 'POST' });
  if (result?.warnings?.length) throw badRequest(result.warnings.map(w => w.message).join('; '));

  return getProfile(userId);
}

/** Cambia la foto de perfil (con el token del propio usuario). */
export async function updateProfilePicture(userId, { filePath, fileName }) {
  await withUserToken(userId, async token => {
    const draftItemId = await uploadDraftFile({ filePath, fileName, token });
    const result = await callMoodle(token, 'core_user_update_picture', { draftitemid: draftItemId }, { method: 'POST' });
    if (!result?.success) throw new Error('Moodle no pudo actualizar la foto de perfil');
  });
  return getProfile(userId);
}

export async function deleteProfilePicture(userId) {
  await withUserToken(userId, token =>
    callMoodle(token, 'core_user_update_picture', { draftitemid: 0, delete: 1 }, { method: 'POST' })
  );
  return getProfile(userId);
}
