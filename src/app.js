require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth/google.strategy');

const app = express();

app.use(express.json());
app.use(session({
  secret: 'un-secretito',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {  res.json({ message: 'Login exitoso', user: req.user }); }
);

module.exports = app;
