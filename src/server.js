import { env } from './config/env.js'; // primero: valida el .env antes de cargar lo demás
import app from './app.js';
import { startJobs } from './jobs/index.js';

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
});

startJobs();
