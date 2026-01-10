const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../prismaClient');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      const email = profile.emails[0].value;
      const nombre = profile.displayName;

      let user = await prisma.usuario.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.usuario.create({
          data: {
            nombre,
            email,
            rol: 'ESTUDIANTE',
            tokenOAuth: accessToken,
            tokenMoodle: '',
            activo: true
          }
        });
      }

      return done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.usuario.findUnique({ where: { id } });
  done(null, user);
});
