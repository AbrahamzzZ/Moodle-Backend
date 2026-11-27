import fs from 'fs/promises';

export function notFoundHandler(req, res) {
  res.status(404).json({ ok: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (req.file?.path) fs.unlink(req.file.path).catch(() => {});

  const status = error.status || 500;
  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
  }

  res.status(status).json({ ok: false, message: error.message || 'Error interno del servidor' });
}
