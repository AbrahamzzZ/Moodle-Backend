import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/moodle.route.js';
import notificationRoutes from './routes/notification.route.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', coursesRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;
