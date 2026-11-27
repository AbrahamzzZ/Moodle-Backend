import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import coursesRoutes from './modules/courses/courses.routes.js';
import activitiesRoutes from './modules/activities/activities.routes.js';
import forumRoutes from './modules/forum/forum.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import resourcesRoutes from './modules/resources/resources.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import gradesRoutes from './modules/grades/grades.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';

/**
 * Cada módulo define sus rutas en modules/<módulo>/<módulo>.routes.js.
 */
const api = Router();

api.use('/auth', authRoutes); 
api.use('/forum', forumRoutes); 
api.use('/notifications', notificationsRoutes);
api.use(coursesRoutes);
api.use(activitiesRoutes);
api.use(tasksRoutes);
api.use(resourcesRoutes); 
api.use(profileRoutes); 
api.use(gradesRoutes);

export default api;
