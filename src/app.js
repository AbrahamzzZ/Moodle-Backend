import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/course.route.js';
import notificationRoutes from './routes/notification.route.js';
import forumRoutes from './routes/forum.route.js';
import activitiesRoutes from './routes/activities.route.js';
import resourceRoutes from './routes/resource.route.js';
import taskRoutes from './routes/task.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', coursesRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', taskRoutes);
app.use('/api', activitiesRoutes);
app.use('/api', resourceRoutes);

export default app;
