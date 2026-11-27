import 'dotenv/config';

/**
 * Configuración leída del archivo .env (ver .env.example).
 * Si falta una variable obligatoria, el servidor no arranca y dice cuál es.
 */
function required(name, fallbackName) {
  const value = process.env[name] || (fallbackName && process.env[fallbackName]);
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name} en el archivo .env`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,

  moodle: {
    /** Endpoint REST de Moodle: http://<host>/webservice/rest/server.php */
    url: required('MOODLE_URL'),
    /** Token del admin para el servicio externo (MOODLE_API_TOKEN se acepta por compatibilidad). */
    adminToken: required('MOODLE_TOKEN', 'MOODLE_API_TOKEN'),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES || '1d',
  },

  forumReminder: {
    /** Cada cuánto corre el job (sintaxis cron). */
    cron: process.env.FORUM_REMINDER_CRON || '*/5 * * * *',
    /** Cuántos minutos antes del cierre del foro se avisa. */
    windowMinutes: Number(process.env.FORUM_REMINDER_WINDOW_MINUTES) || 24 * 60,
  },
};

// Prisma lee DATABASE_URL directamente; se valida aquí para fallar pronto.
required('DATABASE_URL');
