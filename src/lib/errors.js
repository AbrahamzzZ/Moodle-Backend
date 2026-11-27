/**
 * Error con código HTTP. Cualquier capa puede lanzarlo; el middleware errorHandler
 * lo convierte en la respuesta { ok: false, message }.
 */
export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

export const badRequest = message => new AppError(400, message);
export const unauthorized = message => new AppError(401, message);
export const forbidden = message => new AppError(403, message);
export const notFound = message => new AppError(404, message);

/** Error devuelto por la API de Moodle ({ exception, errorcode, message }). */
export class MoodleError extends Error {
  constructor({ errorcode, message, debuginfo }) {
    super(`[${errorcode}] ${message}${debuginfo ? ` | ${debuginfo}` : ''}`);
    this.name = 'MoodleError';
    this.errorcode = errorcode;
    this.status = MoodleError.statusFor(errorcode);
  }

  /** Traduce los códigos de error de Moodle a códigos HTTP. */
  static statusFor(errorcode = '') {
    if (/^invalidrecord|^invalidcourseid|^invalidcoursemodule/i.test(errorcode)) return 404;
    if (/requireloginerror|nopermissions|notenrolled|accessexception|cannot/i.test(errorcode)) return 403;
    return 400;
  }
}
