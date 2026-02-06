import app from './app.js';
import './config/jobs/cron.js'; 

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});