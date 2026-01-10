import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import userRoutes from './routes/user.route.js';
import coursesRoutes from './routes/moodle.route.js';
import './auth/google.strategy.js';

const app = express();

app.use(express.json());

app.use(session({
  secret: 'un-secretito',
  resave: false,
  saveUninitialized: true
}));
app.use('/api/users', userRoutes);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', coursesRoutes);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.json({ message: 'Login exitoso', user: req.user });
  }
);

export default app;
