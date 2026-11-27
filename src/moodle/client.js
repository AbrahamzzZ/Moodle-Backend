import axios from 'axios';
import qs from 'qs';
import { env } from '../config/env.js';
import { MoodleError } from '../lib/errors.js';

/**
 * Llama a una función de la API REST de Moodle.
 *
 *   callMoodle(token, 'core_course_get_contents', { courseid: 2 })
 *   callMoodle(token, 'mod_forum_add_discussion_post', { ... }, { method: 'POST' })
 *
 * Los arrays y objetos anidados se codifican como espera Moodle: courseids[0]=1, plugindata[x][y]=...
 * Si Moodle responde con una excepción, lanza MoodleError (con su código HTTP).
 */
export async function callMoodle(token, wsfunction, params = {}, { method = 'GET' } = {}) {
  if (!token) throw new Error('Token de Moodle no proporcionado');

  const payload = { wstoken: token, wsfunction, moodlewsrestformat: 'json', ...params };

  const response =
    method === 'POST'
      ? await axios.post(env.moodle.url, qs.stringify(payload), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      : await axios.get(env.moodle.url, {
          params: payload,
          paramsSerializer: p => qs.stringify(p),
        });

  if (response.data?.exception) {
    throw new MoodleError(response.data);
  }

  return response.data;
}
