import { badRequest } from './errors.js';

/** Convierte a entero positivo o lanza 400. */
export function toId(value, name) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest(`${name} es requerido y debe ser un número válido`);
  }
  return id;
}

/** ?courseIds=1&courseIds=2  o  ?courseIds=1  →  [1, 2] */
export function toIdList(value, name) {
  if (value === undefined || value === '') throw badRequest(`${name} es requerido`);
  const values = Array.isArray(value) ? value : [value];
  return values.map(v => toId(v, name));
}

/** Lanza 400 si falta alguno de los campos. */
export function requireFields(body = {}, fields) {
  const missing = fields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    // "postId, message y courseId son requeridos"
    const list = fields.length > 1 ? `${fields.slice(0, -1).join(', ')} y ${fields.at(-1)}` : fields[0];
    throw badRequest(`${list} ${fields.length > 1 ? 'son requeridos' : 'es requerido'}`);
  }
}
