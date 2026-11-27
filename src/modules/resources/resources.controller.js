import { AppError, badRequest } from '../../lib/errors.js';
import { toId } from '../../lib/validate.js';
import { streamMoodleFile, toMoodleFileUrl } from '../../moodle/files.js';
import { withUserToken } from '../../moodle/tokens.js';
import { getCourseResources } from './resources.service.js';

/** GET /api/courses/:courseId/resources?sectionId=&mimetype= */
export async function listCourseResources(req, res) {
  const courseId = toId(req.params.courseId, 'courseId');
  const filters = {
    sectionId: req.query.sectionId ? toId(req.query.sectionId, 'sectionId') : undefined,
    mimetype: req.query.mimetype || undefined,
  };

  const resources = await withUserToken(req.user.id, token => getCourseResources(courseId, token, filters));
  res.json({ ok: true, courseId, total: resources.length, resources });
}

/**
 * GET /api/files/download?fileUrl=...
 * Proxy de descarga: solo archivos del propio Moodle, descargados con el token del usuario
 * (Moodle solo entrega archivos de sus cursos).
 */
export async function downloadFile(req, res) {
  if (!req.query.fileUrl) throw badRequest('fileUrl es requerido');

  const url = toMoodleFileUrl(String(req.query.fileUrl));
  if (!url) throw badRequest('URL de archivo no permitida');

  let response;
  try {
    response = await withUserToken(req.user.id, token => streamMoodleFile(url, token));
  } catch (error) {
    throw new AppError(error.response?.status === 404 ? 404 : 400, 'Error al descargar archivo');
  }

  res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
  res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment');
  if (response.headers['content-length']) res.setHeader('Content-Length', response.headers['content-length']);

  response.data.pipe(res);
}
