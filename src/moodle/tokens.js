import { env } from '../config/env.js';
import prisma from '../lib/prisma.js';
import { callMoodle } from './client.js';

/**
 * Dos tipos de token de Moodle:
 *
 * - ADMIN_TOKEN: para lo que solo el admin puede hacer (buscar usuarios por email,
 *   editar perfiles, ver participantes) y para los jobs en segundo plano.
 *
 * - Token del usuario: para todo lo que el usuario hace o consulta. Moodle aplica sus
 *   permisos (solo sus cursos, sus notas) y las acciones quedan a su nombre.
 *   Se obtiene con el plugin local_moodleapp y se guarda en la tabla UserMoodleToken.
 */
export const ADMIN_TOKEN = env.moodle.adminToken;

export async function getUserMoodleToken(userId, { refresh = false } = {}) {
  if (!refresh) {
    const cached = await prisma.userMoodleToken.findUnique({ where: { userId } });
    if (cached) return cached.token;
  }

  const { token } = await callMoodle(
    ADMIN_TOKEN,
    'local_moodleapp_get_user_token',
    { userid: userId },
    { method: 'POST' }
  );

  await prisma.userMoodleToken.upsert({
    where: { userId },
    update: { token },
    create: { userId, token },
  });

  return token;
}

/**
 * Ejecuta fn(token) con el token del usuario. Si Moodle dice que el token ya no es
 * válido (p. ej. lo borraron en Moodle), pide uno nuevo y reintenta una vez.
 */
export async function withUserToken(userId, fn) {
  const token = await getUserMoodleToken(userId);
  try {
    return await fn(token);
  } catch (error) {
    if (!/invalidtoken/i.test(error.message)) throw error;
    return fn(await getUserMoodleToken(userId, { refresh: true }));
  }
}
