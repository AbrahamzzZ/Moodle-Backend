import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/** Datos del usuario de Moodle que la app usa (y que viajan en el JWT). */
export function toAppUser(moodleUser) {
  return {
    id: moodleUser.id,
    fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
    email: moodleUser.email,
    address: moodleUser.address ?? null,
    city: moodleUser.city ?? null,
    phone: moodleUser.phone1 ?? null,
    country: moodleUser.country ?? null,
    description: moodleUser.description ?? null,
  };
}

export function signAppToken(appUser) {
  return jwt.sign(appUser, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

export function verifyAppToken(token) {
  return jwt.verify(token, env.jwt.secret);
}
