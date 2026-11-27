import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { env } from '../config/env.js';

const MOODLE_ORIGIN = new URL(env.moodle.url).origin;
const UPLOAD_URL = env.moodle.url.replace('/webservice/rest/server.php', '/webservice/upload.php');

/**
 * Sube un archivo al área "borrador" (draft) del dueño del token y devuelve el itemid,
 * que luego se pasa a la función que lo usa (entrega de tarea, foto de perfil...).
 */
export async function uploadDraftFile({ filePath, fileName, token }) {
  const form = new FormData();
  form.append('token', token);
  form.append('filearea', 'draft');
  form.append('itemid', 0);
  form.append('filepath', '/');
  form.append('filename', fileName);
  form.append('file', fs.createReadStream(filePath));

  const response = await axios.post(UPLOAD_URL, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  const itemid = response.data?.[0]?.itemid;
  if (!itemid) {
    throw new Error('Error al subir archivo a Moodle: ' + JSON.stringify(response.data));
  }
  return itemid;
}

/**
 * Valida que una URL sea un archivo del propio Moodle y la normaliza a
 * /webservice/pluginfile.php (la que acepta token). Devuelve null si no es válida.
 * Evita que el proxy de descargas se use para pedir URLs arbitrarias (SSRF).
 */
export function toMoodleFileUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.origin !== MOODLE_ORIGIN) return null;
  if (url.pathname.includes('/webservice/pluginfile.php/')) return url;
  if (url.pathname.includes('/pluginfile.php/')) {
    url.pathname = url.pathname.replace('/pluginfile.php/', '/webservice/pluginfile.php/');
    return url;
  }
  return null;
}

/** Descarga un archivo de Moodle como stream (para reenviarlo al cliente). */
export async function streamMoodleFile(url, token) {
  const withToken = new URL(url);
  withToken.searchParams.set('token', token);
  return axios.get(withToken.toString(), { responseType: 'stream' });
}
